import { CalendarDays, Pizza, ShoppingBag, TrendingUp } from "lucide-react";

import { formatCurrency } from "../../../utils/helpers";

function formatBestDay(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SalesInsights({ data }) {
  if (!data) {
    return null;
  }

  const bestSeller = data.best_seller;
  const topRevenuePizza = data.top_revenue_pizza;
  const bestSalesDay = data.best_sales_day;

  const hasSales = bestSeller || topRevenuePizza || bestSalesDay;

  if (!hasSales) {
    return (
      <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="font-bold text-espresso">Sales insights</h2>

          <p className="mt-1 text-sm text-warm-gray">
            Key performance highlights for the selected period
          </p>
        </div>

        <div className="mt-6 rounded-xl bg-ivory px-5 py-8 text-center">
          <p className="font-medium text-espresso">
            No paid sales in this period.
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
        <h2 className="font-bold text-espresso">Sales insights</h2>

        <p className="mt-1 text-sm text-warm-gray">
          Key performance highlights for the selected period
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {/* Best seller */}
        <div className="rounded-xl bg-ivory/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-warm-gray">Best seller</p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-basil-600/10 text-basil-700">
              <Pizza size={17} />
            </div>
          </div>

          <p className="mt-4 truncate text-lg font-bold text-espresso">
            {bestSeller?.pizza_name ?? "—"}
          </p>

          <p className="mt-1 text-sm text-warm-gray">
            {bestSeller
              ? `${Number(bestSeller.quantity_sold)} ${
                  Number(bestSeller.quantity_sold) === 1 ? "pizza" : "pizzas"
                } sold`
              : "No sales"}
          </p>
        </div>

        {/* Top revenue pizza */}
        <div className="rounded-xl bg-ivory/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-warm-gray">Top revenue</p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-golden/10 text-golden-700">
              <TrendingUp size={17} />
            </div>
          </div>

          <p className="mt-4 truncate text-lg font-bold text-espresso">
            {topRevenuePizza?.pizza_name ?? "—"}
          </p>

          <p className="mt-1 text-sm text-warm-gray">
            {topRevenuePizza
              ? `${formatCurrency(Number(topRevenuePizza.revenue))} generated`
              : "No revenue"}
          </p>
        </div>

        {/* Best day */}
        <div className="rounded-xl bg-ivory/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-warm-gray">Best day</p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tomato-400/10 text-tomato-600">
              <CalendarDays size={17} />
            </div>
          </div>

          <p className="mt-4 text-lg font-bold text-espresso">
            {formatBestDay(bestSalesDay?.sales_date)}
          </p>

          <p className="mt-1 text-sm text-warm-gray">
            {bestSalesDay
              ? `${formatCurrency(
                  Number(bestSalesDay.revenue),
                )} · ${Number(bestSalesDay.orders)} ${
                  Number(bestSalesDay.orders) === 1 ? "order" : "orders"
                }`
              : "No sales"}
          </p>
        </div>

        {/* Average daily revenue */}
        <div className="rounded-xl bg-ivory/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-warm-gray">Avg. daily revenue</p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-basil-600/10 text-basil-700">
              <TrendingUp size={17} />
            </div>
          </div>

          <p className="mt-4 text-lg font-bold text-espresso">
            {formatCurrency(Number(data.average_daily_revenue ?? 0))}
          </p>

          <p className="mt-1 text-sm text-warm-gray">Per calendar day</p>
        </div>

        {/* Average daily orders */}
        <div className="rounded-xl bg-ivory/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-warm-gray">Avg. daily orders</p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-golden/10 text-golden-700">
              <ShoppingBag size={17} />
            </div>
          </div>

          <p className="mt-4 text-lg font-bold text-espresso">
            {Number(data.average_daily_orders ?? 0).toFixed(2)}
          </p>

          <p className="mt-1 text-sm text-warm-gray">Orders per calendar day</p>
        </div>
      </div>
    </section>
  );
}

export default SalesInsights;
