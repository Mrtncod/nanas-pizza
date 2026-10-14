import AdminPizzaCard from "./AdminPizzaCard";

function AdminPizzaList({
  pizzas,
  openMenuId,
  onMenuToggle,
  onEdit,
  onDeleteRequest,
}) {
  return (
    <div className="overflow-visible rounded-2xl border border-warm-border/60 bg-white shadow-sm">
      {/* Desktop headings */}
      <div className="hidden border-b border-[#eee4dc] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8d85] md:grid md:grid-cols-[minmax(0,1fr)_110px_130px_46px] md:items-center md:gap-5">
        <span>Pizza</span>
        <span>Price</span>
        <span>Availability</span>
        <span />
      </div>

      <div className="divide-y divide-warm-border/40">
        {pizzas.map((pizza) => (
          <AdminPizzaCard
            key={pizza.id}
            pizza={pizza}
            isMenuOpen={openMenuId === pizza.id}
            onMenuToggle={(isOpen) => onMenuToggle(isOpen ? pizza.id : null)}
            onEdit={() => onEdit(pizza)}
            onDeleteRequest={onDeleteRequest}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminPizzaList;
