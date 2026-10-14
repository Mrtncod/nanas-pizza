import { useResetAdminUserPassword } from "../../../hooks/useResetAdminUserPassword";
import {
  X,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

function AdminUserResetPasswordModal({ user, onClose }) {
  const resetPassword = useResetAdminUserPassword();

  function handleSendResetEmail() {
    resetPassword.mutate(user.id);
  }

  const isSending = resetPassword.isPending;
  const isSuccess = resetPassword.isSuccess;
  const errorMessage = resetPassword.error?.message;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSending) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200/80 bg-[#fffcf7] shadow-2xl shadow-stone-950/15"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-200/80 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              {isSuccess ? <CheckCircle2 size={21} /> : <Mail size={21} />}
            </div>

            <div>
              <h2
                id="reset-password-title"
                className="text-lg font-semibold text-stone-900"
              >
                {isSuccess ? "Reset email sent" : "Reset password"}
              </h2>

              <p className="mt-1 text-sm leading-5 text-stone-500">
                {isSuccess
                  ? "The team member can use the email to choose a new password."
                  : "Send a secure password reset link to this team member."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            aria-label="Close modal"
            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 px-6 py-5">
          <div className="rounded-xl border border-stone-200 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Team member
            </p>

            <p className="mt-2 font-semibold text-stone-800">
              {user.full_name}
            </p>

            <p className="mt-1 break-all text-sm text-stone-500">
              {user.email}
            </p>
          </div>

          {isSuccess ? (
            <div
              role="status"
              className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
            >
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} />

              <p>
                The password reset request was accepted. Ask the team member to
                check their inbox and spam folder.
              </p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-stone-600">
              We'll send a password reset link to the email address above. The
              team member will choose their own new password.
            </p>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <p>{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-stone-200/80 bg-stone-50/60 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:opacity-50"
          >
            {isSuccess ? "Close" : "Cancel"}
          </button>

          {!isSuccess && (
            <button
              type="button"
              onClick={handleSendResetEmail}
              disabled={isSending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#a9432b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#913923] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? (
                <>
                  <LoaderCircle className="animate-spin" size={17} />
                  Sending email...
                </>
              ) : (
                <>
                  <ShieldCheck size={17} />
                  Send reset link
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUserResetPasswordModal;
