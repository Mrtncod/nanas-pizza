import { useState } from "react";
import { AlertCircle, CheckCircle2, Mail, Save, UserRound } from "lucide-react";

import { useUpdateAdminProfileName } from "../../../hooks/useUpdateAdminProfileName";

function AdminProfileForm({ user, profile, setProfile }) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [message, setMessage] = useState(null);

  const updateProfile = useUpdateAdminProfileName();

  const trimmedName = fullName.trim();
  const hasChanged = trimmedName !== (profile?.full_name ?? "");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    if (!trimmedName) {
      setMessage({
        type: "error",
        text: "Please enter your name.",
      });
      return;
    }

    if (!hasChanged || updateProfile.isPending) return;

    updateProfile.mutate(
      { userId: user.id, fullName: trimmedName },
      {
        onSuccess: (updatedProfile) => {
          setProfile(updatedProfile);
          setFullName(updatedProfile.full_name ?? "");

          setMessage({
            type: "success",
            text: "Your name has been updated successfully.",
          });
        },
        onError: (error) => {
          console.error("Could not update admin profile:", error);

          setMessage({
            type: "error",
            text:
              error.message || "Could not update your name. Please try again.",
          });
        },
      },
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-warm-border bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-warm-border px-5 py-5 sm:px-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory text-espresso">
          <UserRound size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-espresso">Personal information</h2>
          <p className="mt-1 text-sm text-warm-gray">
            Update the name associated with your admin account.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-espresso"
          >
            Full name
          </label>

          <input
            id="fullName"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              setMessage(null);
            }}
            className="w-full rounded-xl border border-warm-border bg-white px-4 py-3 text-sm text-espresso outline-none transition focus:border-tomato focus:ring-2 focus:ring-tomato/15"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-espresso"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-warm-gray"
            />

            <input
              id="email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-warm-border bg-ivory py-3 pr-4 pl-11 text-sm text-warm-gray outline-none"
            />
          </div>

          <p className="text-xs text-warm-gray">
            Email changes are not available in this form.
          </p>
        </div>

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
            disabled={updateProfile.isPending || !trimmedName || !hasChanged}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-tomato px-5 py-3 text-sm font-semibold text-espresso transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />
            {updateProfile.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminProfileForm;
