import { useSelector } from "react-redux";
import UpdateItemQuantity from "./UpdateItemQuantity";
import DeleteItem from "./DeleteItem";
import { formatCurrency } from "../../utils/helpers";

function CartItem({ pizzaId }) {
  const item = useSelector((state) =>
    state.cart.cart.find((item) => item.pizzaId === pizzaId),
  );

  if (!item) return null;

  const { name, quantity, unitPrice, totalPrice } = item;
  console.log("unitPrice:", unitPrice);
  console.log("formatted:", formatCurrency(unitPrice));

  return (
    <li className="flex items-center gap-4 border-b border-basil-500/10 py-5">
      {/* Pizza information */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-espresso sm:text-lg">
          {name}
        </h3>

        <p className="mt-1 text-sm text-muted">
          {formatCurrency(unitPrice)} × {quantity}
        </p>
      </div>

      {/* Quantity controls */}
      <UpdateItemQuantity pizzaId={pizzaId} currentQuantity={quantity} />

      {/* Total price */}
      <span className="w-20 text-right text-sm font-bold text-tomato-600 sm:text-base">
        {formatCurrency(totalPrice)}
      </span>

      {/* Delete */}
      <DeleteItem pizzaId={pizzaId} />
    </li>
  );
}

export default CartItem;
//unitPrice.toFixed(2)
