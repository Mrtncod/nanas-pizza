import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function OrderStatusChart({ orders }) {
  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
  };

  const statusOrder = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
  ];

  const chartData = statusOrder.map((status) => ({
    status: statusLabels[status],
    orders: orders.filter((order) => order.status === status).length,
  }));

  return (
    <div className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-espresso">Orders by status</h2>

        <p className="mt-1 text-sm text-warm-gray">
          Current distribution of orders.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              dataKey="status"
              tick={{
                fontSize: 11,
                fill: "#78716c",
              }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fontSize: 12,
                fill: "#78716c",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) => [value, "Orders"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
              }}
            />

            <Bar
              dataKey="orders"
              fill="#4f6f52"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default OrderStatusChart;
