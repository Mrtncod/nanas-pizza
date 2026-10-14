import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../services/supabase";

function StaffHeader({ profile }) {
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Could not sign out:", error);
      return;
    }

    navigate("/staff/login", { replace: true });
  }

  return (
    <header className="border-b border-warm-border bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-lg font-bold text-espresso">Nanna's Pizza</p>

          <p className="text-xs font-medium uppercase tracking-wider text-basil-600">
            Staff Portal
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-espresso">
              {profile.full_name}
            </p>

            <p className="text-xs capitalize text-warm-gray">{profile.role}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-warm-gray transition hover:bg-tomato-400/10 hover:text-tomato-600"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default StaffHeader;
