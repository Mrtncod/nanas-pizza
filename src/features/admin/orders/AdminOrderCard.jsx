import { Link } from "react-router";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { formatCurrency } from "../../../utils/helpers";
const STATUS_STYLES = {
  pending: "bg-warm-gray/10 text-warm-gray",
  confirmed: "bg-basil-500/10 text-basil-700",
  preparing: "bg-golden-500/10 text-golden-700",
  ready: "bg-basil-600/10 text-basil-700",
  out_for_delivery: "bg-tomato-400/10 text-tomato-600",
  delivered: "bg-basil-500/10 text-basil-700",
};
const PAYMENT_STYLES = {
  paid: "bg-basil-500/10 text-basil-700",
  pending: "bg-golden-500/10 text-golden-700",
  failed: "bg-tomato-400/10 text-tomato-600",
};
function formatStatus(status) {
  return status.replaceAll("_", " ");
}
function formatDate(date) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function AdminOrderCard({ order }) {
  const statusClass =
    STATUS_STYLES[order.status] ?? "bg-warm-gray/10 text-warm-gray";
  const paymentClass =
    PAYMENT_STYLES[order.payment_status] ?? "bg-warm-gray/10 text-warm-gray";
  return (
    <article className="overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Header */}
      <div className="border-b border-warm-border/50 bg-ivory/40 px-4 py-3.5 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-espresso">Order</span>
              <span className="text-sm font-medium text-warm-gray">
                #{order.id.slice(0, 8)}
              </span>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass}`}
            >
              {formatStatus(order.status)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${paymentClass}`}
            >
              {order.payment_status}
            </span>
          </div>
          <p className="text-xs text-warm-gray">
            {formatDate(order.created_at)}
          </p>
        </div>
      </div>
      {/* Compact order content */}
      <div className="px-4 py-4 sm:px-5">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1.4fr_auto] lg:items-center">
          {/* Customer */}
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-warm-gray">
              Customer
            </p>
            <p className="mt-1 truncate text-base font-bold text-espresso">
              {order.customer_name}
            </p>
            <div className="mt-1.5 space-y-1 text-xs text-warm-gray">
              <p className="flex items-center gap-1.5 truncate">
                <Mail size={13} className="shrink-0" />
                <span className="truncate">{order.customer_email}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone size={13} className="shrink-0" />
                {order.customer_phone}
              </p>
            </div>
          </div>
          {/* Items */}
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-warm-gray">
              Order items
            </p>
            <div className="mt-1.5 space-y-1">
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <p className="min-w-0 truncate text-espresso">
                    <span className="font-semibold">{item.quantity} ×</span>
                    {item.pizza_name}
                  </p>
                  <span className="shrink-0 text-xs font-medium text-warm-gray">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Total */}
          <div className="rounded-xl bg-ivory/70 px-4 py-3 lg:min-w-32 lg:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-warm-gray">
              Total
            </p>
            <p className="mt-0.5 text-xl font-bold text-espresso">
              {formatCurrency(order.total_price)}
            </p>
          </div>
        </div>
        {/* Compact bottom information */}
        <div className="mt-4 flex flex-col gap-3 border-t border-warm-border/40 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2 text-xs text-warm-gray">
            <MapPin size={14} className="shrink-0 text-basil-600" />
            <span className="truncate">
              {order.address}, {order.postal_code} {order.city}
            </span>
          </div>
          {order.notes && (
            <p className="truncate rounded-lg bg-golden-500/5 px-2.5 py-1.5 text-xs text-espresso sm:max-w-xs">
              <span className="font-semibold">Note:</span> {order.notes}
            </p>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-start border-t border-warm-border/50 bg-ivory/20 px-4 py-3 sm:px-5">
        <Link
          to={`/admin/orders/${order.id}`}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-basil-600 transition hover:text-basil-700"
        >
          View details
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}
export default AdminOrderCard;

// import { Link } from "react-router";
// import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";

// import { formatCurrency } from "../../../utils/helpers";

// const STATUS_STYLES = {
//   pending: "bg-warm-gray/10 text-warm-gray",
//   confirmed: "bg-basil-500/10 text-basil-700",
//   preparing: "bg-golden-500/10 text-golden-700",
//   ready: "bg-basil-600/10 text-basil-700",
//   out_for_delivery: "bg-tomato-400/10 text-tomato-600",
//   delivered: "bg-basil-500/10 text-basil-700",
// };

// const PAYMENT_STYLES = {
//   paid: "bg-basil-500/10 text-basil-700",
//   pending: "bg-golden-500/10 text-golden-700",
//   failed: "bg-tomato-400/10 text-tomato-600",
// };

// function formatStatus(status) {
//   return status.replaceAll("_", " ");
// }

// function formatDate(date) {
//   return new Date(date).toLocaleString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function AdminOrderCard({ order }) {
//   const statusClass =
//     STATUS_STYLES[order.status] ?? "bg-warm-gray/10 text-warm-gray";

//   const paymentClass =
//     PAYMENT_STYLES[order.payment_status] ?? "bg-warm-gray/10 text-warm-gray";

//   return (
//     <article className="overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
//       {/* Order header */}
//       <div className="border-b border-warm-border/50 bg-ivory/40 px-5 py-4 sm:px-6">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="flex flex-col  ">
//               <span className="font-bold text-espresso">Order</span>
//               <span className="text-espresso">#{order.id.slice(0, 8)}</span>
//             </div>
//             <span
//               className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass}`}
//             >
//               {formatStatus(order.status)}
//             </span>

//             <span
//               className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${paymentClass}`}
//             >
//               {order.payment_status}
//             </span>
//           </div>

//           <p className="text-xs text-warm-gray">
//             {formatDate(order.created_at)}
//           </p>
//         </div>
//       </div>

//       {/* Main order content */}
//       <div className="p-5 sm:p-6">
//         <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//           {/* Customer */}
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
//               Customer
//             </p>

//             <p className="mt-1 text-lg font-bold text-espresso">
//               {order.customer_name}
//             </p>

//             <div className="mt-2 space-y-1.5 text-sm text-warm-gray">
//               <p className="flex items-center gap-2">
//                 <Mail size={14} />
//                 {order.customer_email}
//               </p>

//               <p className="flex items-center gap-2">
//                 <Phone size={14} />
//                 {order.customer_phone}
//               </p>
//             </div>
//           </div>

//           {/* Total */}
//           <div className="rounded-xl bg-ivory/70 px-4 py-3 lg:min-w-36 lg:text-right">
//             <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
//               Order total
//             </p>

//             <p className="mt-1 text-2xl font-bold text-espresso">
//               {formatCurrency(order.total_price)}
//             </p>
//           </div>
//         </div>

//         {/* Items */}
//         <div className="mt-6 rounded-xl border border-warm-border/40 bg-ivory/40 p-4">
//           <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
//             Order items
//           </p>

//           <div className="mt-3 divide-y divide-warm-border/40">
//             {order.order_items?.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
//               >
//                 <div>
//                   <span className="font-semibold text-espresso">
//                     {item.quantity} ×
//                   </span>
//                   <span className="text-sm text-espresso">
//                     {item.pizza_name}
//                   </span>
//                 </div>

//                 <span className="shrink-0 text-sm font-medium text-warm-gray">
//                   {formatCurrency(item.quantity * item.unit_price)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Delivery information */}
//         <div className="mt-6 grid gap-4 sm:grid-cols-2">
//           <div className="rounded-xl bg-ivory/40 p-4">
//             <div className="flex items-center gap-2">
//               <MapPin size={16} className="text-basil-600" />

//               <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
//                 Delivery address
//               </p>
//             </div>

//             <p className="mt-2 text-sm font-medium text-espresso">
//               {order.address}
//             </p>

//             <p className="mt-1 text-sm text-warm-gray">
//               {order.postal_code} {order.city}
//             </p>
//           </div>

//           {order.notes && (
//             <div className="rounded-xl bg-golden-500/5 p-4">
//               <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
//                 Customer notes
//               </p>

//               <p className="mt-2 text-sm text-espresso">{order.notes}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-start border-t border-warm-border/50 bg-ivory/20 px-5 py-3.5 sm:px-6">
//         <Link
//           to={`/admin/orders/${order.id}`}
//           className="group inline-flex items-center gap-2 text-sm font-semibold text-basil-600 transition hover:text-basil-700"
//         >
//           View details
//           <ArrowRight
//             size={16}
//             className="transition-transform group-hover:translate-x-0.5"
//           />
//         </Link>
//       </div>
//     </article>
//   );
// }

// export default AdminOrderCard;
