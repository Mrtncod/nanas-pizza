const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or publishable key.");
  process.exit(1);
}

const headers = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
  "Content-Type": "application/json",
};

const endpoint = (name) => `${supabaseUrl}/functions/v1/${name}`;

let failures = 0;

async function request(name, options = {}) {
  return fetch(endpoint(name), {
    ...options,
    headers: { ...headers, ...options.headers },
  });
}

async function check(name, response, expectedStatuses) {
  const passed = expectedStatuses.includes(response.status);

  console.log(
    `${passed ? "PASS" : "FAIL"} | ${name} | HTTP ${response.status}`,
  );

  if (!passed) {
    failures++;
    console.log("Response:", await response.text());
  }

  return passed;
}

async function post(name, body) {
  return request(name, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function main() {
  console.log("\nTesting complete-fake-payment security\n");

  // Basic request validation tests.
  await check(
    "Reject malformed order ID",
    await post("complete-fake-payment", {
      orderId: "not-a-uuid",
      orderAccessToken: "a".repeat(64),
    }),
    [400],
  );

  await check(
    "Reject malformed access token",
    await post("complete-fake-payment", {
      orderId: "00000000-0000-4000-8000-000000000000",
      orderAccessToken: "too-short",
    }),
    [400],
  );

  await check(
    "Reject unknown order credentials",
    await post("complete-fake-payment", {
      orderId: "00000000-0000-4000-8000-000000000000",
      orderAccessToken: "a".repeat(64),
    }),
    [404],
  );

  await check(
    "Reject GET requests",
    await request("complete-fake-payment", { method: "GET" }),
    [405],
  );

  // Find an available pizza to create a realistic test order.
  console.log("\nCreating a test order...\n");

  const pizzaResponse = await fetch(
    `${supabaseUrl}/rest/v1/pizzas?select=id&sold_out=eq.false&limit=1`,
    { headers },
  );

  if (!pizzaResponse.ok) {
    throw new Error(
      `Could not find an available pizza: HTTP ${pizzaResponse.status}. ` +
        (await pizzaResponse.text()),
    );
  }

  const pizzas = await pizzaResponse.json();

  if (!pizzas.length) {
    throw new Error("No available pizzas found for the test order.");
  }

  // This calls clever-task directly. It does NOT call payment automatically.
  const orderResponse = await post("clever-task", {
    customer: {
      fullName: "Security Test",
      email: "security-test@example.com",
      phone: "0000000000",
      address: "1 Test Street",
      city: "Test City",
      postalCode: "00000",
      notes: "Automated security test order",
    },
    items: [
      {
        pizzaId: pizzas[0].id,
        quantity: 1,
      },
    ],
  });

  if (!orderResponse.ok) {
    throw new Error(
      `Test order creation failed: HTTP ${orderResponse.status}. ` +
        (await orderResponse.text()),
    );
  }

  const created = await orderResponse.json();

  if (!created.success || !created.orderId || !created.orderAccessToken) {
    throw new Error(
      `Unexpected order creation response: ${JSON.stringify(created)}`,
    );
  }

  const { orderId, orderAccessToken } = created;

  console.log("Test order created:", orderId);
  console.log("Payment has not yet been requested.\n");

  // Wrong token must not authorize payment.
  await check(
    "Reject wrong token for an existing order",
    await post("complete-fake-payment", {
      orderId,
      orderAccessToken: "b".repeat(64),
    }),
    [404],
  );

  // Complete the simulated payment with the real access token.
  const paymentResponse = await post("complete-fake-payment", {
    orderId,
    orderAccessToken,
  });

  const paymentPassed = await check(
    "Complete payment with correct credentials",
    paymentResponse,
    [200],
  );

  if (!paymentPassed) {
    throw new Error("Payment failed; stopping before the retry test.");
  }

  const paymentResult = await paymentResponse.json();

  if (
    paymentResult.paymentStatus !== "paid" ||
    paymentResult.orderStatus !== "confirmed"
  ) {
    failures++;
    console.log("FAIL | Payment returned unexpected order state");
    console.log(paymentResult);
  } else {
    console.log("PASS | Payment returns paid/confirmed state");
  }

  // Repeating the same request should not change the order again.
  const retryResponse = await post("complete-fake-payment", {
    orderId,
    orderAccessToken,
  });

  const retryPassed = await check(
    "Retry an already completed payment",
    retryResponse,
    [200],
  );

  if (retryPassed) {
    const retryResult = await retryResponse.json();

    if (
      retryResult.paymentStatus === "paid" &&
      retryResult.orderStatus === "confirmed" &&
      retryResult.message === "Payment was already completed."
    ) {
      console.log("PASS | Retry is idempotent");
    } else {
      failures++;
      console.log("FAIL | Unexpected retry response:", retryResult);
    }
  }

  // ==========================================
  // Concurrency test: two requests at once
  // ==========================================

  console.log("\nTesting simultaneous payment requests...\n");

  const concurrentOrderResponse = await post("clever-task", {
    customer: {
      fullName: "Concurrency Test",
      email: "concurrency-test@example.com",
      phone: "0000000000",
      address: "2 Test Street",
      city: "Test City",
      postalCode: "00000",
      notes: "Automated concurrency security test order",
    },
    items: [
      {
        pizzaId: pizzas[0].id,
        quantity: 1,
      },
    ],
  });

  if (!concurrentOrderResponse.ok) {
    throw new Error(
      `Concurrency test order creation failed: HTTP ${concurrentOrderResponse.status}. ` +
        (await concurrentOrderResponse.text()),
    );
  }

  const concurrentOrder = await concurrentOrderResponse.json();

  if (
    !concurrentOrder.success ||
    !concurrentOrder.orderId ||
    !concurrentOrder.orderAccessToken
  ) {
    throw new Error("Could not create the concurrency test order.");
  }

  console.log("Concurrency test order:", concurrentOrder.orderId);

  const paymentBody = {
    orderId: concurrentOrder.orderId,
    orderAccessToken: concurrentOrder.orderAccessToken,
  };

  // Send both requests without waiting for either to finish.
  const [responseA, responseB] = await Promise.all([
    post("complete-fake-payment", paymentBody),
    post("complete-fake-payment", paymentBody),
  ]);

  const [resultA, resultB] = await Promise.all([
    responseA.json(),
    responseB.json(),
  ]);

  console.log("Request A:", responseA.status, resultA);
  console.log("Request B:", responseB.status, resultB);

  const acceptedStatuses = [200, 409];

  if (
    !acceptedStatuses.includes(responseA.status) ||
    !acceptedStatuses.includes(responseB.status)
  ) {
    failures++;
    console.log("FAIL | Concurrent requests returned unexpected HTTP statuses");
  } else {
    console.log("PASS | Both concurrent responses are acceptable");
  }

  const results = [
    { status: responseA.status, body: resultA },
    { status: responseB.status, body: resultB },
  ];

  const firstPaymentCount = results.filter(
    ({ status, body }) =>
      status === 200 &&
      body.message === "Simulated payment completed successfully." &&
      body.paymentStatus === "paid",
  ).length;

  const retryCount = results.filter(
    ({ status, body }) =>
      status === 200 &&
      body.message === "Payment was already completed." &&
      body.paymentStatus === "paid",
  ).length;

  const conflictCount = results.filter(({ status }) => status === 409).length;

  if (
    firstPaymentCount === 1 &&
    firstPaymentCount + retryCount + conflictCount === 2
  ) {
    console.log("PASS | Exactly one request performed the payment transition");
  } else {
    failures++;
    console.log("FAIL | Unexpected concurrent payment outcomes", {
      firstPaymentCount,
      retryCount,
      conflictCount,
    });
  }

  console.log("\n----------------------------------------");
  console.log(
    failures === 0
      ? "All security checks passed."
      : `${failures} security check(s) failed.`,
  );
  console.log("Test order ID:", orderId);
  console.log("----------------------------------------\n");

  if (failures > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error("\nTEST RUN FAILED:", error.message);
  process.exitCode = 1;
});
