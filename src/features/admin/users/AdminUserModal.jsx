import { useForm } from "react-hook-form";
import { useCreateAdminUser } from "../../../hooks/useCreateAdminUser";
import { useUpdateAdminUser } from "../../../hooks/useUpdateAdminUser";

function AdminUserModal({ onClose, user = null }) {
  const createUser = useCreateAdminUser();
  const updateUser = useUpdateAdminUser();

  const isEditing = Boolean(user);
  const mutation = isEditing ? updateUser : createUser;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "staff",
    },
  });

  function onSubmit(values) {
    if (isEditing) {
      updateUser.mutate(
        {
          userId: user.id,
          fullName: values.fullName.trim(),
          role: values.role,
        },
        {
          onSuccess: onClose,
        },
      );

      return;
    }

    createUser.mutate(
      {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        role: values.role,
      },
      {
        onSuccess: onClose,
      },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-espresso/40 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-member-modal-title"
    >
      <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-xl sm:h-auto sm:max-h-[calc(100dvh-2.5rem)] sm:max-w-xl sm:rounded-2xl sm:border sm:border-warm-border/60">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-warm-border/40 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-basil-600">
              Team management
            </p>

            <h2
              id="team-member-modal-title"
              className="mt-1 text-lg font-semibold text-espresso"
            >
              {isEditing ? "Edit team member" : "Add team member"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-warm-gray transition hover:bg-ivory hover:text-espresso disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
            <div className="space-y-5">
              {/* Full name */}
              <div>
                <label
                  htmlFor="team-member-name"
                  className="block text-sm font-medium text-espresso"
                >
                  Full name
                </label>

                <input
                  id="team-member-name"
                  type="text"
                  placeholder="e.g. Anna Müller"
                  autoFocus
                  maxLength={100}
                  {...register("fullName", {
                    required: "Full name is required.",
                    minLength: {
                      value: 2,
                      message: "Full name must be at least 2 characters.",
                    },
                    maxLength: {
                      value: 100,
                      message: "Full name cannot exceed 100 characters.",
                    },
                  })}
                  className="mt-2 block w-full rounded-xl border border-warm-border/70 bg-white px-3.5 py-2.5 text-sm text-espresso outline-none transition placeholder:text-warm-gray/50 focus:border-basil-500 focus:ring-2 focus:ring-basil-500/10"
                />

                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-tomato-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="team-member-email"
                  className="block text-sm font-medium text-espresso"
                >
                  Email
                </label>

                <input
                  id="team-member-email"
                  type="email"
                  readOnly={isEditing}
                  placeholder="e.g. anna@nannaspizza.com"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address.",
                    },
                  })}
                  className={`mt-2 block w-full rounded-xl border border-warm-border/70 px-3.5 py-2.5 text-sm text-espresso outline-none transition placeholder:text-warm-gray/50 focus:border-basil-500 focus:ring-2 focus:ring-basil-500/10 ${
                    isEditing ? "cursor-not-allowed bg-ivory/60" : "bg-white"
                  }`}
                />

                {errors.email && !isEditing && (
                  <p className="mt-1.5 text-xs text-tomato-600">
                    {errors.email.message}
                  </p>
                )}

                <p className="mt-1.5 text-xs leading-5 text-warm-gray">
                  {isEditing
                    ? "Email addresses cannot be changed here."
                    : "This email will be used to sign in to the staff system."}
                </p>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="team-member-role"
                  className="block text-sm font-medium text-espresso"
                >
                  Role
                </label>

                <select
                  id="team-member-role"
                  {...register("role", {
                    required: "Please select a role.",
                    validate: (value) =>
                      ["staff", "delivery"].includes(value) ||
                      "Please select a valid team role.",
                  })}
                  className="mt-2 block w-full rounded-xl border border-warm-border/70 bg-white px-3.5 py-2.5 text-sm text-espresso outline-none transition focus:border-basil-500 focus:ring-2 focus:ring-basil-500/10"
                >
                  <option value="staff">Staff</option>
                  <option value="delivery">Delivery</option>
                </select>

                {errors.role && (
                  <p className="mt-1.5 text-xs text-tomato-600">
                    {errors.role.message}
                  </p>
                )}

                <p className="mt-1.5 text-xs leading-5 text-warm-gray">
                  Staff manage orders. Delivery handles orders that are ready
                  for delivery.
                </p>
              </div>

              {/* Account setup information — creation only */}
              {!isEditing && (
                <div className="rounded-xl border border-warm-border/50 bg-ivory/40 px-4 py-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
                    Account setup
                  </p>

                  <p className="mt-1 text-sm font-medium text-espresso">
                    No password required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-warm-gray">
                    The team member will receive instructions to set their
                    password and access their account.
                  </p>
                </div>
              )}

              {/* Mutation error */}
              {mutation.error && (
                <div
                  role="alert"
                  className="rounded-xl border border-tomato-500/15 bg-tomato-400/5 px-4 py-3"
                >
                  <p className="text-sm font-medium leading-5 text-tomato-600">
                    {mutation.error.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-warm-border/40 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-xl border border-warm-border/70 px-4 py-2.5 text-sm font-semibold text-espresso transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-xl bg-tomato-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-tomato-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending
                ? isEditing
                  ? "Saving changes..."
                  : "Creating account..."
                : isEditing
                  ? "Save changes"
                  : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUserModal;
