import { useState } from "react";
import { Link, useOutletContext } from "react-router";

import { formatCurrency } from "../../utils/helpers";

import { useStaffOrders } from "../../hooks/useStaffOrders";
import { useUpdateStaffOrderStatus } from "../../hooks/useUpdateStaffOrderStatus";

function getStatusStyle(status) {
  const styles = {
    pending: "bg-golden-500/10 text-golden-600",
    confirmed: "bg-golden-500/10 text-golden-600",
    preparing: "bg-tomato-400/10 text-tomato-600",
    ready: "bg-basil-500/10 text-basil-600",
    out_for_delivery: "bg-tomato-500/10 text-tomato-600",
    delivered: "bg-basil-600/10 text-basil-700",
  };

  return styles[status] || "bg-warm-gray/10 text-warm-gray";
}

function getPaymentStyle(status) {
  const styles = {
    paid: "bg-basil-500/10 text-basil-600",
    pending: "bg-golden-500/10 text-golden-600",
    failed: "bg-tomato-400/10 text-tomato-600",
  };

  return styles[status] || "bg-warm-gray/10 text-warm-gray";
}

function StaffOrders() {
  const { profile } = useOutletContext();

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading, isError, error, refetch } = useStaffOrders(
    page,
    pageSize,
  );

  const statusMutation = useUpdateStaffOrderStatus();

  const orders = data?.orders ?? [];
  const totalCount = data?.totalCount ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const updatingOrderId = statusMutation.isPending
    ? statusMutation.variables?.orderId
    : null;

  const errorMessage = error?.message || statusMutation.error?.message;

  function handleStatusUpdate(orderId, newStatus) {
    statusMutation.mutate({
      orderId,
      newStatus,
    });
  }

  // Keep the current page valid if the total number of orders decreases.

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-warm-gray">Loading orders...</p>
      </div>
    );
  }

  if (isError || statusMutation.isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl bg-tomato-400/10 p-6">
          <p className="font-semibold text-tomato-600">{errorMessage}</p>

          <button
            type="button"
            onClick={() => {
              statusMutation.reset();
              refetch();
            }}
            className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-espresso shadow-sm transition hover:bg-cream"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-basil-600">
            ORDER MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-espresso">Orders</h1>

          <p className="mt-2 max-w-2xl text-warm-gray">
            Manage incoming orders and keep the kitchen and delivery workflow
            moving.
          </p>
        </div>

        <div className="self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-espresso shadow-sm sm:self-auto">
          {totalCount} {totalCount === 1 ? "order" : "orders"}
        </div>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-warm-gray">No orders yet.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order header */}
                <div className="flex flex-col gap-5 border-b border-warm-border/70 bg-cream/40 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold tracking-wide text-basil-600">
                      Order #{order.id.slice(0, 8)}
                    </p>

                    <h2 className="mt-1 text-base font-bold text-espresso">
                      {order.customer_name || "Guest"}
                    </h2>

                    <p className="mt-1 text-sm text-warm-gray">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1.5 text-s font-bold capitalize ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-s font-bold capitalize ${getPaymentStyle(
                        order.payment_status,
                      )}`}
                    >
                      Payment: {order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Customer information */}
                <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl bg-cream/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Contact
                    </p>

                    <p className="mt-2 break-words text-sm font-medium text-espresso">
                      {order.customer_email}
                    </p>

                    <p className="mt-1 text-sm text-warm-gray">
                      {order.customer_phone}
                    </p>
                  </div>

                  <div className="rounded-xl bg-cream/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Delivery address
                    </p>

                    <p className="mt-2 text-sm font-medium text-espresso">
                      {order.address}
                    </p>

                    <p className="mt-1 text-sm text-warm-gray">
                      {order.postal_code} {order.city}
                    </p>
                  </div>

                  <div className="rounded-xl bg-basil-500/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Total
                    </p>

                    <p className="mt-2 text-2xl font-bold text-espresso">
                      {formatCurrency(Number(order.total_price))}
                    </p>
                  </div>
                </div>

                {/* Order items */}
                <div className="border-t border-warm-border/70 px-6 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Items
                  </p>

                  <div className="mt-3 space-y-3">
                    {(order.order_items ?? []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-warm-border/50 bg-cream/60 px-4 py-4 transition hover:bg-cream"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-basil-500/10 px-2 text-sm font-bold text-basil-600">
                            {item.quantity}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-espresso">
                              {item.pizza_name}
                            </p>

                            <p className="mt-0.5 text-sm text-warm-gray">
                              {formatCurrency(Number(item.unit_price))} each
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 font-semibold text-espresso">
                          {formatCurrency(
                            Number(item.unit_price) * item.quantity,
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer notes */}
                {order.notes && (
                  <div className="mx-6 mt-5 rounded-xl bg-golden-400/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-golden-600">
                      Customer note
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-espresso">
                      {order.notes}
                    </p>
                  </div>
                )}

                {/* Order actions */}
                <div className="mt-6 flex flex-col gap-3 border-t border-warm-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-3">
                    {/* Kitchen: pending/confirmed → preparing */}
                    {profile.role === "staff" &&
                      ["pending", "confirmed"].includes(order.status) && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusUpdate(order.id, "preparing")
                          }
                          disabled={updatingOrderId === order.id}
                          className="rounded-full bg-basil-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-basil-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingOrderId === order.id
                            ? "Starting..."
                            : "Start preparing"}
                        </button>
                      )}

                    {/* Kitchen: preparing → ready */}
                    {profile.role === "staff" &&
                      order.status === "preparing" && (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(order.id, "ready")}
                          disabled={updatingOrderId === order.id}
                          className="rounded-full bg-golden-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-golden-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingOrderId === order.id
                            ? "Updating..."
                            : "Mark as ready"}
                        </button>
                      )}

                    {/* Delivery: ready → out for delivery */}
                    {profile.role === "delivery" &&
                      order.status === "ready" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusUpdate(order.id, "out_for_delivery")
                          }
                          disabled={updatingOrderId === order.id}
                          className="rounded-full bg-tomato-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-tomato-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingOrderId === order.id
                            ? "Updating..."
                            : "Out for delivery"}
                        </button>
                      )}

                    {/* Delivery: out for delivery → delivered */}
                    {profile.role === "delivery" &&
                      order.status === "out_for_delivery" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusUpdate(order.id, "delivered")
                          }
                          disabled={updatingOrderId === order.id}
                          className="rounded-full bg-basil-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-basil-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingOrderId === order.id
                            ? "Updating..."
                            : "Mark delivered"}
                        </button>
                      )}
                  </div>

                  <Link
                    to={`/staff/orders/${order.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-basil-500/30 px-4 py-2 text-sm font-semibold text-basil-600 transition hover:bg-basil-500/10"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-warm-border/60 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-warm-gray">
              Showing {page * pageSize + 1}–
              {Math.min((page + 1) * pageSize, totalCount)} of {totalCount}{" "}
              orders
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => current - 1)}
                disabled={page === 0}
                className="rounded-xl border border-warm-border px-4 py-2 text-sm font-medium text-espresso transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="whitespace-nowrap text-sm text-warm-gray">
                Page {page + 1} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= totalPages - 1}
                className="rounded-xl border border-warm-border px-4 py-2 text-sm font-medium text-espresso transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StaffOrders;
