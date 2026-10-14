import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Package,
  Phone,
} from "lucide-react";

import { useAdminOrder } from "../../../hooks/useAdminOrder";
import { useAdminOrderHistory } from "../../../hooks/useAdminOrderHistory";
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderStatusHistory({ history, isLoading, error }) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-bold text-espresso">Order activity</h2>

        <div className="mt-6 space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-4">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-warm-border/40" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-warm-border/40" />
                <div className="h-3 w-48 animate-pulse rounded bg-warm-border/30" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-tomato-500/20 bg-tomato-400/10 p-5 shadow-sm sm:p-6">
        <h2 className="font-bold text-espresso">Order activity</h2>

        <p className="mt-2 text-sm text-tomato-600">{error.message}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-bold text-espresso">Order activity</h2>

        <p className="mt-1 text-sm text-warm-gray">
          Status changes and order history
        </p>
      </div>

      {history.length === 0 ? (
        <div className="mt-6 rounded-xl bg-ivory/60 px-4 py-5 text-center">
          <p className="text-sm text-warm-gray">
            No status history is available for this order.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {history.map((event, index) => {
            const isLatest = index === 0;
            const isLast = index === history.length - 1;

            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Timeline */}
                <div className="relative flex shrink-0 flex-col items-center">
                  <div
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full ${
                      isLatest
                        ? "bg-basil-600 text-white"
                        : "bg-basil-500/10 text-basil-600"
                    }`}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isLatest ? "bg-white" : "bg-basil-500"
                      }`}
                    />
                  </div>

                  {!isLast && (
                    <div className="absolute top-9 h-full w-px bg-warm-border/60" />
                  )}
                </div>

                {/* Event */}
                <div className="min-w-0 flex-1 pb-7">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold capitalize text-espresso">
                      {formatStatus(event.new_status)}
                    </p>

                    <time className="text-xs text-warm-gray">
                      {formatDate(event.created_at)}
                    </time>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-warm-gray">
                    {event.old_status ? (
                      <>
                        <span className="capitalize">
                          {formatStatus(event.old_status)}
                        </span>

                        <span aria-hidden="true">→</span>
                      </>
                    ) : null}

                    <span className="font-medium capitalize text-espresso">
                      {formatStatus(event.new_status)}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-warm-gray">
                    <span>Status updated</span>

                    <span aria-hidden="true">·</span>

                    {event.actor ? (
                      <>
                        <span className="font-medium text-espresso">
                          {event.actor.full_name}
                        </span>

                        <span className="capitalize">({event.actor.role})</span>
                      </>
                    ) : (
                      <span className="font-medium text-espresso">System</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/////////////////////////////////////////////////////7
function AdminOrderDetails() {
  const { orderId } = useParams();

  const { data: order, isLoading, error } = useAdminOrder(orderId);

  const {
    data: history = [],
    isLoading: isHistoryLoading,
    error: historyError,
  } = useAdminOrderHistory(orderId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded bg-warm-border/40" />
          <div className="h-10 w-64 animate-pulse rounded bg-warm-border/40" />
          <div className="h-48 animate-pulse rounded-2xl bg-warm-border/30" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-basil-600 transition hover:text-basil-700"
        >
          <ArrowLeft size={16} />
          Back to orders
        </Link>

        <div className="mt-6 rounded-2xl border border-tomato-500/20 bg-tomato-400/10 p-5">
          <p className="font-semibold text-tomato-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-basil-600 transition hover:text-basil-700"
        >
          <ArrowLeft size={16} />
          Back to orders
        </Link>

        <div className="mt-6 rounded-2xl border border-warm-border/60 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-espresso">Order not found</h1>

          <p className="mt-2 text-sm text-warm-gray">
            This order may have been removed or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  const statusClass =
    STATUS_STYLES[order.status] ?? "bg-warm-gray/10 text-warm-gray";

  const paymentClass =
    PAYMENT_STYLES[order.payment_status] ?? "bg-warm-gray/10 text-warm-gray";

  const itemsTotal =
    order.order_items?.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
      0,
    ) ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      {/* Back */}
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-basil-600 transition hover:text-basil-700"
      >
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-basil-600">
            Order details
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-espresso">
              #{order.id.slice(0, 8)}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
            >
              {formatStatus(order.status)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${paymentClass}`}
            >
              {order.payment_status}
            </span>
          </div>

          <p className="mt-2 text-sm text-warm-gray">
            Placed {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-warm-gray">
          <Clock3 size={16} />
          <span>Last updated {formatDate(order.updated_at)}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.75fr)]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Items */}
          <section className="overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-warm-border/50 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-basil-500/10 text-basil-600">
                <Package size={19} />
              </div>

              <div>
                <h2 className="font-bold text-espresso">Order items</h2>

                <p className="text-sm text-warm-gray">
                  {order.order_items?.length ?? 0}{" "}
                  {order.order_items?.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <div className="divide-y divide-warm-border/40 px-5 sm:px-6">
              {order.order_items?.map((item) => {
                const itemTotal =
                  Number(item.quantity) * Number(item.unit_price);

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ivory text-sm font-bold text-espresso">
                          {item.quantity}
                        </span>

                        <div className="min-w-0">
                          <p className="font-semibold text-espresso">
                            {item.pizza_name}
                          </p>

                          <p className="text-sm text-warm-gray">
                            {formatCurrency(item.unit_price)} each
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="shrink-0 font-semibold text-espresso">
                      {formatCurrency(itemTotal)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-warm-border/50 bg-ivory/30 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-gray">Items subtotal</span>

                <span className="font-medium text-espresso">
                  {formatCurrency(itemsTotal)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold text-espresso">Order total</span>

                <span className="text-xl font-bold text-espresso">
                  {formatCurrency(order.total_price)}
                </span>
              </div>
            </div>
          </section>

          {/* Customer */}
          <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-espresso">Customer information</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
                  Name
                </p>

                <p className="mt-1 font-semibold text-espresso">
                  {order.customer_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
                  Email
                </p>

                <a
                  href={`mailto:${order.customer_email}`}
                  className="mt-1 flex items-center gap-2 text-sm font-medium text-basil-600 transition hover:text-basil-700"
                >
                  <Mail size={15} />
                  {order.customer_email}
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
                  Phone
                </p>

                <a
                  href={`tel:${order.customer_phone}`}
                  className="mt-1 flex items-center gap-2 text-sm font-medium text-basil-600 transition hover:text-basil-700"
                >
                  <Phone size={15} />
                  {order.customer_phone}
                </a>
              </div>
            </div>
          </section>

          {/* Notes */}
          {order.notes && (
            <section className="rounded-2xl border border-golden-500/20 bg-golden-500/5 p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-espresso">Customer notes</h2>

              <p className="mt-3 text-sm leading-6 text-espresso">
                {order.notes}
              </p>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Payment */}
          <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-espresso">Payment</h2>

            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-sm text-warm-gray">Payment status</span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${paymentClass}`}
              >
                {order.payment_status}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-warm-border/40 pt-4">
              <span className="text-sm text-warm-gray">Total paid</span>

              <span className="font-bold text-espresso">
                {formatCurrency(order.total_price)}
              </span>
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-basil-500/10 text-basil-600">
                <MapPin size={19} />
              </div>

              <div>
                <h2 className="font-bold text-espresso">Delivery</h2>

                <p className="text-sm text-warm-gray">Customer address</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-ivory/60 p-4">
              <p className="font-semibold text-espresso">{order.address}</p>

              <p className="mt-1 text-sm text-warm-gray">
                {order.postal_code} {order.city}
              </p>
            </div>
          </section>

          {/* Current status */}
          <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-espresso">Current status</h2>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-basil-500/10 text-basil-600">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="font-semibold capitalize text-espresso">
                  {formatStatus(order.status)}
                </p>

                <p className="text-sm text-warm-gray">Current order status</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="mt-6">
        <OrderStatusHistory
          history={history}
          isLoading={isHistoryLoading}
          error={historyError}
        />
      </div>
    </div>
  );
}

export default AdminOrderDetails;
