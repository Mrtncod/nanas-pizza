import { useDispatch, useSelector } from "react-redux";
import { addItem, getCurrentQuantityById } from "../cart/cartSlice";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";
import DeleteItem from "../cart/DeleteItem";
import { formatCurrency } from "../../utils/helpers";

function MenuItem({ pizza }) {
  const dispatch = useDispatch();

  const { id, name, description, ingredients, price, image_url, sold_out } =
    pizza;

  const currentQuantity = useSelector(getCurrentQuantityById(id));

  const isInCart = currentQuantity > 0;

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice: price,
      totalPrice: price,
    };

    dispatch(addItem(newItem));
  }

  return (
    <li className="py-6 sm:py-8">
      <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-7 md:grid-cols-[200px_1fr]">
        {/* Pizza image */}
        <div className="relative overflow-hidden rounded-2xl bg-cream shadow-sm">
          <img
            src={image_url}
            alt={name}
            className={`aspect-square w-full object-cover transition-transform duration-500 hover:scale-105 ${
              sold_out ? "opacity-50 grayscale" : ""
            }`}
          />

          {sold_out && (
            <span className="absolute left-3 top-3 rounded-full bg-espresso/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cream">
              Sold out
            </span>
          )}
        </div>

        {/* Pizza information */}
        <div className="flex min-w-0 flex-col">
          {/* Name + price */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-espresso sm:text-2xl">
              {name}
            </h3>

            <div className="flex shrink-0 flex-col items-end">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Price
              </span>

              <span className="mt-0.5 text-lg font-bold text-tomato-600 sm:text-xl">
                {formatCurrency(price)}
              </span>
            </div>
          </div>

          {/* Ingredients */}
          <p className="mt-2 text-sm font-medium capitalize text-basil-600">
            {ingredients}
          </p>

          {/* Description */}
          <p className="mt-3 max-w-2xl text-sm leading-6 text-warm-gray sm:text-base">
            {description}
          </p>

          {/* Action */}
          <div className="mt-5 flex items-center gap-4">
            {!sold_out && !isInCart && (
              <button
                type="button"
                onClick={handleAddToCart}
                className="rounded-full bg-basil-500 px-5 py-2.5 text-sm font-semibold text-cream shadow-sm shadow-basil-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-basil-600 hover:shadow-md"
              >
                Add to order
              </button>
            )}

            {!sold_out && isInCart && (
              <>
                <UpdateItemQuantity
                  pizzaId={id}
                  currentQuantity={currentQuantity}
                />

                <DeleteItem pizzaId={id} />
              </>
            )}

            {sold_out && (
              <span className="text-sm font-semibold uppercase tracking-wider text-muted">
                Sold out
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default MenuItem;

// import { useDispatch, useSelector } from "react-redux";
// import { addItem, getCurrentQuantityById } from "../cart/cartSlice";
// import UpdateItemQuantity from "../cart/UpdateItemQuantity";
// import DeleteItem from "../cart/DeleteItem";
// import { formatCurrency } from "../../utils/helpers";

// function MenuItem({ pizza }) {
//   const cart = useSelector((state) => state.cart.cart);
//   const dispatch = useDispatch();
//   const { id, name, description, ingredients, price, image_url, sold_out } =
//     pizza;

//   const currentQuantity = useSelector(getCurrentQuantityById(id));

//   const isInCart = currentQuantity > 0;

//   function handleAddToCart() {
//     const newItem = {
//       pizzaId: id,
//       name,
//       quantity: 1,
//       unitPrice: price,
//       totalPrice: price,
//     };

//     dispatch(addItem(newItem));
//   }

//   // console.log("Cart:", cart);
//   // console.log("Current quantity:", currentQuantity);

//   return (
//     <li className="py-6 sm:py-8">
//       <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-7 md:grid-cols-[200px_1fr]">
//         {/* Pizza image */}
//         <div className="relative overflow-hidden rounded-2xl bg-cream shadow-sm">
//           <img
//             src={image_url}
//             alt={name}
//             className={`aspect-square w-full object-cover transition-transform duration-500 hover:scale-105 ${
//               sold_out ? "opacity-50 grayscale" : ""
//             }`}
//           />

//           {sold_out && (
//             <span className="absolute left-3 top-3 rounded-full bg-espresso/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cream">
//               Sold out
//             </span>
//           )}
//         </div>

//         {/* Pizza information */}
//         <div className="flex min-w-0 flex-col">
//           {/* Name + price */}
//           <div className="flex items-start justify-between gap-4">
//             <h3 className="text-xl font-bold text-espresso sm:text-2xl">
//               {name}
//             </h3>
//             <div className="flex shrink-0 flex-col items-end">
//               <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
//                 Price
//               </span>

//               <span className="mt-0.5 text-lg font-bold text-tomato-600 sm:text-xl">
//                 {formatCurrency(price)}
//               </span>
//             </div>
//           </div>

//           {/* Ingredients */}
//           <p className="mt-2 text-sm font-medium capitalize text-basil-600">
//             {ingredients}
//           </p>

//           {/* Description */}
//           <p className="mt-3 max-w-2xl text-sm leading-6 text-warm-gray sm:text-base">
//             {description}
//           </p>

//           {/* Action */}
//           <div className="mt-5 flex items-center gap-4">
//             {!sold_out && !isInCart && (
//               <button
//                 type="button"
//                 onClick={handleAddToCart}
//                 className="rounded-full bg-basil-500 px-5 py-2.5 text-sm font-semibold text-cream shadow-sm shadow-basil-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-basil-600 hover:shadow-md"
//               >
//                 Add to order
//               </button>
//             )}

//             {!sold_out && isInCart && (
//               <>
//                 <UpdateItemQuantity
//                   pizzaId={id}
//                   currentQuantity={currentQuantity}
//                 />

//                 <DeleteItem pizzaId={id} />
//               </>
//             )}

//             {sold_out && (
//               <span className="text-sm font-semibold uppercase tracking-wider text-muted">
//                 Sold out
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </li>
//   );
// }

// export default MenuItem;
