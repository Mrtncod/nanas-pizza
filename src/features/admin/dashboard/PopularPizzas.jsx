import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Trophy } from "lucide-react";

import { formatCurrency } from "../../../utils/helpers";

const PIE_COLORS = ["#4f6f52", "#d97757", "#d4a64a", "#8b7355", "#7c8f86"];

function PopularPizzas({ pizzas, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-2xl border border-warm-border/60 bg-white shadow-sm">
        <p className="text-sm text-warm-gray">Loading popular pizzas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-2xl border border-tomato-400/20 bg-white px-6 shadow-sm">
        <p className="text-sm text-tomato-600">
          Could not load popular pizzas.
        </p>
      </div>
    );
  }

  const popularPizzas = pizzas?.slice(0, 5) ?? [];

  if (popularPizzas.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-2xl border border-warm-border/60 bg-white px-6 shadow-sm">
        <p className="text-sm text-warm-gray">No pizza sales yet.</p>
      </div>
    );
  }

  const totalQuantity = popularPizzas.reduce(
    (total, pizza) => total + Number(pizza.quantity_sold),
    0,
  );

  const chartData = popularPizzas.map((pizza) => ({
    name: pizza.pizza_name,
    quantity: Number(pizza.quantity_sold),
  }));

  return (
    <div className="rounded-2xl border border-warm-border/60 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-warm-border/50 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-golden-500/10 text-golden-600">
            <Trophy size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-espresso">Popular pizzas</h2>

            <p className="mt-1 text-sm text-warm-gray">
              Best-selling pizzas from paid orders.
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 pt-5 sm:px-6">
        <div className="relative mx-auto h-56 max-w-xs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="quantity"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                stroke="none"
              >
                {chartData.map((pizza, index) => (
                  <Cell
                    key={pizza.name}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [`${value} sold`, name]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold leading-none text-espresso">
                {totalQuantity}
              </p>

              <p className="mt-1 text-xs text-warm-gray">pizzas sold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pizza list */}
      <div className="mt-4 divide-y divide-warm-border/40 border-t border-warm-border/50">
        {popularPizzas.map((pizza, index) => {
          const percentage =
            totalQuantity > 0
              ? (Number(pizza.quantity_sold) / totalQuantity) * 100
              : 0;

          return (
            <div
              key={pizza.pizza_id}
              className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
            >
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{
                  backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                }}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-espresso">
                  {pizza.pizza_name}
                </p>

                <p className="mt-0.5 text-xs text-warm-gray">
                  {pizza.quantity_sold} sold · {percentage.toFixed(1)}%
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-espresso">
                  {formatCurrency(pizza.revenue)}
                </p>

                {index === 0 && (
                  <p className="text-xs font-medium text-basil-600">
                    Best seller
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PopularPizzas;
