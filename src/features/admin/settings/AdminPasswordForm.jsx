import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import { useChangeAdminPassword } from "../../../hooks/useChangeAdminPassword";

function AdminPasswordForm({ email }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState(null);

  const changePassword = useChangeAdminPassword();

  function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({
        type: "error",
        text: "Please complete all password fields.",
      });
      return;
    }

    if (newPassword.length < 12) {
      setMessage({
        type: "error",
        text: "Your new password must contain at least 12 characters.",
      });
      return;
    }

    if (newPassword === currentPassword) {
      setMessage({
        type: "error",
        text: "Your new password must differ from your current password.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "The new passwords do not match.",
      });
      return;
    }

    changePassword.mutate(
      { email, currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowPasswords(false);

          setMessage({
            type: "success",
            text: "Your password has been changed successfully.",
          });
        },
        onError: (error) => {
          console.error("Could not change admin password:", error);

          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not change your password. Please try again.",
          });
        },
      },
    );
  }

  const fields = [
    {
      id: "currentPassword",
      label: "Current password",
      value: currentPassword,
      setter: setCurrentPassword,
      autocomplete: "current-password",
    },
    {
      id: "newPassword",
      label: "New password",
      value: newPassword,
      setter: setNewPassword,
      autocomplete: "new-password",
    },
    {
      id: "confirmPassword",
      label: "Confirm new password",
      value: confirmPassword,
      setter: setConfirmPassword,
      autocomplete: "new-password",
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-warm-border bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-warm-border px-5 py-5 sm:px-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory text-espresso">
          <LockKeyhole size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-espresso">Account security</h2>
          <p className="mt-1 text-sm text-warm-gray">
            Change your password to keep your admin account secure.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-espresso"
            >
              {field.label}
            </label>

            <div className="relative">
              <input
                id={field.id}
                type={showPasswords ? "text" : "password"}
                autoComplete={field.autocomplete}
                value={field.value}
                onChange={(event) => {
                  field.setter(event.target.value);
                  setMessage(null);
                }}
                minLength={field.id === "newPassword" ? 12 : undefined}
                required
                className="w-full rounded-xl border border-warm-border bg-white px-4 py-3 pr-12 text-sm text-espresso outline-none transition focus:border-tomato focus:ring-2 focus:ring-tomato/15"
              />

              <button
                type="button"
                onClick={() => setShowPasswords((visible) => !visible)}
                aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
                aria-pressed={showPasswords}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 text-warm-gray transition hover:bg-ivory hover:text-espresso"
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ))}

        <p className="text-xs leading-5 text-warm-gray">
          Use at least 12 characters and choose a password you don't use
          elsewhere.
        </p>

        {message && (
          <div
            role={message.type === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
            )}

            <span>{message.text}</span>
          </div>
        )}

        <div className="flex justify-end border-t border-warm-border pt-5">
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-tomato px-5 py-3 text-sm font-semibold text-espresso transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LockKeyhole size={17} />
            {changePassword.isPending
              ? "Updating password..."
              : "Change password"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminPasswordForm;
