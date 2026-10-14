import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "../../../utils/helpers";

function RevenueChart({ data, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-warm-border/60 bg-white shadow-sm">
        <p className="text-sm text-warm-gray">Loading revenue analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-tomato-400/20 bg-white px-6 shadow-sm">
        <p className="text-sm text-tomato-600">
          Could not load revenue analytics.
        </p>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-warm-border/60 bg-white px-6 shadow-sm">
        <p className="text-sm text-warm-gray">
          No revenue data available for this period.
        </p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    date: new Date(`${item.date}T00:00:00`),
  }));

  return (
    <div className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-espresso">Revenue analytics</h2>

        <p className="mt-1 text-sm text-warm-gray">
          Revenue from paid orders over the selected period.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(0, 0, 0, 0.06)"
            />

            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })
              }
              tick={{
                fontSize: 12,
                fill: "#78716c",
              }}
              axisLine={false}
              tickLine={false}
              minTickGap={20}
            />

            <YAxis
              tickFormatter={(value) => `€${value}`}
              tick={{
                fontSize: 12,
                fill: "#78716c",
              }}
              axisLine={false}
              tickLine={false}
              width={55}
            />

            <Tooltip
              labelFormatter={(date) =>
                date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              }
              formatter={(value, name) => {
                if (name === "revenue") {
                  return [formatCurrency(value), "Revenue"];
                }

                return [value, "Orders"];
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f6f52"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