// import { useEffect, useState } from "react";
// import { supabase } from "../../services/supabase";
// import { formatCurrency } from "../../utils/helpers";
// import { Link, useOutletContext } from "react-router";

// function StaffOrders() {
//   const [orders, setOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updatingOrderId, setUpdatingOrderId] = useState(null);
//   const { profile } = useOutletContext();

//   useEffect(() => {
//     async function loadOrders(showLoading = false) {
//       if (showLoading) {
//         setIsLoading(true);
//       }

//       setError("");

//       const { data, error } = await supabase
//         .from("orders")
//         .select(
//           `
//           id,
//           customer_name,
//           customer_email,
//           customer_phone,
//           address,
//           city,
//           postal_code,
//           notes,
//           status,
//           total_price,
//           payment_status,
//           created_at,
//           order_items (
//             id,
//             pizza_id,
//             pizza_name,
//             quantity,
//             unit_price
//           )
//         `,
//         )
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Could not load orders:", error);
//         setError("Could not load orders.");
//         setIsLoading(false);
//         return;
//       }

//       setOrders(data ?? []);
//       setIsLoading(false);
//     }

//     // Load orders when the page first opens.
//     loadOrders(true);

//     // Listen for changes to the orders table.
//     const channel = supabase
//       .channel("staff-orders-changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "orders",
//         },
//         () => {
//           // Refresh the order data when a database change arrives.
//           loadOrders();
//         },
//       )
//       .subscribe((status) => {
//         if (status === "CHANNEL_ERROR") {
//           console.error("Could not subscribe to order updates.");
//         }
//       });

