import { KeyRound, MoreVertical, Pencil, Power } from "lucide-react";

function AdminUserActionsMenu({
  user,
  isOpen,
  onToggle,
  onEdit,
  onToggleActive,
  onResetPassword,
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-warm-gray transition hover:bg-ivory hover:text-espresso"
        aria-label={`Actions for ${user.fullName}`}
        aria-expanded={isOpen}
      >
        <MoreVertical size={18} strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-warm-border/60 bg-white p-1.5 shadow-lg">
          <button
            type="button"
            onClick={onEdit}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-espresso transition hover:bg-ivory"
          >
            <Pencil size={16} strokeWidth={1.8} />
            Edit user
          </button>

          <button
            type="button"
            onClick={onToggleActive}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-espresso transition hover:bg-ivory"
          >
            <Power size={16} strokeWidth={1.8} />
            {user.isActive ? "Deactivate" : "Activate"}
          </button>

          <div className="my-1 border-t border-warm-border/40" />

          <button
            type="button"
            onClick={onResetPassword}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-espresso transition hover:bg-ivory"
          >
            <KeyRound size={16} strokeWidth={1.8} />
            Reset password
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminUserActionsMenu;
