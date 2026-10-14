import { useSetAdminUserActive } from "../../../hooks/useSetAdminUserActive";

function AdminUserStatusModal({ user, onClose }) {
  const setUserActive = useSetAdminUserActive();

  const isDeactivating = user.isActive;
  const nextIsActive = !user.isActive;

  function handleConfirm() {
    setUserActive.mutate(
      {
        userId: user.id,
        isActive: nextIsActive,
      },
      {
        onSuccess: onClose,
      },
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-stretch justify-center bg-espresso/40 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-status-title"
    >
      <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-xl sm:h-auto sm:max-h-[calc(100dvh-2.5rem)] sm:max-w-md sm:rounded-2xl sm:border sm:border-warm-border/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-warm-border/40 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-basil-600">
              Team management
            </p>

            <h2
              id="user-status-title"
              className="mt-1 text-lg font-semibold text-espresso"
            >
              {isDeactivating ? "Deactivate account?" : "Activate account?"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={setUserActive.isPending}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl leading-none text-warm-gray transition hover:bg-ivory hover:text-espresso disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-6 sm:flex-none">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isDeactivating
                  ? "bg-tomato-400/10 text-tomato-600"
                  : "bg-basil-500/10 text-basil-600"
              }`}
            >
              {isDeactivating ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h8" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M12 3v18M3 12h18" />
                </svg>
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-espresso">{user.fullName}</p>

              <p className="mt-0.5 break-all text-sm text-warm-gray">
                {user.email}
              </p>

              <p className="mt-3 text-sm leading-6 text-warm-gray">
                {isDeactivating
                  ? "This team member will lose account access. Their profile and order history will be preserved. You can reactivate the account later."
                  : "This team member will regain account access and can sign in again."}
              </p>
            </div>
          </div>

          {setUserActive.error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-tomato-500/15 bg-tomato-400/5 px-4 py-3"
            >
              <p className="text-sm leading-5 text-tomato-600">
                {setUserActive.error.message}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-warm-border/40 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={setUserActive.isPending}
            className="rounded-xl border border-warm-border/70 px-4 py-2.5 text-sm font-semibold text-espresso transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={setUserActive.isPending}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isDeactivating
                ? "bg-tomato-500 hover:bg-tomato-600"
                : "bg-basil-600 hover:bg-basil-700"
            }`}
          >
            {setUserActive.isPending
              ? "Updating account..."
              : isDeactivating
                ? "Deactivate account"
                : "Activate account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUserStatusModal;