//     // Clean up the subscription when leaving the page.
//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   async function updateOrderStatus(orderId, newStatus) {
//     setUpdatingOrderId(orderId);
//     setError("");

//     try {
//       const { data, error } = await supabase.rpc("update_order_status", {
//         p_order_id: orderId,
//         p_new_status: newStatus,
//       });

//       if (error) {
//         console.error("Could not update order status:", error);
//         setError(error.message);
//         return;
//       }

//       setOrders((currentOrders) =>
//         currentOrders.map((order) =>
//           order.id === orderId ? { ...order, status: data.status } : order,
//         ),
//       );
//     } catch (err) {
//       console.error("Unexpected error updating order:", err);
//       setError("Something went wrong while updating the order.");
//     } finally {
//       setUpdatingOrderId(null);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
//         <p className="text-warm-gray">Loading orders...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
//         <div className="rounded-2xl bg-tomato-400/10 p-6">
//           <p className="font-semibold text-tomato-600">{error}</p>
//           <button
//             type="button"
//             onClick={() => window.location.reload()}
//             className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-espresso shadow-sm transition hover:bg-cream"
//           >
//             Reload page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   function getStatusStyle(status) {
//     const styles = {
//       pending: "bg-golden-500/10 text-golden-600",
//       confirmed: "bg-golden-500/10 text-golden-600",
//       preparing: "bg-tomato-400/10 text-tomato-600",
//       ready: "bg-basil-500/10 text-basil-600",
//       out_for_delivery: "bg-tomato-500/10 text-tomato-600",
//       delivered: "bg-basil-600/10 text-basil-700",
//     };

//     return styles[status] || "bg-warm-gray/10 text-warm-gray";
//   }

//   function getPaymentStyle(status) {
//     const styles = {
//       paid: "bg-basil-500/10 text-basil-600",
//       pending: "bg-golden-500/10 text-golden-600",
//       failed: "bg-tomato-400/10 text-tomato-600",
//     };

//     return styles[status] || "bg-warm-gray/10 text-warm-gray";
//   }

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <p className="text-sm font-semibold tracking-wide text-basil-600">
//             ORDER MANAGEMENT
//           </p>

//           <h1 className="mt-2 text-3xl font-bold text-espresso">Orders</h1>

//           <p className="mt-2 text-warm-gray">
//             Manage incoming orders and keep the kitchen and delivery workflow
//             moving.
//           </p>
//         </div>

//         <div className="self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-espresso shadow-sm sm:self-auto">
//           {orders.length} {orders.length === 1 ? "order" : "orders"}
//         </div>
//       </div>

//       {orders.length === 0 ? (
//         <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
//           <p className="text-warm-gray">No orders yet.</p>
//         </div>
//       ) : (
//         <div className="mt-8 space-y-5">
//           {orders.map((order) => (
//             <div
//               key={order.id}
//               className="overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-sm transition hover:shadow-md"
//             >
//               {/* Order header */}
//           <div className="flex flex-col gap-5 border-b border-warm-border/70 bg-cream/40 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
//                   <p className="text-sm font-semibold text-basil-600">
//                     Order #{order.id.slice(0, 8)}
//                   </p>

//                   <h2 className="mt-1 text-xl font-bold text-espresso">
//                     {order.customer_name}
//                   </h2>

//                   <p className="mt-1 text-sm text-warm-gray">
//                     {new Date(order.created_at).toLocaleString()}
//                   </p>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   <span className="rounded-full bg-basil-400/10 px-3 py-1 text-sm font-semibold capitalize text-basil-600">
//                     {order.status.replaceAll("_", " ")}
//                   </span>

