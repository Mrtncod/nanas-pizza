import AdminPizzaForm from "./AdminPizzaForm";
function AdminPizzaModal({ onClose, pizza = null }) {
  const isEditMode = Boolean(pizza);
  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-espresso/40 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pizza-modal-title"
    >
      {" "}
      <div className=" flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-xl sm:h-auto sm:max-h-[calc(100dvh-2.5rem)] sm:max-w-2xl sm:rounded-2xl sm:border sm:border-warm-border/60 ">
        {" "}
        {/* Header */}{" "}
        <div className="flex shrink-0 items-center justify-between border-b border-warm-border/40 px-4 py-4 sm:px-6">
          {" "}
          <div className="min-w-0">
            {" "}
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-basil-600">
              {" "}
              Menu management{" "}
            </p>{" "}
            <h2
              id="pizza-modal-title"
              className="mt-1 truncate text-lg font-semibold text-espresso"
            >
              {" "}
              {isEditMode ? "Edit pizza" : "Add pizza"}{" "}
            </h2>{" "}
          </div>{" "}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-warm-gray transition hover:bg-ivory hover:text-espresso"
            aria-label="Close"
          >
            {" "}
            ×{" "}
          </button>{" "}
        </div>{" "}
        {/* Scrollable form */}{" "}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          {" "}
          <AdminPizzaForm
            mode={isEditMode ? "edit" : "create"}
            pizza={pizza}
            onSuccess={onClose}
            onCancel={onClose}
          />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default AdminPizzaModal;

// import AdminPizzaForm from "./AdminPizzaForm";

// function AdminPizzaModal({ onClose, pizza = null }) {
//   const isEditMode = Boolean(pizza);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-stretch justify-center bg-espresso/40 backdrop-blur-sm sm:items-center sm:p-5"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="pizza-modal-title"
//     >
//       <div
//         className="
//           flex
//           h-[100dvh]
//           w-full
//           flex-col
//           overflow-hidden
//           bg-white
//           shadow-xl
//           sm:h-auto
//           sm:max-h-[calc(100dvh-2.5rem)]
//           sm:max-w-2xl
//           sm:rounded-2xl
//           sm:border
//           sm:border-warm-border/60
//         "
//       >
//         {/* Header */}
//         <div className="flex shrink-0 items-center justify-between border-b border-warm-border/40 px-4 py-4 sm:px-6">
//           <div className="min-w-0">
//             <p className="text-xs font-bold uppercase tracking-[0.14em] text-basil-600">
//               Menu management
//             </p>

//             <h2
//               id="pizza-modal-title"
//               className="mt-1 truncate text-lg font-semibold text-espresso"
//             >
//               {isEditMode ? "Edit pizza" : "Add pizza"}
//             </h2>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-warm-gray transition hover:bg-ivory hover:text-espresso"
//             aria-label="Close"
//           >
//             ×
//           </button>
//         </div>

//         {/* Scrollable form */}
//         <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
//           <AdminPizzaForm
//             mode={isEditMode ? "edit" : "create"}
//             pizza={pizza}
//             onSuccess={onClose}
//             onCancel={onClose}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminPizzaModal;

// import AdminPizzaForm from "./AdminPizzaForm";

// function AdminPizzaModal({ onClose, pizza = null }) {
//   const isEditMode = Boolean(pizza);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-end justify-center bg-espresso/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="pizza-modal-title"
//     >
//       <div className="flex max-h-[100dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-warm-border/60 bg-white shadow-xl sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-2xl">
//         {/* Header */}
//         <div className="flex shrink-0 items-center justify-between border-b border-warm-border/40 px-4 py-4 sm:px-6">
//           <div className="min-w-0">
//             <p className="text-xs font-bold uppercase tracking-[0.14em] text-basil-600">
//               Menu management
//             </p>

//             <h2
//               id="pizza-modal-title"
//               className="mt-1 truncate text-lg font-semibold text-espresso"
//             >
//               {isEditMode ? "Edit pizza" : "Add pizza"}
//             </h2>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-warm-gray transition hover:bg-ivory hover:text-espresso"
//             aria-label="Close"
//           >
//             ×
//           </button>
//         </div>

//         {/* Scrollable form */}
//         <div className="min-h-0 flex-1 overflow-y-auto">
//           <AdminPizzaForm
//             mode={isEditMode ? "edit" : "create"}
//             pizza={pizza}
//             onSuccess={onClose}
//             onCancel={onClose}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminPizzaModal;
