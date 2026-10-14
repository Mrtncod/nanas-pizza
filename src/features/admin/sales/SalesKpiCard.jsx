import { ArrowDown, ArrowUp, Minus } from "lucide-react";

function SalesKpiCard({
  label,
  value,
  changePercent = null,
  comparisonLabel = "vs previous period",
}) {
  const hasComparison =
    typeof changePercent === "number" && Number.isFinite(changePercent);

  const isPositive = hasComparison && changePercent > 0;
  const isNegative = hasComparison && changePercent < 0;

  const Icon = isPositive ? ArrowUp : isNegative ? ArrowDown : Minus;

  return (
    <div className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm">
      <p className="text-sm text-warm-gray">{label}</p>

      <p className="mt-2 text-2xl font-bold text-espresso">{value}</p>

      {hasComparison ? (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${
              isPositive
                ? "bg-basil-600/10 text-basil-700"
                : isNegative
                  ? "bg-tomato-400/10 text-tomato-600"
                  : "bg-warm-border/30 text-warm-gray"
            }`}
          >
            <Icon size={13} strokeWidth={2.5} />
            {Math.abs(changePercent).toFixed(1)}%
          </span>

          <span className="text-xs text-warm-gray">{comparisonLabel}</span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-warm-gray">No previous period</p>
      )}
    </div>
  );
}

export default SalesKpiCard;
