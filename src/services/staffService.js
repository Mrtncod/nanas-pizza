import { supabase } from "./supabase";

export async function getStaffOrders({ page, pageSize }) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
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
        order_items (
          id,
          pizza_id,
          pizza_name,
          quantity,
          unit_price
        )
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    orders: data ?? [],
    totalCount: count ?? 0,
  };
}

export async function updateStaffOrderStatus({ orderId, newStatus }) {
  const { data, error } = await supabase.rpc("update_order_status", {
    p_order_id: orderId,
    p_new_status: newStatus,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getStaffDashboardOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, customer_name, status, total_price, payment_status, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getStaffOrderDetails(orderId) {
  // 1. Fetch the order and its items.
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, customer_name, customer_email, customer_phone, address, city, postal_code, notes, status, total_price, payment_status, created_at, updated_at, order_items(id, pizza_id, pizza_name, quantity, unit_price)",
    )
    .eq("id", orderId)
    .single();

  if (orderError) throw new Error(orderError.message);

  // 2. Fetch the order's status history.
  const { data: history, error: historyError } = await supabase
    .from("order_status_history")
    .select("id, old_status, new_status, changed_by, created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (historyError) throw new Error(historyError.message);

  // 3. Collect unique profile IDs from the history.
  const changedByIds = [
    ...new Set(history.map((entry) => entry.changed_by).filter(Boolean)),
  ];

  let profiles = {};

  // 4. Fetch profiles only when there are IDs to look up.
  if (changedByIds.length > 0) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .in("id", changedByIds);

    if (profileError) throw new Error(profileError.message);

    profiles = Object.fromEntries(
      profileData.map((profile) => [
        profile.id,
        {
          full_name: profile.full_name,
          role: profile.role,
        },
      ]),
    );
  }

  // Return the same three data structures the component needs.
  return { order, history, profiles };
}

export async function getStaffProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
