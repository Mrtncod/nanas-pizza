import {
  CheckCircle2,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

function AdminPizzaActionsMenu({
  pizza,
  isOpen,
  isUpdating,
  isDeleting,
  onToggle,
  onEdit,
  onAvailabilityToggle,
  onDelete,
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Actions for ${pizza.name}`}
        aria-expanded={isOpen}
        className={`
          flex h-9 w-9 items-center justify-center
          rounded-lg
          transition-colors
          focus:outline-none
          focus:ring-2
          focus:ring-[#b94b32]/20
          ${
            isOpen
              ? "bg-[#f5ebe4] text-[#8f4937]"
              : "text-[#8f837b] hover:bg-[#f8f1eb] hover:text-[#5f5149]"
          }
        `}
      >
        <MoreVertical size={19} />
      </button>

      {isOpen && (
        <div
          className="
            absolute
            right-0
            top-11
            z-40
            w-52
            overflow-hidden
            rounded-xl
            border
            border-[#e6dcd4]
            bg-white
            p-1.5
            shadow-[0_14px_35px_rgba(58,43,34,0.14)]
          "
        >
          <MenuButton
            icon={<Pencil size={16} className="text-[#806f65]" />}
            onClick={onEdit}
          >
            Edit pizza
          </MenuButton>

          <MenuButton
            disabled={isUpdating}
            icon={
              isUpdating ? (
                <Loader2 size={16} className="animate-spin text-[#806f65]" />
              ) : pizza.sold_out ? (
                <CheckCircle2 size={16} className="text-[#52745a]" />
              ) : (
                <span className="h-4 w-4 rounded-full border-2 border-[#a84e3a]" />
              )
            }
            onClick={onAvailabilityToggle}
          >
            {isUpdating
              ? "Updating..."
              : pizza.sold_out
                ? "Mark available"
                : "Mark sold out"}
          </MenuButton>

          <div className="my-1.5 border-t border-[#eee5df]" />

          <MenuButton
            disabled={isDeleting}
            danger
            icon={
              isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )
            }
            onClick={onDelete}
          >
            {isDeleting ? "Deleting..." : "Delete pizza"}
          </MenuButton>
        </div>
      )}
    </div>
  );
}

function MenuButton({
  children,
  icon,
  onClick,
  disabled = false,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-lg
        px-3
        py-2.5
        text-left
        text-sm
        font-medium
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          danger
            ? "text-[#b04f3b] hover:bg-[#fff2ee]"
            : "text-[#4c4039] hover:bg-[#f8f1eb]"
        }
      `}
    >
      {icon}
      {children}
    </button>
  );
}

export default AdminPizzaActionsMenu;
