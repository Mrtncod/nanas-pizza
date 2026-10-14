import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useAdminOrders } from "../../../hooks/useAdminOrders";

import AdminOrderFilters from "./AdminOrderFilters";
import AdminOrderCard from "./AdminOrderCard";

const PAGE_SIZE = 10;

function AdminOrders() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  /*
   * Update a filter and reset pagination together.
   */
  function handleFilterChange(setFilter, value) {
    setFilter(value);
    setPage(1);
  }

  const { data, isLoading, isFetching, error } = useAdminOrders({
    page,
    pageSize: PAGE_SIZE,
    search,
    status: statusFilter,
    payment: paymentFilter,
    dateRange,
  });

  const orders = data?.orders ?? [];
  const totalCount = data?.totalCount ?? 0;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const firstItem = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, totalCount);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];

    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let number = start; number <= end; number++) {
      pages.push(number);
    }

    return pages;
  }, [page, totalPages]);

  function handlePreviousPage() {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }

  function handleNextPage() {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1));
  }

  function handlePageChange(pageNumber) {
    setPage(pageNumber);
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <p className="text-warm-gray">Loading orders...</p>
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
      {/* Page header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-basil-600">
          Order management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-espresso">Orders</h1>

        <p className="mt-2 text-sm text-warm-gray">
          Review customer orders, payments, and delivery information.
        </p>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-sm">
        <AdminOrderFilters
          search={search}
          setSearch={(value) => handleFilterChange(setSearch, value)}
          statusFilter={statusFilter}
          setStatusFilter={(value) =>
            handleFilterChange(setStatusFilter, value)
          }
          paymentFilter={paymentFilter}
          setPaymentFilter={(value) =>
            handleFilterChange(setPaymentFilter, value)
          }
          dateRange={dateRange}
          setDateRange={(value) => handleFilterChange(setDateRange, value)}
          resultCount={totalCount}
        />

        {/* Order list */}
        <div className="relative bg-ivory/30 p-4 sm:p-5 lg:p-6">
          {isFetching && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-basil-500/10">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-basil-500" />
            </div>
          )}

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-warm-border/60 bg-white px-6 py-14 text-center">
              <p className="font-semibold text-espresso">No orders found</p>

              <p className="mt-1 text-sm text-warm-gray">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <AdminOrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex flex-col gap-4 border-t border-warm-border/50 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            {/* Result information */}
            <p className="text-sm text-warm-gray">
              Showing{" "}
              <span className="font-semibold text-espresso">{firstItem}</span> –{" "}
              <span className="font-semibold text-espresso">{lastItem}</span> of{" "}
              <span className="font-semibold text-espresso">{totalCount}</span>{" "}
              orders
            </p>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-warm-gray transition hover:bg-ivory hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => handlePageChange(pageNumber)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
                      pageNumber === page
                        ? "bg-basil-600 text-white shadow-sm"
                        : "text-warm-gray hover:bg-ivory hover:text-espresso"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-warm-gray transition hover:bg-ivory hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