//                   <span className="rounded-full bg-golden-400/10 px-3 py-1 text-sm font-semibold capitalize text-golden-600">
//                     Payment: {order.payment_status}
//                   </span>
//                 </div>
//               </div>

//               {/* Customer information */}
//               <div className="grid gap-6 py-5 sm:grid-cols-2 lg:grid-cols-3">
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wide text-muted">
//                     Contact
//                   </p>

//                   <p className="mt-1 text-sm text-espresso">
//                     {order.customer_email}
//                   </p>

//                   <p className="text-sm text-warm-gray">
//                     {order.customer_phone}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wide text-muted">
//                     Delivery address
//                   </p>

//                   <p className="mt-1 text-sm text-espresso">{order.address}</p>

//                   <p className="text-sm text-warm-gray">
//                     {order.postal_code} {order.city}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wide text-muted">
//                     Total
//                   </p>

//                   <p className="mt-1 text-xl font-bold text-espresso">
//                     {formatCurrency(order.total_price)}
//                   </p>
//                 </div>
//               </div>

//               {/* Order items */}
//               <div className="border-t border-warm-border pt-5">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-muted">
//                   Items
//                 </p>

//                 <div className="mt-3 space-y-3">
//                   {order.order_items.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex items-center justify-between gap-4 rounded-xl bg-cream px-4 py-3"
//                     >
//                       <div>
//                         <p className="font-semibold text-espresso">
//                           {item.quantity} × {item.pizza_name}
//                         </p>

//                         <p className="text-sm text-warm-gray">
//                           {formatCurrency(item.unit_price)} each
//                         </p>
//                       </div>

//                       <p className="font-semibold text-espresso">
//                         {formatCurrency(item.quantity * item.unit_price)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Customer notes */}

//               {order.notes && (
//                 <div className="mt-5 rounded-xl bg-golden-400/10 p-4">
//                   <p className="text-xs font-semibold uppercase tracking-wide text-golden-600">
//                     Customer note
//                   </p>

//                   <p className="mt-1 text-sm text-espresso">{order.notes}</p>
//                 </div>
//               )}

//               {/* Start preparing */}

//               {/* Order actions */}

//               {/* Kitchen: confirmed/pending → preparing */}
//               {profile.role === "staff" &&
//                 ["pending", "confirmed"].includes(order.status) && (
//                   <button
//                     type="button"
//                     onClick={() => updateOrderStatus(order.id, "preparing")}
//                     disabled={updatingOrderId === order.id}
//                     className="rounded-full bg-basil-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-basil-600 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {updatingOrderId === order.id
//                       ? "Starting..."
//                       : "Start preparing"}
//                   </button>
//                 )}

//               {/* Kitchen: preparing → ready */}
//               {profile.role === "staff" && order.status === "preparing" && (
//                 <button
//                   type="button"
//                   onClick={() => updateOrderStatus(order.id, "ready")}
//                   disabled={updatingOrderId === order.id}
//                   className="rounded-full bg-golden-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-golden-600 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {updatingOrderId === order.id
//                     ? "Updating..."
//                     : "Mark as ready"}
//                 </button>
//               )}

//               {/* Delivery: ready → out for delivery */}
//               {profile.role === "delivery" && order.status === "ready" && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     updateOrderStatus(order.id, "out_for_delivery")
//                   }
//                   disabled={updatingOrderId === order.id}
//                   className="rounded-full bg-tomato-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-tomato-600 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {updatingOrderId === order.id
//                     ? "Updating..."
//                     : "Out for delivery"}
//                 </button>
//               )}

//               {/* Delivery: out for delivery → delivered */}
//               {profile.role === "delivery" &&
//                 order.status === "out_for_delivery" && (
//                   <button
//                     type="button"
//                     onClick={() => updateOrderStatus(order.id, "delivered")}
//                     disabled={updatingOrderId === order.id}
//                     className="rounded-full bg-basil-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-basil-600 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {updatingOrderId === order.id
//                       ? "Updating..."
//                       : "Mark delivered"}
//                   </button>
//                 )}
//               <Link
//                 to={`/staff/orders/${order.id}`}
//                 className="text-sm font-semibold text-basil-600 transition hover:text-basil-700"
//               >
//                 View details →
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default StaffOrders;
