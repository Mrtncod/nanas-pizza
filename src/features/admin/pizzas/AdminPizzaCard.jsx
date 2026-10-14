import { useEffect, useRef } from "react";
import { CheckCircle2, Utensils } from "lucide-react";

import AdminPizzaActionsMenu from "./AdminPizzaActionsMenu";
import { useUpdateAdminPizzaAvailability } from "../../../hooks/useUpdateAdminPizzaAvailability";
import { useDeleteAdminPizza } from "../../../hooks/useDeleteAdminPizza";
import { formatCurrency } from "../../../utils/helpers";

function AdminPizzaCard({
  pizza,
  isMenuOpen,
  onMenuToggle,
  onEdit,
  onDeleteRequest,
}) {
  const menuRef = useRef(null);

  const {
    mutate: updateAvailability,
    isPending: isUpdating,
    error,
  } = useUpdateAdminPizzaAvailability();

  const deletePizza = useDeleteAdminPizza();

  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onMenuToggle(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isMenuOpen, onMenuToggle]);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onMenuToggle(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, onMenuToggle]);

  function handleAvailabilityToggle() {
    onMenuToggle(false);

    updateAvailability({
      pizzaId: pizza.id,
      soldOut: !pizza.sold_out,
    });
  }

  function handleEdit() {
    onMenuToggle(false);
    onEdit();
  }

  function handleDelete() {
    onMenuToggle(false);
    onDeleteRequest(pizza);
  }

  return (
    <article className="relative min-w-0">
      <div
        className="
          grid
          min-w-0
          grid-cols-[minmax(0,1fr)_auto]
          items-center
          gap-x-3
          gap-y-2
          px-4
          py-4
          transition-colors
          hover:bg-ivory/40
          sm:px-5
          md:grid-cols-[minmax(0,1fr)_110px_130px_46px]
          md:items-center
          md:gap-5
          md:py-4
        "
      >
        {/* Pizza information */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {/* Image */}
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-warm-border/60 bg-ivory sm:h-[68px] sm:w-[68px]">
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

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="min-w-0 truncate text-sm font-semibold text-espresso sm:text-base">
                {pizza.name}
              </h2>

              {/* Mobile status */}
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold md:hidden ${
                  pizza.sold_out
                    ? "bg-tomato-400/10 text-tomato-600"
                    : "bg-basil-500/10 text-basil-600"
                }`}
              >
                {pizza.sold_out ? "Sold out" : "Available"}
              </span>
            </div>

            <p className="mt-0.5 truncate text-xs leading-5 text-warm-gray sm:text-sm">
              {pizza.description || "No description added."}
            </p>

            <p className="mt-1 hidden truncate text-xs text-warm-gray/70 sm:block">
              {pizza.ingredients || "No ingredients listed."}
            </p>
          </div>
        </div>

        {/* Desktop price */}
        <div className="hidden min-w-0 md:block">
          <p className="text-sm font-semibold text-espresso">
            {formatCurrency(pizza.price)}
          </p>
        </div>

        {/* Desktop availability */}
        <div className="hidden md:block">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              pizza.sold_out
                ? "bg-tomato-400/10 text-tomato-600"
                : "bg-basil-500/10 text-basil-600"
            }`}
          >
            {!pizza.sold_out && <CheckCircle2 size={13} />}

            {pizza.sold_out ? "Sold out" : "Available"}
          </span>
        </div>

        {/* Mobile price */}
        <div className="col-start-1 row-start-2 min-w-0 pl-[68px] sm:pl-[84px] md:hidden">
          <p className="truncate text-sm font-semibold text-espresso">
            {formatCurrency(pizza.price)}
          </p>
        </div>

        {/* Actions */}
        <div
          ref={menuRef}
          className="
            col-start-2
            row-span-2
            row-start-1
            self-center
            md:col-start-4
            md:row-span-1
            md:row-start-auto
          "
        >
          <AdminPizzaActionsMenu
            pizza={pizza}
            isOpen={isMenuOpen}
            isUpdating={isUpdating}
            isDeleting={deletePizza.isPending}
            onToggle={() => onMenuToggle(!isMenuOpen)}
            onEdit={handleEdit}
            onAvailabilityToggle={handleAvailabilityToggle}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Mutation errors */}
      {(error || deletePizza.error) && (
        <div className="border-t border-tomato-500/10 bg-tomato-400/5 px-4 py-2.5 sm:px-5">
          <p className="text-xs font-medium leading-5 text-tomato-600">
            {error?.message || deletePizza.error?.message}
          </p>
        </div>
      )}
    </article>
  );
}

export default AdminPizzaCard;
