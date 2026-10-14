import { Bike, CheckCircle2, Clock3, ShoppingBag, Wallet } from "lucide-react";

import { formatCurrency } from "../../../utils/helpers";

function DashboardStats({ stats }) {
  const cards = [
    {
      label: "Today's revenue",
      value: formatCurrency(stats.todaysRevenue),
      icon: Wallet,
      description: "Paid orders today",
      iconClass: "bg-basil-500/10 text-basil-600",
    },
    {
      label: "Today's orders",
      value: stats.todaysOrders,
      icon: ShoppingBag,
      description: "Orders received today",
      iconClass: "bg-tomato-400/10 text-tomato-600",
    },
    {
      label: "Preparing",
      value: stats.preparing,
      icon: Clock3,
      description: "Currently in preparation",
      iconClass: "bg-golden-500/10 text-golden-600",
    },
    {
      label: "Ready",
      value: stats.ready,
      icon: CheckCircle2,
      description: "Ready for delivery",
      iconClass: "bg-basil-500/10 text-basil-600",
    },
    {
      label: "Out for delivery",
      value: stats.outForDelivery,
      icon: Bike,
      description: "Currently on the way",
      iconClass: "bg-tomato-400/10 text-tomato-600",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle2,
      description: "Completed orders today",
      iconClass: "bg-basil-600/10 text-basil-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, description, iconClass }) => (
        <div
          key={label}
          className="rounded-2xl border border-warm-border/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-warm-gray">{label}</p>

              <p className="mt-2 text-3xl font-bold text-espresso">{value}</p>
            </div>

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
            >
              <Icon size={21} strokeWidth={2} />
            </div>
          </div>

          <p className="mt-4 text-xs text-warm-gray">{description}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;
