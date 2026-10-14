function AdminPizzaSummary({ total, available, soldOut }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-[#eadfd6] bg-[#fffdf9] px-4 py-3 shadow-[0_4px_18px_rgba(75,55,40,0.03)] sm:px-5">
      <SummaryItem label="Total" value={total} />

      <Divider />

      <SummaryItem
        label="Available"
        value={available}
        valueClassName="text-[#52745a]"
      />

      <Divider />

      <SummaryItem
        label="Sold out"
        value={soldOut}
        valueClassName="text-[#a85d45]"
      />
    </div>
  );
}

function SummaryItem({ label, value, valueClassName = "text-[#342b27]" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-[#9a8d85]">{label}</span>

      <span className={`text-sm font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

function Divider() {
  return (
    <span
      aria-hidden="true"
      className="hidden h-4 w-px bg-[#e8ded6] sm:block"
    />
  );
}

export default AdminPizzaSummary;
