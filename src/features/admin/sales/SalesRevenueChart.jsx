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

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function SalesRevenueChart({ data }) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatDate(item.sales_date),
    revenue: Number(item.revenue),
  }));

  return (
    <section className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-bold text-espresso">Revenue over time</h2>

        <p className="mt-1 text-sm text-warm-gray">Paid order revenue by day</p>
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 12,
              left: 4,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              minTickGap={32}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
            />

            <Tooltip
              formatter={(value) => [formatCurrency(value), "Revenue"]}
              labelFormatter={(label) => label}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f7f57"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default SalesRevenueChart;
