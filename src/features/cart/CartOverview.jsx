import { ShoppingCart, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

function CartOverview() {
  const cart = useSelector((state) => state.cart.cart);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  if (!cart.length) return null;

  return (
    <div className="sticky top-0 z-40 border-b border-basil-500/10 bg-cream/95 shadow-sm backdrop-blur-[1px]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3 sm:px-8 lg:px-10">
        {/* Cart summary */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-basil-500/10 text-basil-600">
            <ShoppingCart size={18} strokeWidth={2} />
          </div>
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <span className="font-semibold text-espresso">
              {totalQuantity} {totalQuantity === 1 ? "pizza" : "pizzas"}
            </span>
            <span className="text-muted">·</span>
            <span className="font-bold text-tomato-600">
              €{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
        {/* View cart */}
        <Link
          to="/cart"
          className="flex shrink-0 items-center gap-2 rounded-full bg-basil-500 px-4 py-2 text-sm font-semibold text-cream shadow-sm shadow-basil-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-basil-600 hover:shadow-md"
        >
          <span>View cart</span> <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

export default CartOverview;
