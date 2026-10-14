import { Minus, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { decreaseItem, increaseItem } from "./cartSlice";

function UpdateItemQuantity({ pizzaId, currentQuantity }) {
  const dispatch = useDispatch();

  function handleDecrease() {
    dispatch(decreaseItem(pizzaId));
  }

  function handleIncrease() {
    dispatch(increaseItem(pizzaId));
  }

  return (
    <div className="flex items-center gap-2">
      {/* Decrease */}
      <button
        type="button"
        onClick={handleDecrease}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-basil-500/30 text-basil-600 transition-all duration-200 hover:bg-basil-500 hover:text-cream"
        aria-label="Decrease quantity"
      >
        <Minus size={15} strokeWidth={2.5} />
      </button>

      {/* Quantity */}
      <span className="min-w-6 text-center text-sm font-bold text-espresso">
        {currentQuantity}
      </span>

      {/* Increase */}
      <button
        type="button"
        onClick={handleIncrease}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-basil-500/30 text-basil-600 transition-all duration-200 hover:bg-basil-500 hover:text-cream"
        aria-label="Increase quantity"
      >
        <Plus size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default UpdateItemQuantity;
