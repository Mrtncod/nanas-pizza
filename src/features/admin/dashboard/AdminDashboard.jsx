import { useMemo, useState } from "react";
import { useOutletContext } from "react-router";

import { useAdminDashboard } from "../../../hooks/useAdminDashboard";
import DashboardStats from "./DashboardStats";
import { useAdminRevenue } from "../../../hooks/useAdminRevenue";
import RevenueChart from "./RevenueChart";

import RecentOrders from "./RecentOrders";
import { useAdminPopularPizzas } from "../../../hooks/useAdminPopularPizzas";
import PopularPizzas from "./PopularPizzas";

const ANALYTICS_PERIODS = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
  { value: "all", label: "All time" },
];

function AdminDashboard() {
  const { profile } = useOutletContext();

  const [analyticsPeriod, setAnalyticsPeriod] = useState(7);

  const { data: orders = [], isLoading, error } = useAdminDashboard();

  const {
    data: revenueData = [],
    isLoading: isRevenueLoading,
    error: revenueError,
  } = useAdminRevenue(analyticsPeriod);

  const {
    data: popularPizzas = [],
    isLoading: isPopularPizzasLoading,
    error: popularPizzasError,
  } = useAdminPopularPizzas();

  const stats = useMemo(() => {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    const todaysOrders = orders.filter((order) => {
      const createdAt = new Date(order.created_at);

      return createdAt >= startOfToday && createdAt < startOfTomorrow;
    });

    return {
      todaysOrders: todaysOrders.length,

      todaysRevenue: todaysOrders
        .filter((order) => order.payment_status === "paid")
        .reduce((sum, order) => sum + Number(order.total_price || 0), 0),

      preparing: orders.filter((order) => order.status === "preparing").length,

      ready: orders.filter((order) => order.status === "ready").length,

      outForDelivery: orders.filter(
        (order) => order.status === "out_for_delivery",
      ).length,

      delivered: todaysOrders.filter((order) => order.status === "delivered")
        .length,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <p className="text-warm-gray">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="rounded-2xl border border-tomato-500/20 bg-tomato-400/10 p-5">
          <p className="font-semibold text-tomato-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      {/* Dashboard header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-basil-600">
            Business overview
          </p>

          <h1 className="mt-1 text-3xl font-bold text-espresso">Dashboard</h1>

          <p className="mt-2 text-sm text-warm-gray">
            Welcome back, {profile.full_name}.
          </p>
        </div>

        {/* Analytics period */}
        <div>
          <label
            htmlFor="analytics-period"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-warm-gray"
          >
            Analytics period
          </label>

          <select
            id="analytics-period"
            value={analyticsPeriod}
            onChange={(e) => {
              const value = e.target.value;
              setAnalyticsPeriod(value === "all" ? "all" : Number(value));
            }}
            className="rounded-xl border border-warm-border/60 bg-white px-4 py-2.5 text-sm font-semibold text-espresso shadow-sm outline-none transition focus:border-basil-500 focus:ring-2 focus:ring-basil-500/20"
          >
            {ANALYTICS_PERIODS.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* KPI cards */}
      <DashboardStats stats={stats} />
      {/* Analytics view */}
      <div className="mt-6 rounded-2xl border border-warm-border/60 bg-white p-6 shadow-sm sm:p-8">
        <RevenueChart
          data={revenueData}
          isLoading={isRevenueLoading}
          error={revenueError}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <PopularPizzas
            pizzas={popularPizzas}
            isLoading={isPopularPizzasLoading}
            error={popularPizzasError}
          />

          <RecentOrders orders={orders} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
