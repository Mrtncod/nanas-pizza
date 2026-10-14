import { NavLink } from "react-router";

function StaffNav() {
  return (
    <nav className="border-b border-warm-border bg-white/50">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        <NavLink
          to="/staff"
          end
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-basil-500 text-white"
                : "text-warm-gray hover:bg-basil-400/10 hover:text-basil-600"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/staff/orders"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-basil-500 text-white"
                : "text-warm-gray hover:bg-basil-400/10 hover:text-basil-600"
            }`
          }
        >
          Orders
        </NavLink>
      </div>
    </nav>
  );
}

export default StaffNav;
