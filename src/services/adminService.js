import { supabase } from "./supabase";

function getPizzaImagePath(imageUrl) {
  if (!imageUrl) return null;

  try {
    const url = new URL(imageUrl);

    const marker = "/storage/v1/object/public/pizza-images/";

    const index = url.pathname.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

async function deletePizzaImage(imageUrl) {
  const imagePath = getPizzaImagePath(imageUrl);

  if (!imagePath) {
    console.warn("Could not determine pizza image path:", imageUrl);

    return false;
  }

  const { data, error } = await supabase.storage
    .from("pizza-images")
    .remove([imagePath]);

  if (error) {
    console.error("Could not delete pizza image:", imagePath, error);

    return false;
  }

  console.log("Pizza image deleted successfully:", imagePath, data);

  return true;
}

export async function getAdminDashboardOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, customer_name, status, total_price, payment_status, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load admin dashboard orders: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminOrders({
  page = 1,
  pageSize = 10,
  search = "",
  status = "all",
  payment = "all",
  dateRange = "all",
} = {}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from("orders")
    .select(
      ` id, customer_name, customer_email, customer_phone, address, city, postal_code, notes, status, total_price, payment_status, created_at, updated_at, order_items ( id, pizza_id, pizza_name, quantity, unit_price ) `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });
  const searchTerm = search.trim();
  if (searchTerm) {
    const isOrderId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        searchTerm,
      );
    if (isOrderId) {
      query = query.eq("id", searchTerm);
    } else {
      query = query.or(
        `customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`,
      );
    }
  }
  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (payment !== "all") {
    query = query.eq("payment_status", payment);
  }
  if (dateRange !== "all") {
    const now = new Date();
    let startDate;
    let endDate;
    if (dateRange === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (dateRange === "yesterday") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
      );
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateRange === "7days") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 6,
      );
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (dateRange === "30days") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 29,
      );
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (dateRange === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (dateRange === "lastMonth") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateRange === "90days") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 89,
      );
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (dateRange === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
    } else if (dateRange === "lastYear") {
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear(), 0, 1);
    }
    if (startDate && endDate) {
      query = query
        .gte("created_at", startDate.toISOString())
        .lt("created_at", endDate.toISOString());
    }
  }
  const { data, error, count } = await query.range(from, to);
  if (error) {
    throw new Error(`Could not load admin orders: ${error.message}`);
  }
  return { orders: data ?? [], totalCount: count ?? 0 };
}

