import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Pizza,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router";

const navigation = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Sales",
    to: "/admin/sales",
    icon: BarChart3,
  },
  {
    label: "Pizzas",
    to: "/admin/pizzas",
    icon: Pizza,
  },
  {
    label: "Users",
    to: "/admin/users",
    icon: Users,
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar({ onSignOut }) {
  return (
    <aside className="border-b border-warm-border/60 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-3.5 lg:block lg:border-b lg:border-warm-border/60 lg:px-6">
        <div>
          <p className="text-sm font-semibold tracking-wide text-basil-600">
            NANNA'S PIZZA
          </p>

          <p className="mt-1 text-lg font-bold text-espresso">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-4 lg:py-6">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-basil-500/10 text-basil-700"
                  : "text-warm-gray hover:bg-cream hover:text-espresso"
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />

            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-4 pb-4 lg:border-t lg:border-warm-border/60 lg:px-4 lg:pt-4">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-tomato-600 transition hover:bg-tomato-400/10 lg:justify-start"
        >
          <LogOut size={18} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
