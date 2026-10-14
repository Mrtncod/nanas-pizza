import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../services/supabase";

function StaffLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        await supabase.auth.signOut();
        setError("Could not verify your account. Please try again.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setError("Could not verify your account profile. Please try again.");
        return;
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        setError("Your account is inactive.");
        return;
      }

      if (profile.role === "admin") {
        await supabase.auth.signOut();
        setError(
          "This is an administrator account. Please use the admin login.",
        );
        return;
      }

      if (!["staff", "delivery"].includes(profile.role)) {
        await supabase.auth.signOut();
        setError("Your account does not have staff access.");
        return;
      }

      navigate("/staff", { replace: true });
    } catch (err) {
      console.error("Staff login failed:", err);

      setError("Something went wrong while signing in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md items-center justify-center px-4 py-16">
      <div className="w-full rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-basil-600">
            Nanna's Pizza
          </p>

          <h1 className="text-3xl font-bold text-espresso">Staff Login</h1>

          <p className="mt-2 text-sm text-warm-gray">
            Sign in to manage restaurant orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-espresso"
            >
              Email
            </label>

            <input
              id="email"
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
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-espresso"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl bg-cream px-4 py-3 outline-none ring-1 ring-black/10 transition focus:ring-2 focus:ring-basil-500"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-tomato-400/10 px-4 py-3 text-sm text-tomato-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-basil-600 px-4 py-3 font-semibold text-white transition hover:bg-basil-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
