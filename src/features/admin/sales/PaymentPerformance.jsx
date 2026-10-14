import { formatCurrency } from "../../../utils/helpers";

const PAYMENT_CONFIG = {
  paid: {
    label: "Paid",
    description: "Successfully paid orders",
    className: "bg-basil-600/10 text-basil-700",
  },
  pending: {
    label: "Pending",
    description: "Awaiting payment",
    className: "bg-golden/10 text-golden-700",
  },
  failed: {
    label: "Failed",
    description: "Payment unsuccessful",
    className: "bg-tomato-400/10 text-tomato-600",
  },
};

const PAYMENT_ORDER = ["paid", "pending", "failed"];

function PaymentPerformance({ data }) {
  const paymentMap = new Map(
    data.map((item) => [
      item.payment_status,
      {
        orderCount: Number(item.order_count),
        totalAmount: Number(item.total_amount),
      },
    ]),
  );

  return (
    <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-bold text-espresso">Payment performance</h2>

        <p className="mt-1 text-sm text-warm-gray">
          Payment status across orders
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {PAYMENT_ORDER.map((status) => {
          const config = PAYMENT_CONFIG[status];

          const payment = paymentMap.get(status) ?? {
            orderCount: 0,
            totalAmount: 0,
          };

          return (
            <div key={status} className="rounded-xl bg-ivory/70 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold ${config.className}`}
                  >
                    {config.label}
                  </div>

                  <p className="hidden text-sm text-warm-gray sm:block">
                    {config.description}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-espresso">
                    {formatCurrency(payment.totalAmount)}
                  </p>

                  <p className="mt-0.5 text-xs text-warm-gray">
                    {payment.orderCount}{" "}
                    {payment.orderCount === 1 ? "order" : "orders"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PaymentPerformance;
