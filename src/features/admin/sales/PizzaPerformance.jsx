import { formatCurrency } from "../../../utils/helpers";

function PizzaPerformance({ data }) {
  const totalRevenue = data.reduce(
    (total, pizza) => total + Number(pizza.revenue),
    0,
  );

  if (!data.length) {
    return (
      <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="font-bold text-espresso">Pizza performance</h2>

          <p className="mt-1 text-sm text-warm-gray">
            Sales performance by pizza
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-ivory px-5 py-8 text-center">
          <p className="font-medium text-espresso">
            No paid pizza sales in this period.
          </p>

          <p className="mt-1 text-sm text-warm-gray">
            Try selecting a different period.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-bold text-espresso">Pizza performance</h2>

        <p className="mt-1 text-sm text-warm-gray">
          Sales performance by pizza
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {data.map((pizza, index) => {
          const revenue = Number(pizza.revenue);
          const quantity = Number(pizza.quantity_sold);

          const revenueShare =
            totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;

          return (
            <div key={pizza.pizza_id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ivory text-sm font-bold text-basil-600">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-espresso">
                      {pizza.pizza_name}
                    </p>

                    <p className="mt-0.5 text-sm text-warm-gray">
                      {quantity} {quantity === 1 ? "pizza" : "pizzas"} sold
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-semibold text-espresso">
                    {formatCurrency(revenue)}
                  </p>

                  <p className="mt-0.5 text-xs text-warm-gray">
                    {revenueShare.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-ivory">
                <div
                  className="h-full rounded-full bg-basil-600 transition-all duration-500"
                  style={{
                    width: `${revenueShare}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PizzaPerformance;
