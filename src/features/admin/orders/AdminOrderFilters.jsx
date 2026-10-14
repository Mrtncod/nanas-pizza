import { CalendarDays, Search, SlidersHorizontal } from "lucide-react";

function AdminOrderFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
  dateRange,
  setDateRange,
  resultCount,
}) {
  return (
    <div className="border-b border-warm-border/50 px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-5">
        {/* Section header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-basil-500/10 text-basil-600">
            <SlidersHorizontal size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-espresso">All orders</h2>

            <p className="mt-1 text-sm text-warm-gray">
              {resultCount} {resultCount === 1 ? "order" : "orders"} found
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or order ID..."
              className="w-full rounded-xl border border-warm-border/60 bg-ivory/50 py-2.5 pl-10 pr-4 text-sm text-espresso outline-none transition placeholder:text-warm-gray/70 focus:border-basil-500 focus:bg-white focus:ring-2 focus:ring-basil-500/20"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-warm-border/60 bg-ivory/50 px-4 py-2.5 text-sm font-medium text-espresso outline-none transition focus:border-basil-500 focus:bg-white focus:ring-2 focus:ring-basil-500/20"
          >
            <option value="all">All statuses</option>{" "}
            <option value="pending">Pending</option>{" "}
            <option value="confirmed">Confirmed</option>{" "}
            <option value="preparing">Preparing</option>{" "}
            <option value="ready">Ready</option>{" "}
            <option value="out_for_delivery">Out for delivery</option>{" "}
            <option value="delivered">Delivered</option>
          </select>

          {/* Payment */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-xl border border-warm-border/60 bg-ivory/50 px-4 py-2.5 text-sm font-medium text-espresso outline-none transition focus:border-basil-500 focus:bg-white focus:ring-2 focus:ring-basil-500/20"
          >
            <option value="all">All payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Date */}
          <div className="relative">
            <CalendarDays
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray"
            />

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-warm-border/60 bg-ivory/50 py-2.5 pl-10 pr-4 text-sm font-medium text-espresso outline-none transition focus:border-basil-500 focus:bg-white focus:ring-2 focus:ring-basil-500/20"
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="month">This month</option>
              <option value="lastMonth">Last month</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
              <option value="lastYear">Last year</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderFilters;
