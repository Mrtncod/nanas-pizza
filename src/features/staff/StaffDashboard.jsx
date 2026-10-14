import { Link, useOutletContext } from "react-router";

import { useStaffDashboard } from "../../hooks/useStaffDashboard";
import { formatCurrency } from "../../utils/helpers";

function getStatusStyle(status) {
  const styles = {
    pending: "bg-golden-500/10 text-golden-600",
    confirmed: "bg-golden-500/10 text-golden-600",
    preparing: "bg-tomato-400/10 text-tomato-600",
    ready: "bg-basil-500/10 text-basil-600",
    out_for_delivery: "bg-tomato-500/10 text-tomato-600",
    delivered: "bg-basil-600/10 text-basil-700",
  };

  return styles[status] || "bg-warm-gray/10 text-warm-gray";
}

function StaffDashboard() {
  const { profile } = useOutletContext();

  const {
    data: orders = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useStaffDashboard();

  // Get today's date boundaries in the browser's local timezone.
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const todaysOrders = orders.filter((order) => {
    const createdAt = new Date(order.created_at);

    return createdAt >= startOfToday && createdAt < startOfTomorrow;
  });

  const countByStatus = (status) =>
    orders.filter((order) => order.status === status).length;

  const completedToday = orders.filter((order) => {
    const updatedAt = new Date(order.updated_at);

    return (
      order.status === "delivered" &&
      updatedAt >= startOfToday &&
      updatedAt < startOfTomorrow
    );
  });

  const todaysRevenue = todaysOrders
    .filter((order) => order.payment_status === "paid")
    .reduce((total, order) => total + Number(order.total_price), 0);

  const stats = [
    {
      label: "Today's orders",
      value: todaysOrders.length,
      description: "Orders placed today",
      color: "bg-basil-500/10 text-basil-600",
    },
    {
      label: "In preparation",
      value: countByStatus("preparing"),
      description: "Currently in the kitchen",
      color: "bg-tomato-400/10 text-tomato-600",
    },
    {
      label: "Ready for delivery",
      value: countByStatus("ready"),
      description: "Waiting for delivery",
      color: "bg-golden-500/10 text-golden-600",
    },
    {
      label: "Out for delivery",
      value: countByStatus("out_for_delivery"),
      description: "Currently on the way",
      color: "bg-tomato-500/10 text-tomato-600",
    },
    {
      label: "Completed today",
      value: completedToday.length,
      description: "Orders delivered today",
      color: "bg-basil-600/10 text-basil-700",
    },
    {
      label: "Today's revenue",
      value: formatCurrency(todaysRevenue),
      description: "Paid orders placed today",
      color: "bg-golden-500/10 text-golden-600",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="rounded-2xl shadow-sm  px-5 py-4 ">
          <p className="text-sm font-semibold tracking-wide text-basil-600">
            NANNA'S PIZZA
          </p>

          <h1 className="mt-2 text-3xl font-bold text-espresso">
            Staff Dashboard
          </h1>
        </div>

        <div className="rounded-2xl  px-5 py-4 shadow-sm">
          <p className="text-normal text-warm-gray">
            Welcome,{" "}
            <span className="font-semibold text-espresso">
              {profile.full_name}
            </span>
          </p>

          <p className="mt-1 text-sm text-warm-gray">
            Your role:{" "}
            <span className="font-semibold capitalize text-espresso">
              {profile.role}
            </span>
          </p>
        </div>
      </div>

      {/* Recent orders */}
      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-basil-600">
              Latest activity
            </p>

            <h2 className="mt-1 text-xl font-bold text-espresso">
              Recent orders
            </h2>

            <p className="mt-1 text-sm text-warm-gray">
              The latest orders received by Nanna's Pizza.
            </p>
          </div>

          <Link
            to="/staff/orders"
            className="self-start text-sm font-semibold text-basil-600 transition hover:text-basil-700 sm:self-auto"
          >
            View all orders →
          </Link>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-warm-gray">Loading recent orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-espresso">No orders yet.</p>

              <p className="mt-1 text-sm text-warm-gray">
                New orders will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-warm-border/70">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-cream/40 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-espresso">
                        {order.customer_name || "Guest"}
                      </p>

                      <span className="text-xs font-medium text-warm-gray">
                        #{order.id.slice(0, 8)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-warm-gray">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="font-semibold text-espresso">
                      {formatCurrency(Number(order.total_price))}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Operations overview */}
      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-basil-600">
              Live overview
            </p>

            <h2 className="mt-1 text-xl font-bold text-espresso">
              Operations overview
            </h2>

            <p className="mt-1 text-sm text-warm-gray">
              Keep track of today's order activity at a glance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="self-start rounded-full border border-basil-500/30 bg-white px-4 py-2 text-sm font-semibold text-basil-600 shadow-sm transition hover:bg-basil-500/10 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {isError && (
          <div className="mt-5 rounded-2xl bg-tomato-400/10 p-5">
            <p className="font-semibold text-tomato-600">
              Could not load dashboard data.
            </p>

            <p className="mt-1 text-sm text-tomato-600">{error.message}</p>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-3 text-sm font-semibold text-tomato-600 underline transition hover:text-tomato-700 disabled:opacity-60"
            >
              Try again
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="mt-6 rounded-2xl border border-warm-border/60 bg-white p-8 text-center text-warm-gray shadow-sm">
            Loading dashboard...
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <p className="text-sm font-medium text-warm-gray">
                  {stat.label}
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <p
                    className={`inline-flex rounded-xl px-3 py-2 text-2xl font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                </div>

                <p className="mt-3 text-sm text-warm-gray">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default StaffDashboard;
