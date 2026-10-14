import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Trash2,
  Utensils,
  X,
} from "lucide-react";

import { useDeleteAdminPizza } from "../../../hooks/useDeleteAdminPizza";
import { formatCurrency } from "../../../utils/helpers";

function AdminPizzaDeleteModal({ pizza, onClose }) {
  const deletePizza = useDeleteAdminPizza();

  async function handleDelete() {
    try {
      await deletePizza.mutateAsync(pizza.id);
      onClose();
    } catch {
      // Error is displayed inside the modal.
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/40 p-3 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-pizza-title"
    >
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-xl sm:max-h-[calc(100dvh-2.5rem)]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-warm-border/40 px-4 py-4 sm:px-6">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tomato-400/10 text-tomato-600">
                <Trash2 size={17} />
              </div>

              <h2
                id="delete-pizza-title"
                className="text-base font-semibold text-espresso"
              >
                Delete pizza
              </h2>
            </div>

            <p className="mt-2 text-sm text-warm-gray">
              This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deletePizza.isPending}
            aria-label="Close delete dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-warm-gray transition hover:bg-ivory hover:text-espresso disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6">
          {/* Pizza */}
          <div className="flex items-center gap-3 rounded-xl border border-warm-border/50 bg-ivory/40 p-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ivory sm:h-16 sm:w-16">
              {pizza.image_url ? (
                <img
                  src={pizza.image_url}
                  alt={pizza.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-warm-gray">
                  <Utensils size={21} strokeWidth={1.5} />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-espresso">
                {pizza.name}
              </h3>

              <p className="mt-1 text-sm text-warm-gray">
                {formatCurrency(pizza.price)}
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-3 rounded-xl border border-tomato-500/20 bg-tomato-400/10 p-3.5 sm:p-4">
            <div className="flex gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-tomato-600"
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-tomato-600">
                  Before you delete this pizza
                </p>

                <p className="mt-1 text-sm leading-5 text-tomato-600/80">
                  If this pizza has been included in previous orders, it cannot
                  be deleted because those orders need to keep their historical
                  pizza reference.
                </p>
              </div>
            </div>
          </div>

          {/* Alternative */}
          <div className="mt-3 rounded-xl border border-basil-500/15 bg-basil-500/5 p-3.5 sm:p-4">
            <div className="flex gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-basil-600"
              />

              <p className="text-sm leading-5 text-warm-gray">
                If you no longer want this pizza on the menu, consider marking
                it as{" "}
                <span className="font-semibold text-espresso">sold out</span>{" "}
                instead.
              </p>
            </div>
          </div>

          {/* Error */}
          {deletePizza.error && (
            <div className="mt-3 rounded-xl border border-tomato-500/20 bg-tomato-400/10 px-3.5 py-3">
              <p className="text-sm font-medium leading-5 text-tomato-600">
                {deletePizza.error.message}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-warm-border/40 bg-white px-4 py-3 sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deletePizza.isPending}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-warm-border/60 bg-white px-4 text-sm font-semibold text-espresso transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deletePizza.isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-tomato-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-tomato-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deletePizza.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete pizza
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPizzaDeleteModal;
