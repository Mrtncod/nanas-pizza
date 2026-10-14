import { Link, useParams } from "react-router";

import { useStaffOrderDetails } from "../../hooks/useStaffOrderDetails";
import { formatCurrency } from "../../utils/helpers";

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

function formatStatus(status) {
  if (!status) return "—";

  return status.replaceAll("_", " ");
}

function StaffOrderDetails() {
  const { orderId } = useParams();

  const { data, isLoading, isError, error, refetch, isFetching } =
    useStaffOrderDetails(orderId);

  const order = data?.order ?? null;
  const history = data?.history ?? [];
  const profiles = data?.profiles ?? {};

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl bg-white p-8 text-center text-warm-gray shadow-sm">
          Loading order...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          to="/staff/orders"
          className="inline-flex text-sm font-semibold text-basil-600 transition hover:text-basil-700"
        >
          ← Back to orders
        </Link>

        <div className="mt-6 rounded-2xl bg-tomato-400/10 p-6">
          <p className="font-semibold text-tomato-600">
            Could not load this order.
          </p>

          <p className="mt-1 text-sm text-tomato-600">{error.message}</p>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-3 text-sm font-semibold text-tomato-600 underline transition hover:text-tomato-700 disabled:opacity-60"
          >
            {isFetching ? "Retrying..." : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        to="/staff/orders"
        className="inline-flex text-sm font-semibold text-basil-600 transition hover:text-basil-700"
      >
        ← Back to orders
      </Link>

      {/* Order header */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-sm">
        <div className="flex flex-col gap-5 bg-cream/40 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wide text-basil-600">
              ORDER DETAILS
            </p>

            <h1 className="mt-2 text-3xl font-bold text-espresso">
              Order #{order.id.slice(0, 8)}
            </h1>

            <p className="mt-2 text-sm text-warm-gray">
              Placed {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <span
            className={`self-start rounded-full px-4 py-2 text-sm font-bold capitalize ${getStatusStyle(
              order.status,
            )}`}
          >
            {formatStatus(order.status)}
          </span>
        </div>
      </div>

      {/* Customer + Delivery */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-warm-border/50 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Customer
          </p>

          <h2 className="mt-2 text-xl font-bold text-espresso">
            {order.customer_name || "Guest"}
          </h2>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-cream/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Email
              </p>

              <p className="mt-1 break-words text-sm font-medium text-espresso">
                {order.customer_email}
              </p>
            </div>

            <div className="rounded-xl bg-cream/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium text-espresso">
                {order.customer_phone}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-warm-border/50 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Delivery
          </p>

          <h2 className="mt-2 text-xl font-bold text-espresso">
            Delivery address
          </h2>

          <div className="mt-5 rounded-xl bg-cream/50 p-4">
            <p className="font-medium text-espresso">{order.address}</p>

            <p className="mt-1 text-sm text-warm-gray">
              {order.postal_code} {order.city}
            </p>
          </div>

          {order.notes && (
            <div className="mt-4 rounded-xl bg-golden-400/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-golden-600">
                Customer note
              </p>

              <p className="mt-2 text-sm leading-relaxed text-espresso">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order items */}
      <div className="mt-6 rounded-2xl border border-warm-border/50 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Order summary
            </p>

            <h2 className="mt-1 text-xl font-bold text-espresso">
              Order items
            </h2>
          </div>

          <span className="text-xl font-bold text-espresso">
            {formatCurrency(Number(order.total_price))}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-warm-border/50 bg-cream/60 px-4 py-4 transition hover:bg-cream"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full bg-basil-500/10 px-2 text-sm font-bold text-basil-600">
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
                  Number(item.unit_price) * Number(item.quantity),
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Payment + total */}
        <div className="mt-6 grid gap-4 border-t border-warm-border/70 pt-5 sm:grid-cols-2">
          <div className="rounded-xl bg-cream/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Payment
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getPaymentStyle(
                order.payment_status,
              )}`}
            >
              {formatStatus(order.payment_status)}
            </span>
          </div>

          <div className="rounded-xl bg-basil-500/5 p-4 sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Order total
            </p>

            <p className="mt-1 text-2xl font-bold text-espresso">
              {formatCurrency(Number(order.total_price))}
            </p>
          </div>
        </div>
      </div>

      {/* Status history */}
      <div className="mt-6 rounded-2xl border border-warm-border/50 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-basil-600">
            Timeline
          </p>

          <h2 className="mt-1 text-xl font-bold text-espresso">
            Status history
          </h2>

          <p className="mt-1 text-sm text-warm-gray">
            A record of every status change for this order.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="mt-6 rounded-xl bg-cream/60 p-5 text-sm text-warm-gray">
            No status history available for this order.
          </div>
        ) : (
          <div className="mt-7">
            {history.map((entry, index) => {
              const changedBy = profiles[entry.changed_by];
              const isLast = index === history.length - 1;

              return (
                <div key={entry.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-[7px] top-4 h-[calc(100%+1.25rem)] w-px bg-warm-border" />
                  )}

                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-white ${getStatusStyle(
                      entry.new_status,
                    )
                      .replace("text-", "bg-")
                      .replace("/10", "")}`}
                  />

                  <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                            entry.new_status,
                          )}`}
                        >
                          {formatStatus(entry.new_status)}
                        </span>

                        <p className="mt-2 text-sm text-warm-gray">
                          {entry.old_status
                            ? `${formatStatus(entry.old_status)} → `
                            : ""}
                          {formatStatus(entry.new_status)}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs text-warm-gray">
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                    </div>

                    {changedBy && (
                      <div className="mt-3 inline-flex rounded-lg bg-cream/60 px-3 py-2 text-xs text-warm-gray">
                        Changed by{" "}
                        <span className="ml-1 font-semibold text-espresso">
                          {changedBy.full_name}
                        </span>
                        <span className="mx-1">·</span>
                        <span className="capitalize">{changedBy.role}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffOrderDetails;

// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router";
// import { supabase } from "../../services/supabase";
// import { formatCurrency } from "../../utils/helpers";

// function getStatusStyle(status) {
//   const styles = {
//     pending: "bg-golden-500/10 text-golden-600",
//     confirmed: "bg-golden-500/10 text-golden-600",
//     preparing: "bg-tomato-400/10 text-tomato-600",
//     ready: "bg-basil-500/10 text-basil-600",
//     out_for_delivery: "bg-tomato-500/10 text-tomato-600",
//     delivered: "bg-basil-600/10 text-basil-700",
//   };

//   return styles[status] || "bg-warm-gray/10 text-warm-gray";
// }

// function formatStatus(status) {
//   if (!status) return "—";

//   return status.replaceAll("_", " ");
// }

// function StaffOrderDetails() {
//   const { orderId } = useParams();

//   const [order, setOrder] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [profiles, setProfiles] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function loadOrderDetails() {
//       setIsLoading(true);
//       setError("");

//       const { data: orderData, error: orderError } = await supabase
//         .from("orders")
//         .select(
//           "id, customer_name, customer_email, customer_phone, address, city, postal_code, notes, status, total_price, payment_status, created_at, updated_at, order_items(id, pizza_id, pizza_name, quantity, unit_price)",
//         )
//         .eq("id", orderId)
//         .single();

//       if (orderError) {
//         setError(orderError.message);
//         setIsLoading(false);
//         return;
//       }

//       const { data: historyData, error: historyError } = await supabase
//         .from("order_status_history")
//         .select("id, old_status, new_status, changed_by, created_at")
//         .eq("order_id", orderId)
//         .order("created_at", { ascending: true });

//       if (historyError) {
//         setError(historyError.message);
//         setIsLoading(false);
//         return;
//       }

//       const changedByIds = [
//         ...new Set(
//           historyData.map((entry) => entry.changed_by).filter(Boolean),
//         ),
//       ];

//       let profileMap = {};

//       if (changedByIds.length > 0) {
//         const { data: profileData, error: profileError } = await supabase
//           .from("profiles")
//           .select("id, full_name, role")
//           .in("id", changedByIds);

//         if (profileError) {
//           setError(profileError.message);
//           setIsLoading(false);
//           return;
//         }

//         profileMap = Object.fromEntries(
//           profileData.map((profile) => [
//             profile.id,
//             {
//               full_name: profile.full_name,
//               role: profile.role,
//             },
//           ]),
//         );
//       }

//       setOrder(orderData);
//       setHistory(historyData);
//       setProfiles(profileMap);
//       setIsLoading(false);
//     }

//     loadOrderDetails();
//   }, [orderId]);

//   if (isLoading) {
//     return (
//       <div className="mx-auto max-w-5xl px-6 py-10">
//         <div className="rounded-2xl bg-white p-8 text-center text-warm-gray shadow-sm">
//           Loading order...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-auto max-w-5xl px-6 py-10">
//         <Link
//           to="/staff/orders"
//           className="text-sm font-semibold text-basil-600 hover:text-basil-700"
//         >
//           ← Back to orders
//         </Link>

//         <div className="mt-6 rounded-2xl bg-tomato-400/10 p-6 text-tomato-600">
//           <p className="font-semibold">Could not load this order.</p>
//           <p className="mt-1 text-sm">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!order) return null;

//   return (
//     <div className="mx-auto max-w-5xl px-6 py-10">
//       <Link
//         to="/staff/orders"
//         className="text-sm font-semibold text-basil-600 transition hover:text-basil-700"
//       >
//         ← Back to orders
//       </Link>

//       <div className="mt-6">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//           <div>
//             <p className="text-sm font-semibold tracking-wide text-basil-600">
//               ORDER DETAILS
//             </p>

//             <h1 className="mt-2 text-3xl font-bold text-espresso">
//               Order #{order.id.slice(0, 8)}
//             </h1>

//             <p className="mt-2 text-sm text-warm-gray">
//               {new Date(order.created_at).toLocaleString()}
//             </p>
//           </div>

//           <span
//             className={`self-start rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusStyle(
//               order.status,
//             )}`}
//           >
//             {formatStatus(order.status)}
//           </span>
//         </div>
//       </div>

//       <div className="mt-8 grid gap-6 lg:grid-cols-2">
//         <div className="rounded-2xl bg-white p-6 shadow-sm">
//           <h2 className="text-lg font-bold text-espresso">Customer</h2>

//           <div className="mt-5 space-y-3 text-sm">
//             <div>
//               <p className="text-warm-gray">Name</p>
//               <p className="font-semibold text-espresso">
//                 {order.customer_name}
//               </p>
//             </div>

//             <div>
//               <p className="text-warm-gray">Email</p>
//               <p className="font-semibold text-espresso">
//                 {order.customer_email}
//               </p>
//             </div>

//             <div>
//               <p className="text-warm-gray">Phone</p>
//               <p className="font-semibold text-espresso">
//                 {order.customer_phone}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-2xl bg-white p-6 shadow-sm">
//           <h2 className="text-lg font-bold text-espresso">Delivery</h2>

//           <div className="mt-5 text-sm">
//             <p className="font-semibold text-espresso">{order.address}</p>

//             <p className="mt-1 text-warm-gray">
//               {order.postal_code} {order.city}
//             </p>

//             {order.notes && (
//               <div className="mt-5 rounded-xl bg-ivory p-4">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-basil-600">
//                   Order notes
//                 </p>

//                 <p className="mt-2 text-sm text-espresso">{order.notes}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
//         <div className="flex items-center justify-between gap-4">
//           <h2 className="text-lg font-bold text-espresso">Order items</h2>

//           <span className="text-sm font-semibold text-espresso">
//             {formatCurrency(Number(order.total_price))}
//           </span>
//         </div>

//         <div className="mt-5 divide-y divide-warm-border">
//           {order.order_items.map((item) => (
//             <div
//               key={item.id}
//               className="flex items-center justify-between gap-4 py-4"
//             >
//               <div>
//                 <p className="font-semibold text-espresso">
//                   {item.quantity} × {item.pizza_name}
//                 </p>

//                 <p className="mt-1 text-sm text-warm-gray">
//                   {formatCurrency(Number(item.unit_price))} each
//                 </p>
//               </div>

//               <p className="font-semibold text-espresso">
//                 {formatCurrency(Number(item.unit_price) * item.quantity)}
//               </p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-5 flex items-center justify-between border-t border-warm-border pt-5">
//           <div>
//             <p className="text-sm text-warm-gray">Payment</p>

//             <p className="font-semibold capitalize text-espresso">
//               {formatStatus(order.payment_status)}
//             </p>
//           </div>

//           <div className="text-right">
//             <p className="text-sm text-warm-gray">Total</p>

//             <p className="text-xl font-bold text-espresso">
//               {formatCurrency(Number(order.total_price))}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
//         <h2 className="text-lg font-bold text-espresso">Status history</h2>

//         {history.length === 0 ? (
//           <p className="mt-5 text-sm text-warm-gray">
//             No status history available for this order.
//           </p>
//         ) : (
//           <div className="mt-6 space-y-5">
//             {history.map((entry) => {
//               const changedBy = profiles[entry.changed_by];

//               return (
//                 <div key={entry.id} className="relative flex gap-4">
//                   <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-basil-500" />

//                   <div className="min-w-0">
//                     <p className="font-semibold capitalize text-espresso">
//                       {formatStatus(entry.new_status)}
//                     </p>

//                     <p className="mt-1 text-sm text-warm-gray">
//                       {entry.old_status
//                         ? `${formatStatus(entry.old_status)} → `
//                         : ""}
//                       {formatStatus(entry.new_status)}
//                     </p>

//                     <p className="mt-1 text-xs text-warm-gray">
//                       {new Date(entry.created_at).toLocaleString()}
//                     </p>

//                     {changedBy && (
//                       <p className="mt-1 text-xs text-warm-gray">
//                         Changed by {changedBy.full_name} ·{" "}
//                         <span className="capitalize">{changedBy.role}</span>
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default StaffOrderDetails;
