import { supabase } from "./supabase";

export async function createOrderAndCompletePayment({ customer, items }) {
  const { data: response, error } = await supabase.functions.invoke(
    "clever-task",
    {
      body: {
        customer,
        items,
      },
    },
  );

  if (error) {
    throw new Error(`Order creation failed: ${error.message}`);
  }

  if (!response?.success || !response.orderId || !response.orderAccessToken) {
    throw new Error("The server returned an invalid order response.");
  }

  const { orderId, orderAccessToken } = response;

  // Keep the order access token in this browser session.
  sessionStorage.setItem(`nannas-pizza-order-${orderId}`, orderAccessToken);

  const { data: paymentResponse, error: paymentError } =
    await supabase.functions.invoke("complete-fake-payment", {
      body: {
        orderId,
        orderAccessToken,
      },
    });

  if (paymentError) {
    throw new Error(`Payment failed: ${paymentError.message}`);
  }

  if (!paymentResponse?.success || paymentResponse.paymentStatus !== "paid") {
    throw new Error("The payment could not be completed.");
  }

  return { orderId };
}
