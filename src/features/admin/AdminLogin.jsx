import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../services/supabase";
import { getAdminProfile } from "../../services/adminService";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Could not load your account.");
      await supabase.auth.signOut();
      setIsLoading(false);
      return;
    }

    let profile;

    try {
      profile = await getAdminProfile(user.id);
    } catch {
      setError("Could not load your account profile.");
      await supabase.auth.signOut();
      setIsLoading(false);
      return;
    }

    if (!profile?.is_active) {
      setError("Your account is inactive.");
      await supabase.auth.signOut();
      setIsLoading(false);
      return;
    }

    if (profile.role !== "admin") {
      setError(
        "This account does not have administrator access. Please use the staff login.",
      );
      await supabase.auth.signOut();
      setIsLoading(false);
      return;
    }

    navigate("/admin", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-basil-500/20 bg-white p-8 shadow-lg sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-basil-600">
              Nanna's Pizza
            </p>

            <h1 className="mt-2 text-3xl font-bold text-espresso">
              Admin Portal
            </h1>

            <p className="mt-2 text-sm text-warm-gray">
              Sign in to manage the restaurant.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold text-espresso"
              >
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl bg-cream px-4 py-3 outline-none ring-1 ring-black/10 transition focus:ring-2 focus:ring-basil-500"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-espresso"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-xl bg-cream px-4 py-3 outline-none ring-1 ring-black/10 transition focus:ring-2 focus:ring-basil-500"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-tomato-400/10 px-4 py-3 text-sm leading-relaxed text-tomato-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-basil-600 px-4 py-3 font-semibold text-white transition hover:bg-basil-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in to admin"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-warm-gray">
          Authorized administrators only.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
