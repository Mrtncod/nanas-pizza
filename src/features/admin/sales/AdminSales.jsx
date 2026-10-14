import { useMemo, useState } from "react";

import { useAdminSalesSummary } from "../../../hooks/useAdminSalesSummary";
import { useAdminSalesTrend } from "../../../hooks/useAdminSalesTrend";
import { useAdminSalesPizzaPerformance } from "../../../hooks/useAdminSalesPizzaPerformance";
import { useAdminSalesPaymentPerformance } from "../../../hooks/useAdminSalesPaymentPerformance";
import { useAdminSalesComparison } from "../../../hooks/useAdminSalesComparison";
import { useAdminSalesInsights } from "../../../hooks/useAdminSalesInsights";

import { formatCurrency } from "../../../utils/helpers";

import SalesRevenueChart from "./SalesRevenueChart";
import SalesOrdersChart from "./SalesOrdersChart";
import PizzaPerformance from "./PizzaPerformance";
import PaymentPerformance from "./PaymentPerformance";
import SalesKpiCard from "./SalesKpiCard";
import SalesInsights from "./SalesInsights";

const PERIODS = {
  "7days": 7,
  "30days": 30,
  "90days": 90,
  all: null,
};

function getDateRange(period) {
  if (period === "all") {
    return {
      startDate: null,
      endDate: null,
    };
  }

  const now = new Date();

  const startDate = new Date(now);

  startDate.setDate(startDate.getDate() - PERIODS[period]);

  return {
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
  };
}

function AdminSales() {
  const [period, setPeriod] = useState("30days");

  const dateRange = useMemo(() => getDateRange(period), [period]);

  // Summary
  const { data, isLoading, isFetching, error } =
    useAdminSalesSummary(dateRange);

  // Revenue + orders trend
  const {
    data: salesTrend = [],
    isLoading: isTrendLoading,
    error: trendError,
  } = useAdminSalesTrend(dateRange);

  // Pizza performance
  const {
    data: pizzaPerformance = [],
    isLoading: isPizzaPerformanceLoading,
    error: pizzaPerformanceError,
  } = useAdminSalesPizzaPerformance(dateRange);

  // Payment performance
  const {
    data: paymentPerformance = [],
    isLoading: isPaymentPerformanceLoading,
    error: paymentPerformanceError,
  } = useAdminSalesPaymentPerformance(dateRange);

  // Period comparison
  const { data: comparisonData } = useAdminSalesComparison(dateRange);

  // Sales insights
  const {
    data: salesInsights,
    isLoading: isInsightsLoading,
    error: insightsError,
  } = useAdminSalesInsights(dateRange);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <p className="text-warm-gray">Loading sales...</p>
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-basil-600">
          Business analytics
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-espresso sm:text-4xl">
          Sales
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-warm-gray">
          Understand revenue, orders, and sales performance across your
          business.
        </p>
      </div>

      {/* Period selector */}
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
            Reporting period
          </p>

          <p className="mt-1 text-sm text-espresso">
            View performance for the selected period
          </p>
        </div>

        <div className="flex w-full rounded-xl bg-warm-border/20 p-1 sm:w-auto">
          {Object.keys(PERIODS).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition sm:flex-none sm:px-4 ${
                period === value
                  ? "bg-white text-espresso shadow-sm"
                  : "text-warm-gray hover:text-espresso"
              }`}
            >
              {value === "7days" && "7 days"}
              {value === "30days" && "30 days"}
              {value === "90days" && "90 days"}
              {value === "all" && "All time"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SalesKpiCard
          label="Revenue"
          value={formatCurrency(data.total_revenue)}
          changePercent={comparisonData?.revenue_change_percent}
        />

        <SalesKpiCard
          label="Orders"
          value={data.total_orders}
          changePercent={comparisonData?.orders_change_percent}
        />

        <SalesKpiCard label="Paid orders" value={data.paid_orders} />

        <SalesKpiCard
          label="Average order"
          value={formatCurrency(data.average_order_value)}
          changePercent={comparisonData?.average_order_value_change_percent}
        />
      </div>

      {/* Revenue + orders charts */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {isTrendLoading ? (
          <>
            <div className="h-[26rem] animate-pulse rounded-2xl border border-warm-border/40 bg-white shadow-sm" />

            <div className="h-[26rem] animate-pulse rounded-2xl border border-warm-border/40 bg-white shadow-sm" />
          </>
        ) : trendError ? (
          <div className="xl:col-span-2 rounded-2xl border border-tomato-500/20 bg-tomato-400/10 p-5">
            <p className="font-semibold text-tomato-600">
              {trendError.message}
            </p>
          </div>
        ) : (
          <>
            <SalesRevenueChart data={salesTrend} />

            <SalesOrdersChart data={salesTrend} />
          </>
        )}
      </div>

      {/* Pizza performance */}
      <div className="mt-6">
        {isPizzaPerformanceLoading ? (
          <div className="h-96 animate-pulse rounded-2xl bg-warm-border/20" />
        ) : pizzaPerformanceError ? (
          <div className="rounded-2xl border border-tomato-500/20 bg-tomato-400/10 p-5">
            <p className="font-semibold text-tomato-600">
              {pizzaPerformanceError.message}
            </p>
          </div>
        ) : (
          <PizzaPerformance data={pizzaPerformance} />
        )}
      </div>

      {/* Payment performance */}
      <div className="mt-6">
        {isPaymentPerformanceLoading ? (
          <div className="h-96 animate-pulse rounded-2xl bg-warm-border/20" />
        ) : paymentPerformanceError ? (
          <div className="rounded-2xl border border-tomato-500/20 bg-tomato-400/10 p-5">
            <p className="font-semibold text-tomato-600">
              {paymentPerformanceError.message}
            </p>
          </div>
        ) : (
          <PaymentPerformance data={paymentPerformance} />
        )}
      </div>

      {/* Sales insights */}
      <div className="mt-6">
        {isInsightsLoading ? (
          <div className="h-64 animate-pulse rounded-2xl bg-warm-border/20" />
        ) : insightsError ? (
          <div className="rounded-2xl border border-tomato-500/20 bg-tomato-400/10 p-5">
            <p className="font-semibold text-tomato-600">
              {insightsError.message}
            </p>
          </div>
        ) : (
          <SalesInsights data={salesInsights} />
        )}
      </div>

      {/* Background refetch indicator */}
      {isFetching && (
        <div className="mt-5 flex items-center justify-end gap-2 text-xs text-warm-gray">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-basil-600" />

          <span>Updating sales data...</span>
        </div>
      )}
    </div>
  );
}

export default AdminSales;