export async function getAdminOrderById(orderId) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        customer_name,
        customer_email,
        customer_phone,
        address,
        city,
        postal_code,
        notes,
        status,
        total_price,
        payment_status,
        created_at,
        updated_at,
        order_items (
          id,
          pizza_id,
          pizza_name,
          quantity,
          unit_price,
          created_at
        )
      `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    throw new Error(`Could not load admin order: ${error.message}`);
  }

  return data;
}

export async function getAdminOrderHistory(orderId) {
  const { data: history, error: historyError } = await supabase
    .from("order_status_history")
    .select(
      `
        id,
        order_id,
        old_status,
        new_status,
        changed_by,
        created_at
      `,
    )
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (historyError) {
    throw new Error(`Could not load order history: ${historyError.message}`);
  }

  if (!history?.length) {
    return [];
  }

  const actorIds = [
    ...new Set(history.map((event) => event.changed_by).filter(Boolean)),
  ];

  if (!actorIds.length) {
    return history;
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .in("id", actorIds);

  if (profilesError) {
    throw new Error(
      `Could not load order history actors: ${profilesError.message}`,
    );
  }

  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

  return history.map((event) => ({
    ...event,
    actor: event.changed_by ? (profileMap.get(event.changed_by) ?? null) : null,
  }));
}

export async function getAdminProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(`Could not load admin profile: ${error.message}`);
  }

  return data;
}

export async function getAdminRevenueAnalytics(period) {
  const { data, error } = await supabase.rpc("get_admin_revenue_analytics", {
    p_period: String(period),
  });

  if (error) {
    throw new Error(`Could not load admin revenue analytics: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminPopularPizzas() {
  const { data, error } = await supabase.rpc("get_admin_popular_pizzas");

  if (error) {
    throw new Error(`Could not load popular pizzas: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminSalesSummary({
  startDate = null,
  endDate = null,
} = {}) {
  const { data, error } = await supabase.rpc("get_admin_sales_summary", {
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    throw new Error(`Could not load admin sales summary: ${error.message}`);
  }

  return data;
}

export async function getAdminSalesComparison({
  startDate = null,
  endDate = null,
} = {}) {
  const { data, error } = await supabase.rpc("get_admin_sales_comparison", {
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    throw new Error(`Could not load admin sales comparison: ${error.message}`);
  }

  return data;
}

export async function getAdminSalesInsights({
  startDate = null,
  endDate = null,
} = {}) {
  const { data, error } = await supabase.rpc("get_admin_sales_insights", {
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    throw new Error(`Could not load admin sales insights: ${error.message}`);
  }

  return data;
}

export async function getAdminSalesTrend({
  startDate = null,
  endDate = null,
} = {}) {
  const { data, error } = await supabase.rpc("get_admin_sales_trend", {
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    throw new Error(`Could not load admin sales trend: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminSalesPizzaPerformance({
  startDate = null,
  endDate = null,
} = {}) {
  const { data, error } = await supabase.rpc(
    "get_admin_sales_pizza_performance",
    {
      p_start_date: startDate,
      p_end_date: endDate,
    },
  );

  if (error) {
    throw new Error(`Could not load pizza performance: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminSalesPaymentPerformance({
  startDate = null,
  endDate = null,
} = {}) {
  const { data, error } = await supabase.rpc(
    "get_admin_sales_payment_performance",
    {
      p_start_date: startDate,
      p_end_date: endDate,
    },
  );

  if (error) {
    throw new Error(`Could not load payment performance: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminPizzas() {
  const { data, error } = await supabase
    .from("pizzas")
    .select(
      `
        id,
        name,
        description,
        ingredients,
        price,
        sold_out,
        image_url,
        created_at
      `,
    )
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Could not load admin pizzas: ${error.message}`);
  }

  return data ?? [];
}

export async function updateAdminPizzaAvailability(pizzaId, soldOut) {
  const { data, error } = await supabase
    .from("pizzas")
    .update({
      sold_out: soldOut,
    })
    .eq("id", pizzaId)
    .select(
      `
        id,
        name,
        description,
        ingredients,
        price,
        sold_out,
        image_url,
        created_at
      `,
    )
    .single();

  if (error) {
    throw new Error(`Could not update pizza availability: ${error.message}`);
  }

  return data;
}

export async function createAdminPizza({
  name,
  description,
  ingredients,
  price,
  soldOut = false,
}) {
  const { data, error } = await supabase
    .from("pizzas")
    .insert({
      name: name.trim(),
      description: description.trim(),
      ingredients: ingredients.trim(),
      price: Number(price),
      sold_out: soldOut,
    })
    .select(
      `
        id,
        name,
        description,
        ingredients,
        price,
        sold_out,
        image_url,
        created_at
      `,
    )
    .single();

  if (error) {
    throw new Error(`Could not create pizza: ${error.message}`);
  }

  return data;
}

export async function uploadAdminPizzaImage({ pizzaId, file }) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const filePath = `pizzas/${pizzaId}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("pizza-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Could not upload pizza image: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("pizza-images").getPublicUrl(filePath);

  const { data, error: updateError } = await supabase
    .from("pizzas")
    .update({
      image_url: publicUrl,
    })
    .eq("id", pizzaId)
    .select(
      `
        id,
        name,
        description,
        ingredients,
        price,
        sold_out,
        image_url,
        created_at
      `,
    )
    .single();

  if (updateError) {
    await supabase.storage.from("pizza-images").remove([filePath]);

    throw new Error(`Could not save pizza image URL: ${updateError.message}`);
  }

  return data;
}

export async function deleteAdminPizza(pizzaId) {
  const { count, error: orderItemsError } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("pizza_id", pizzaId);

  if (orderItemsError) {
    throw new Error(
      `Could not check pizza order history: ${orderItemsError.message}`,
    );
  }

  if (count > 0) {
    throw new Error(
      "This pizza cannot be deleted because it has already been included in an order.",
    );
  }

  const { data: pizza, error: pizzaError } = await supabase
    .from("pizzas")
    .select("id, image_url")
    .eq("id", pizzaId)
    .single();

  if (pizzaError) {
    throw new Error(
      `Could not load pizza before deletion: ${pizzaError.message}`,
    );
  }

  const { error: deleteError } = await supabase
    .from("pizzas")
    .delete()
    .eq("id", pizzaId);

  if (deleteError) {
    throw new Error(`Could not delete pizza: ${deleteError.message}`);
  }
  // The database row is safely deleted.
  // Now clean up its Storage image.
  if (pizza.image_url) {
    await deletePizzaImage(pizza.image_url);
  }

  return pizza;
}

export async function updateAdminPizza({
  pizzaId,
  name,
  description,
  ingredients,
  price,
  soldOut,
  image = null,
  removeImage = false,
  oldImageUrl = null,
}) {
  let newImageUrl = oldImageUrl;
  let newImagePath = null;

  // --------------------------------------------------
  // 1. Upload a new image first.
  // --------------------------------------------------

  if (image) {
    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";

    newImagePath = `pizzas/${pizzaId}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("pizza-images")
      .upload(newImagePath, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Could not upload pizza image: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("pizza-images").getPublicUrl(newImagePath);

    newImageUrl = publicUrl;
  }

  // --------------------------------------------------
  // 2. If the admin removed the existing image,
  //    prepare the database value as null.
  // --------------------------------------------------

  if (removeImage && !image) {
    newImageUrl = null;
  }

  // --------------------------------------------------
  // 3. Update the pizza row.
  // --------------------------------------------------

  const { data, error } = await supabase
    .from("pizzas")
    .update({
      name: name.trim(),
      description: description.trim(),
      ingredients: ingredients.trim(),
      price: Number(price),
      sold_out: soldOut,
      image_url: newImageUrl,
    })
    .eq("id", pizzaId)
    .select(
      `
        id,
        name,
        description,
        ingredients,
        price,
        sold_out,
        image_url,
        created_at
      `,
    )
    .single();

  // --------------------------------------------------
  // 4. If the database update fails, remove the new
  //    upload so we don't leave an orphaned file.
  // --------------------------------------------------

  if (error) {
    if (newImagePath) {
      await supabase.storage.from("pizza-images").remove([newImagePath]);
    }

    throw new Error(`Could not update pizza: ${error.message}`);
  }

  // --------------------------------------------------
  // 5. Database is now correct.
  //    Only now remove the old image.
  // --------------------------------------------------

  if (oldImageUrl && oldImageUrl !== newImageUrl) {
    await deletePizzaImage(oldImageUrl);
  }

  return data;
}

export async function updateAdminProfileName(userId, fullName) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
