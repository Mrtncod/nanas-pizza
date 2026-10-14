import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

import { formatCurrency } from "../../../utils/helpers";

const STATUS_STYLES = {
  pending: "bg-warm-gray/10 text-warm-gray",
  confirmed: "bg-basil-500/10 text-basil-700",
  preparing: "bg-golden-500/10 text-golden-700",
  ready: "bg-basil-600/10 text-basil-700",
  out_for_delivery: "bg-tomato-400/10 text-tomato-600",
  delivered: "bg-basil-500/10 text-basil-700",
};

function formatStatus(status) {
  return status.replaceAll("_", " ");
}

function formatDate(date) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RecentOrders({ orders }) {
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="rounded-2xl border border-warm-border/60 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-warm-border/50 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-espresso">Recent orders</h2>

          <p className="mt-1 text-sm text-warm-gray">
            The latest orders received by the restaurant.
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="hidden items-center gap-1 text-sm font-semibold text-basil-600 transition hover:text-basil-700 sm:flex"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-warm-gray">No orders yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-warm-border/40">
          {recentOrders.map((order) => {
            const statusClass =
              STATUS_STYLES[order.status] ?? "bg-warm-gray/10 text-warm-gray";

            return (
              <div
                key={order.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-espresso">
                      #{order.id.slice(0, 8)}
                    </p>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-warm-gray">
                    {order.customer_name}
                  </p>

                  <p className="mt-1 text-xs text-warm-gray">
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-bold text-espresso">
                    {formatCurrency(order.total_price)}
                  </p>

                  <p className="mt-1 text-xs capitalize text-warm-gray">
                    {order.payment_status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-warm-border/50 px-5 py-4 sm:hidden">
        <Link
          to="/admin/orders"
          className="flex items-center justify-center gap-1 text-sm font-semibold text-basil-600"
        >
          View all orders
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default RecentOrders;
