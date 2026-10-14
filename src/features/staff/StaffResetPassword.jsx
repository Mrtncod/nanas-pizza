import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../../services/supabase";

function StaffResetPassword() {
  const navigate = useNavigate();

  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let recoveryEventReceived = false;

    // Subscribe before checking the session so we don't miss
    // a recovery event while the component initializes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === "PASSWORD_RECOVERY" && session) {
        recoveryEventReceived = true;
        setIsRecoverySession(true);
        setError("");
      }
    });

    async function checkRecoverySession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          console.error("Recovery session check failed:", sessionError);

          setError(
            "Could not verify your reset link. Please request a new one.",
          );

          return;
        }

        // The session must exist. The URL fragment is only a
        // fallback for cases where Supabase processed the recovery
        // callback before this component subscribed to auth events.
        const hasRecoveryFragment =
          window.location.hash.includes("type=recovery");

        if (data.session && (recoveryEventReceived || hasRecoveryFragment)) {
          setIsRecoverySession(true);
        }
      } catch (err) {
        console.error("Recovery session check failed:", err);

        if (isMounted) {
          setError(
            "Could not verify your reset link. Please request a new one.",
          );
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    checkRecoverySession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    if (!isRecoverySession) {
      setError(
        "Your reset session is no longer valid. Please request a new reset link.",
      );
      return;
    }

    setIsSaving(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      // The password update succeeded. From this point onward,
      // a sign-out failure must not be reported as an update failure.
      setIsSuccess(true);
      setPassword("");
      setConfirmPassword("");

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error("Password updated, but sign-out failed:", signOutError);

        setError(
          "Your password was updated, but we couldn't end your current session. Please try signing out again before continuing.",
        );
      } else {
        setError("");
      }
    } catch (err) {
      console.error("Staff password reset failed:", err);

      setError(
        err.message || "Could not update your password. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReturnToLogin() {
    setError("");

    try {
      // Retry sign-out if the initial attempt failed.
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error("Could not end the recovery session:", signOutError);

        setError(
          "Your password was updated, but we couldn't end your current session. Please try again.",
        );

        return;
      }

      navigate("/staff/login", { replace: true });
    } catch (err) {
      console.error("Could not end the recovery session:", err);

      setError(
        "Your password was updated, but we couldn't end your current session. Please try again.",
      );
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-11 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#a9432b] focus:ring-2 focus:ring-[#a9432b]/10";

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8ee] px-4">
        <div className="flex items-center gap-3 text-sm text-stone-600">
          <LoaderCircle className="animate-spin" size={20} />
          Verifying your reset link...
        </div>
      </main>
    );
  }

  if (!isRecoverySession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fff8ee] to-[#f7ead9] px-4 py-10">
        <section className="w-full max-w-md rounded-3xl border border-stone-200/80 bg-[#fffcf7] p-8 text-center shadow-xl shadow-stone-900/5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <KeyRound size={25} />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-stone-900">
            Reset link unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            This link may have expired or already been used. Request a new
            password reset email to continue.
          </p>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate("/staff/login", { replace: true })}
            className="mt-6 w-full rounded-xl bg-[#a9432b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#913923]"
          >
            Back to staff login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fff8ee] via-[#fffcf7] to-[#f7ead9] px-4 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 bg-[#fffcf7] shadow-xl shadow-stone-900/5">
        <div className="px-7 pb-7 pt-8 sm:px-9">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#a9432b]/10 text-[#a9432b]">
            {isSuccess ? <CheckCircle2 size={26} /> : <LockKeyhole size={26} />}
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#a9432b]">
            Nanna's Pizza · Team access
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
            {isSuccess ? "Password updated" : "Choose a new password"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            {isSuccess
              ? "Your password has been updated. You can now sign in with your new password."
              : "Create a new password for your staff account. Choose one you haven't used elsewhere."}
          </p>

          {!isSuccess && (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className={inputClassName}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter the password again"
                    className={inputClassName}
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-stone-100/80 p-3 text-xs leading-5 text-stone-600">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-[#66805b]"
                  size={17}
                />
                Use at least 8 characters and avoid reusing a password from
                another account.
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a9432b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#913923] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    Updating password...
                  </>
                ) : (
                  "Save new password"
                )}
              </button>
            </form>
          )}

          {isSuccess && (
            <>
              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleReturnToLogin}
                className="mt-7 w-full rounded-xl bg-[#a9432b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#913923]"
              >
                Go to staff login
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default StaffResetPassword;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import {
//   CheckCircle2,
//   Eye,
//   EyeOff,
//   KeyRound,
//   LoaderCircle,
//   LockKeyhole,
//   ShieldCheck,
// } from "lucide-react";
// import { supabase } from "../../services/supabase";

// function StaffResetPassword() {
//   const navigate = useNavigate();

//   const [isRecoverySession, setIsRecoverySession] = useState(false);
//   const [isCheckingSession, setIsCheckingSession] = useState(true);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [isSaving, setIsSaving] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   useEffect(() => {
//     let isMounted = true;

//     async function checkRecoverySession() {
//       const { data, error: sessionError } = await supabase.auth.getSession();

//       if (!isMounted) return;

//       // The recovery link must establish a valid session.
//       // The recovery event below is the primary confirmation.
//       if (sessionError) {
//         setError("Could not verify your reset link. Please request a new one.");
//       }

//       if (data.session && window.location.hash.includes("type=recovery")) {
//         setIsRecoverySession(true);
//       }

//       setIsCheckingSession(false);
//     }

//     checkRecoverySession();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       if (!isMounted) return;

//       if (event === "PASSWORD_RECOVERY" && session) {
//         setIsRecoverySession(true);
//         setError("");
//       }
//     });

//     return () => {
//       isMounted = false;
//       subscription.unsubscribe();
//     };
//   }, []);

//   async function handleSubmit(event) {
//     event.preventDefault();
//     setError("");

//     if (password.length < 8) {
//       setError("Your password must contain at least 8 characters.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("The passwords do not match.");
//       return;
//     }

//     if (!isRecoverySession) {
//       setError(
//         "Your reset session is no longer valid. Please request a new reset link.",
//       );
//       return;
//     }

//     setIsSaving(true);

//     try {
//       const { error: updateError } = await supabase.auth.updateUser({
//         password,
//       });

//       if (updateError) throw updateError;

//       setIsSuccess(true);

//       // End the recovery session so the user signs in normally
//       // with their new password.
//       await supabase.auth.signOut();

//       navigate("/staff/login", { replace: true });
//     } catch (err) {
//       setError(
//         err.message || "Could not update your password. Please try again.",
//       );
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   const inputClassName =
//     "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-11 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#a9432b] focus:ring-2 focus:ring-[#a9432b]/10";

//   if (isCheckingSession) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#fff8ee] px-4">
//         <div className="flex items-center gap-3 text-sm text-stone-600">
//           <LoaderCircle className="animate-spin" size={20} />
//           Verifying your reset link...
//         </div>
//       </main>
//     );
//   }

//   if (!isRecoverySession) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fff8ee] to-[#f7ead9] px-4 py-10">
//         <section className="w-full max-w-md rounded-3xl border border-stone-200/80 bg-[#fffcf7] p-8 text-center shadow-xl shadow-stone-900/5">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
//             <KeyRound size={25} />
//           </div>

//           <h1 className="mt-5 text-2xl font-semibold text-stone-900">
//             Reset link unavailable
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-stone-600">
//             This link may have expired or already been used. Request a new
//             password reset email to continue.
//           </p>

//           {error && (
//             <p role="alert" className="mt-4 text-sm text-red-700">
//               {error}
//             </p>
//           )}

//           <button
//             type="button"
//             onClick={() => navigate("/staff/login", { replace: true })}
//             className="mt-6 w-full rounded-xl bg-[#a9432b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#913923]"
//           >
//             Back to staff login
//           </button>
//         </section>
//       </main>
//     );
//   }

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fff8ee] via-[#fffcf7] to-[#f7ead9] px-4 py-10">
//       <section className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 bg-[#fffcf7] shadow-xl shadow-stone-900/5">
//         <div className="px-7 pb-7 pt-8 sm:px-9">
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#a9432b]/10 text-[#a9432b]">
//             {isSuccess ? <CheckCircle2 size={26} /> : <LockKeyhole size={26} />}
//           </div>

//           <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#a9432b]">
//             Nanna's Pizza · Team access
//           </p>

//           <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
//             {isSuccess ? "Password updated" : "Choose a new password"}
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-stone-600">
//             {isSuccess
//               ? "Your password has been updated. You can now sign in with your new password."
//               : "Create a new password for your staff account. Choose one you haven't used elsewhere."}
//           </p>

//           {!isSuccess && (
//             <form onSubmit={handleSubmit} className="mt-7 space-y-5">
//               <div>
//                 <label
//                   htmlFor="new-password"
//                   className="mb-2 block text-sm font-medium text-stone-700"
//                 >
//                   New password
//                 </label>

//                 <div className="relative">
//                   <input
//                     id="new-password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="new-password"
//                     required
//                     minLength={8}
//                     value={password}
//                     onChange={(event) => setPassword(event.target.value)}
//                     placeholder="At least 8 characters"
//                     className={inputClassName}
//                   />

//                   <button
//                     type="button"
//                     aria-label={
//                       showPassword ? "Hide password" : "Show password"
//                     }
//                     onClick={() => setShowPassword((current) => !current)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="confirm-password"
//                   className="mb-2 block text-sm font-medium text-stone-700"
//                 >
//                   Confirm new password
//                 </label>

//                 <div className="relative">
//                   <input
//                     id="confirm-password"
//                     type={showConfirmPassword ? "text" : "password"}
//                     autoComplete="new-password"
//                     required
//                     minLength={8}
//                     value={confirmPassword}
//                     onChange={(event) => setConfirmPassword(event.target.value)}
//                     placeholder="Enter the password again"
//                     className={inputClassName}
//                   />

//                   <button
//                     type="button"
//                     aria-label={
//                       showConfirmPassword ? "Hide password" : "Show password"
//                     }
//                     onClick={() =>
//                       setShowConfirmPassword((current) => !current)
//                     }
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={18} />
//                     ) : (
//                       <Eye size={18} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-start gap-2 rounded-xl bg-stone-100/80 p-3 text-xs leading-5 text-stone-600">
//                 <ShieldCheck
//                   className="mt-0.5 shrink-0 text-[#66805b]"
//                   size={17}
//                 />
//                 Use at least 8 characters and avoid reusing a password from
//                 another account.
//               </div>

//               {error && (
//                 <div
//                   role="alert"
//                   className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
//                 >
//                   {error}
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={isSaving}
//                 className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a9432b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#913923] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {isSaving ? (
//                   <>
//                     <LoaderCircle className="animate-spin" size={18} />
//                     Updating password...
//                   </>
//                 ) : (
//                   "Save new password"
//                 )}
//               </button>
//             </form>
//           )}

//           {isSuccess && (
//             <button
//               type="button"
//               onClick={() => navigate("/staff/login", { replace: true })}
//               className="mt-7 w-full rounded-xl bg-[#a9432b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#913923]"
//             >
//               Go to staff login
//             </button>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }

// export default StaffResetPassword;
