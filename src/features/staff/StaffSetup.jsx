import { useEffect, useState } from "react";
import { LockKeyhole, MailCheck } from "lucide-react";
import { useNavigate } from "react-router";

import { supabase } from "../../services/supabase";

function StaffSetup() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkInvitationSession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          setError("Could not verify your invitation. Please try again.");
          setSession(null);
          return;
        }

        setSession(data.session);
      } catch (err) {
        console.error("Invitation session check failed:", err);

        if (isMounted) {
          setError("Could not verify your invitation. Please try again.");
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    checkInvitationSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!session) {
      setError(
        "Your invitation session is no longer valid. Please ask your administrator to send a new invitation.",
      );
      return;
    }

    setIsSaving(true);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      if (!data.user) {
        throw new Error("Could not verify your updated account.");
      }

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error("Could not end the setup session:", signOutError);
      }

      navigate("/staff/login", {
        replace: true,
        state: {
          setupComplete: true,
        },
      });
    } catch (err) {
      console.error("Staff password setup failed:", err);

      setError("Could not set your password. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
        <div className="text-sm text-warm-gray">
          Checking your invitation...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-5 py-10">
        <div className="w-full max-w-md rounded-2xl border border-warm-border/60 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tomato-500/10 text-tomato-600">
            <MailCheck size={22} strokeWidth={1.8} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-espresso">
            Invitation unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-warm-gray">
            {error ||
              "This invitation is invalid, expired, or already used. Please ask your administrator to send a new invitation."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/staff/login", { replace: true })}
            className="mt-6 w-full rounded-xl bg-tomato-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-tomato-600"
          >
            Go to staff login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-warm-border/60 bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-basil-500/10 text-basil-600">
            <LockKeyhole size={22} strokeWidth={1.8} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-basil-600">
            Team account
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-espresso sm:text-3xl">
            Set your password
          </h1>

          <p className="mt-2 text-sm leading-6 text-warm-gray">
            Your account has been created. Set a password to finish your account
            setup.
          </p>

          {/* Account */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-warm-border/50 bg-ivory/40 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-warm-gray shadow-sm">
              <MailCheck size={17} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-warm-gray">Account</p>

              <p className="truncate text-sm font-semibold text-espresso">
                {session.user.email}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="staff-password"
                className="block text-sm font-medium text-espresso"
              >
                Password
              </label>

              <input
                id="staff-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoFocus
                autoComplete="new-password"
                placeholder="Enter your password"
                required
                minLength={8}
                className="mt-2 block w-full rounded-xl border border-warm-border/70 bg-white px-3.5 py-2.5 text-sm text-espresso outline-none transition placeholder:text-warm-gray/50 focus:border-basil-500 focus:ring-2 focus:ring-basil-500/10"
              />

              <p className="mt-1.5 text-xs text-warm-gray">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="staff-confirm-password"
                className="block text-sm font-medium text-espresso"
              >
                Confirm password
              </label>

              <input
                id="staff-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Enter your password again"
                required
                minLength={8}
                className="mt-2 block w-full rounded-xl border border-warm-border/70 bg-white px-3.5 py-2.5 text-sm text-espresso outline-none transition placeholder:text-warm-gray/50 focus:border-basil-500 focus:ring-2 focus:ring-basil-500/10"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-tomato-500/15 bg-tomato-400/5 px-4 py-3"
              >
                <p className="text-sm font-medium leading-5 text-tomato-600">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-tomato-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-tomato-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Setting password..." : "Set password"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-warm-gray">
          Nanna's Pizza · Team access
        </p>
      </div>
    </div>
  );
}

export default StaffSetup;
