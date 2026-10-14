import { Navigate, Outlet } from "react-router";

import { supabase } from "../../services/supabase";
import { useAdminAuth } from "../../hooks/useAdminAuth";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const { user, profile, isLoading, setProfile } = useAdminAuth();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Could not sign out:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <p className="text-warm-gray">Checking admin authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!profile || !profile.is_active) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-espresso">Access denied</h1>

          <p className="mt-2 text-warm-gray">
            Your admin account is inactive or could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (profile.role !== "admin") {
    return <Navigate to="/staff" replace />;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar onSignOut={handleSignOut} />

      <div className="lg:pl-64">
        <AdminHeader profile={profile} />

        <main>
          <Outlet context={{ user, profile, setProfile }} />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
