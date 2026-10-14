// import { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router";
// import { supabase } from "../../services/supabase";
// import StaffHeader from "./StaffHeader";
// import StaffNav from "./StaffNav";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import { useStaffProfile } from "../../hooks/useStaffProfile";
import StaffHeader from "./StaffHeader";
import StaffNav from "./StaffNav";

function StaffLayout() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;
    let authEventReceived = false;

    async function loadInitialUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!isMounted || authEventReceived) return;

      if (error) {
        console.error("Could not verify staff authentication:", error);
        setUser(null);
      } else {
        setUser(data.user);
      }

      setIsAuthLoading(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      authEventReceived = true;

      if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAuthLoading(false);

        queryClient.removeQueries({
          queryKey: ["staff"],
        });

        return;
      }

      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    loadInitialUser();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const userId = user?.id;

  const {
    data: profile,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useStaffProfile(userId);

  if (isAuthLoading || (user && (isProfileLoading || isProfileFetching))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-warm-gray">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/staff/login" replace />;
  }

  if (isProfileError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-espresso">
            Could not verify access
          </h1>

          <p className="mt-2 text-warm-gray">
            {profileError?.message ||
              "We could not verify your account. Please try again."}
          </p>

          <button
            type="button"
            onClick={() => refetchProfile()}
            className="mt-4 rounded-xl bg-tomato-500 px-5 py-3 font-semibold text-white transition hover:bg-tomato-600"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-espresso">Access denied</h1>

          <p className="mt-2 text-warm-gray">
            Your account profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (!profile.is_active) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-espresso">Access denied</h1>

          <p className="mt-2 text-warm-gray">Your account is inactive.</p>
        </div>
      </div>
    );
  }

  if (profile.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (!["staff", "delivery"].includes(profile.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-espresso">Access denied</h1>

          <p className="mt-2 text-warm-gray">
            Your account does not have access to the staff portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <StaffHeader profile={profile} />
      <StaffNav />

      <main>
        <Outlet context={{ user, profile }} />
      </main>
    </div>
  );
}

export default StaffLayout;
