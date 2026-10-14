import { useSelector } from "react-redux";
import { Link } from "react-router";
import CartItem from "./CartItem";

function Cart() {
  const cart = useSelector((state) => state.cart.cart);

  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-3xl py-10 text-center">
        <h1 className="text-3xl font-bold text-espresso">Your cart is empty</h1>

        <p className="mt-3 text-warm-gray">
          Looks like you haven't added any pizzas yet.
        </p>

        <Link
          to="/menu"
          className="mt-6 inline-flex rounded-full bg-basil-500 px-5 py-2.5 text-sm font-semibold text-cream shadow-sm shadow-basil-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-basil-600 hover:shadow-md"
        >
          Browse our pizzas
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-espresso sm:text-4xl">
          Your Order
        </h1>

        <p className="mt-2 text-sm text-warm-gray">
          Review your pizzas before checking out.
        </p>
      </div>

      {/* Cart items */}
      <ul>
        {cart.map((item) => (
          <CartItem key={item.pizzaId} pizzaId={item.pizzaId} />
        ))}
      </ul>

      {/* Total */}
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-basil-500/5 px-5 py-4">
        <span className="text-base font-semibold text-espresso">Total</span>

        <span className="text-xl font-bold text-tomato-600">
          €{totalPrice.toFixed(2)}
        </span>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <Link
          to="/menu"
          className="text-sm font-semibold text-basil-600 transition-colors hover:text-basil-700"
        >
          ← Continue shopping
        </Link>

        <Link
          to="/checkout"
          className="rounded-full bg-basil-500 px-6 py-3 text-sm font-semibold text-cream shadow-sm shadow-basil-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-basil-600 hover:shadow-md"
        >
          Go to checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;
