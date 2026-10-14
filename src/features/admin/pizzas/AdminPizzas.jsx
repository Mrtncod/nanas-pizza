import { useState } from "react";
import { Plus } from "lucide-react";

import { useAdminPizzas } from "../../../hooks/useAdminPizzas";

import AdminPizzaModal from "./AdminPizzaModal";
import AdminPizzaSummary from "./AdminPizzaSummary";
import AdminPizzaList from "./AdminPizzaList";
import AdminPizzaDeleteModal from "./AdminPizzaDeleteModal";

function AdminPizzas() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingPizza, setDeletingPizza] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState(null);

  const { data: pizzas = [], isLoading, isError, error } = useAdminPizzas();

  const totalPizzas = pizzas.length;

  const availablePizzas = pizzas.filter((pizza) => !pizza.sold_out).length;

  const soldOutPizzas = pizzas.filter((pizza) => pizza.sold_out).length;

  function handleAddPizza() {
    setOpenMenuId(null);
    setIsAddModalOpen(true);
  }

  function handleEditPizza(pizza) {
    setOpenMenuId(null);
    setEditingPizza(pizza);
  }

  function handleDeleteRequest(pizza) {
    setOpenMenuId(null);
    setDeletingPizza(pizza);
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-basil-600">
              Menu management
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-espresso sm:text-4xl">
              Pizzas
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-warm-gray">
              Manage your menu, pricing, availability and pizza images.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddPizza}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-basil-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-basil-600 focus:outline-none focus:ring-2 focus:ring-tomato-500/20 focus:ring-offset-2"
          >
            <Plus size={18} strokeWidth={2.2} />
            Add pizza
          </button>
        </div>

        {/* Summary */}
        <AdminPizzaSummary
          total={totalPizzas}
          available={availablePizzas}
          soldOut={soldOutPizzas}
        />

        {/* Pizza list */}
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-espresso">
                All pizzas
              </h2>

              <p className="mt-1 text-sm text-warm-gray">
                Your current menu items.
              </p>
            </div>

            <span className="hidden rounded-full bg-ivory px-3 py-1.5 text-xs font-semibold text-warm-gray sm:inline-flex">
              {totalPizzas} {totalPizzas === 1 ? "pizza" : "pizzas"}
            </span>
          </div>

          {/* Loading */}
          {isLoading && <PizzaListSkeleton />}

          {/* Error */}
          {isError && (
            <div className="rounded-2xl border border-tomato-500/20 bg-tomato-400/10 p-5">
              <p className="font-semibold text-tomato-600">
                Could not load pizzas.
              </p>

              <p className="mt-1 text-sm text-tomato-600/80">
                {error?.message ||
                  "Something went wrong while loading the menu."}
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && pizzas.length === 0 && (
            <div className="rounded-2xl border border-dashed border-warm-border/60 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-tomato-500">
                <Plus size={21} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-espresso">
                No pizzas yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-warm-gray">
                Add your first pizza to start building the menu.
              </p>

              <button
                type="button"
                onClick={handleAddPizza}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-tomato-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-tomato-600"
              >
                <Plus size={17} />
                Add pizza
              </button>
            </div>
          )}

          {/* Pizza list */}
          {!isLoading && !isError && pizzas.length > 0 && (
            <AdminPizzaList
              pizzas={pizzas}
              openMenuId={openMenuId}
              onMenuToggle={setOpenMenuId}
              onEdit={handleEditPizza}
              onDeleteRequest={handleDeleteRequest}
            />
          )}
        </div>
      </div>

      {/* Add pizza */}
      {isAddModalOpen && (
        <AdminPizzaModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {/* Edit pizza */}
      {editingPizza && (
        <AdminPizzaModal
          pizza={editingPizza}
          onClose={() => setEditingPizza(null)}
        />
      )}

      {/* Delete pizza */}
      {deletingPizza && (
        <AdminPizzaDeleteModal
          pizza={deletingPizza}
          onClose={() => setDeletingPizza(null)}
        />
      )}
    </>
  );
}

function PizzaListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-warm-border/60 bg-white shadow-sm">
      <div className="divide-y divide-warm-border/40">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-4 py-4 sm:px-5"
          >
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-warm-border/30 sm:h-[68px] sm:w-[68px]" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-warm-border/30" />

              <div className="h-3 w-52 max-w-full animate-pulse rounded bg-warm-border/20" />

              <div className="hidden h-3 w-40 animate-pulse rounded bg-warm-border/20 sm:block" />
            </div>

            <div className="hidden h-4 w-16 animate-pulse rounded bg-warm-border/30 md:block" />

            <div className="hidden h-7 w-24 animate-pulse rounded-full bg-warm-border/30 md:block" />

            <div className="h-9 w-9 animate-pulse rounded-lg bg-warm-border/30" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPizzas;
