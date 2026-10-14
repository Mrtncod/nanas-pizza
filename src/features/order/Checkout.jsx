import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { createOrderAndCompletePayment } from "../../services/orderService";
import { clearCart } from "../cart/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart.cart);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    const customer = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      notes: data.notes,
    };

    const items = cart.map((item) => ({
      pizzaId: item.pizzaId,
      quantity: item.quantity,
    }));

    try {
      const { orderId } = await createOrderAndCompletePayment({
        customer,
        items,
      });

      dispatch(clearCart());
      navigate(`/order/${orderId}`);
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  }

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-2xl py-10 text-center">
        <h1 className="text-3xl font-bold text-espresso">Your cart is empty</h1>

        <p className="mt-3 text-warm-gray">
          Add some delicious pizzas before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-espresso sm:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-warm-gray">
          Enter your details and delivery information.
        </p>
      </div>

      {/* Checkout form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl bg-white/40 px-5 py-7 shadow-sm ring-1 ring-basil-500/5 sm:px-8 sm:py-9"
      >
        {/* Contact information */}
        <section>
          <h2 className="text-xl font-bold text-espresso">
            Contact information
          </h2>

          <p className="mt-1 text-sm text-muted">How can we reach you?</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="text-sm font-semibold text-espresso"
              >
                Full name
              </label>

              <input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                {...register("fullName", {
                  required: "Please enter your full name",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
              />

              {errors.fullName && (
                <p className="mt-1.5 text-xs font-medium text-tomato-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-espresso"
              >
                Phone
              </label>

              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Your phone number"
                {...register("phone", {
                  required: "Please enter your phone number",
                  minLength: {
                    value: 7,
                    message: "Please enter a valid phone number",
                  },
                })}
                className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
              />

              {errors.phone && (
                <p className="mt-1.5 text-xs font-medium text-tomato-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-espresso"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Please enter your email address",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
              />

              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-tomato-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Delivery information */}
        <section className="mt-10 border-t border-basil-500/10 pt-8">
          <h2 className="text-xl font-bold text-espresso">
            Delivery information
          </h2>

          <p className="mt-1 text-sm text-muted">
            Where should we bring your order?
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {/* Street address */}
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-semibold text-espresso"
              >
                Street address
              </label>

              <input
                id="address"
                type="text"
                autoComplete="street-address"
                placeholder="Street and house number"
                {...register("address", {
                  required: "Please enter your street address",
                })}
                className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
              />

              {errors.address && (
                <p className="mt-1.5 text-xs font-medium text-tomato-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="text-sm font-semibold text-espresso"
              >
                City
              </label>

              <input
                id="city"
                type="text"
                autoComplete="address-level2"
                placeholder="City"
                {...register("city", {
                  required: "Please enter your city",
                })}
                className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
              />

              {errors.city && (
                <p className="mt-1.5 text-xs font-medium text-tomato-600">
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* Postal code */}
            <div>
              <label
                htmlFor="postalCode"
                className="text-sm font-semibold text-espresso"
              >
                Postal code
              </label>

              <input
                id="postalCode"
                type="text"
                autoComplete="postal-code"
                placeholder="Postal code"
                {...register("postalCode", {
                  required: "Please enter your postal code",
                })}
                className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
              />

              {errors.postalCode && (
                <p className="mt-1.5 text-xs font-medium text-tomato-600">
                  {errors.postalCode.message}
                </p>
              )}
            </div>

            {/* Delivery notes */}
            <div className="sm:col-span-2">
              <label
                htmlFor="notes"
                className="text-sm font-semibold text-espresso"
              >
                Delivery notes{" "}
                <span className="font-normal text-muted">(optional)</span>
              </label>

              <textarea
                id="notes"
                rows="4"
                placeholder="Apartment number, doorbell, special instructions..."
                {...register("notes")}
                className="mt-2 w-full resize-none rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
              />
            </div>
          </div>
        </section>

        {/* Continue */}
        <div className="mt-10 border-t border-basil-500/10 pt-7">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-basil-500 px-6 py-3.5 text-sm font-semibold text-cream shadow-sm shadow-basil-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-basil-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Processing order..." : "Continue to payment"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;

// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { supabase } from "../../services/supabase";
// import { useNavigate } from "react-router";
// import { clearCart } from "../cart/cartSlice";

// function Checkout() {
//   const dispatch = useDispatch();
//   const cart = useSelector((state) => state.cart.cart);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const navigate = useNavigate();

//   async function onSubmit(data) {
//     // ==========================================
//     // 1. Create the order
//     // ==========================================

//     const orderRequest = {
//       customer: {
//         fullName: data.fullName,
//         email: data.email,
//         phone: data.phone,
//         address: data.address,
//         city: data.city,
//         postalCode: data.postalCode,
//         notes: data.notes,
//       },

//       items: cart.map((item) => ({
//         pizzaId: item.pizzaId,
//         quantity: item.quantity,
//       })),
//     };

//     const { data: response, error } = await supabase.functions.invoke(
//       "clever-task",
//       {
//         body: orderRequest,
//       },
//     );

//     if (error) {
//       console.error("Order request failed:", error);

//       if (error.context) {
//         try {
//           const errorBody = await error.context.json();
//           console.error("Edge Function error body:", errorBody);
//         } catch {
//           console.error("Could not read Edge Function error body.");
//         }
//       }

//       return;
//     }

//     // ==========================================
//     // 2. Make sure order creation succeeded
//     // ==========================================

//     if (!response?.success || !response.orderId || !response.orderAccessToken) {
//       console.error("Unexpected order response:", response);
//       return;
//     }

//     const { orderId, orderAccessToken } = response;

//     // Keep the secret token in this browser session.
//     sessionStorage.setItem(`nannas-pizza-order-${orderId}`, orderAccessToken);

//     console.log("Order created successfully:", {
//       orderId,
//       totalPrice: response.totalPrice,
//       itemCount: response.itemCount,
//     });

//     // ==========================================
//     // 3. Complete simulated payment
//     // ==========================================

//     const { data: paymentResponse, error: paymentError } =
//       await supabase.functions.invoke("complete-fake-payment", {
//         body: {
//           orderId,
//           orderAccessToken,
//         },
//       });

//     if (paymentError) {
//       console.error("Payment request failed:", paymentError);

//       if (paymentError.context) {
//         try {
//           const errorBody = await paymentError.context.json();
//           console.error("Payment Edge Function error body:", errorBody);
//         } catch {
//           console.error("Could not read payment error body.");
//         }
//       }

//       return;
//     }

//     // ==========================================
//     // 4. Check payment result
//     // ==========================================

//     if (paymentResponse?.success && paymentResponse.paymentStatus === "paid") {
//       dispatch(clearCart());

//       // We'll redirect to the confirmation page here next.
//       navigate(`/order/${orderId}`);
//       /////
//     } else {
//       console.error("Unexpected payment response:", paymentResponse);
//     }
//   }

//   if (!cart.length) {
//     return (
//       <div className="mx-auto max-w-2xl py-10 text-center">
//         <h1 className="text-3xl font-bold text-espresso">Your cart is empty</h1>

//         <p className="mt-3 text-warm-gray">
//           Add some delicious pizzas before checking out.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-3xl">
//       {/* Heading */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-espresso sm:text-4xl">
//           Checkout
//         </h1>

//         <p className="mt-2 text-sm text-warm-gray">
//           Enter your details and delivery information.
//         </p>
//       </div>

//       {/* Checkout form */}
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="rounded-3xl bg-white/40 px-5 py-7 shadow-sm ring-1 ring-basil-500/5 sm:px-8 sm:py-9"
//       >
//         {/* Contact information */}
//         <section>
//           <h2 className="text-xl font-bold text-espresso">
//             Contact information
//           </h2>

//           <p className="mt-1 text-sm text-muted">How can we reach you?</p>

//           <div className="mt-6 grid gap-5 sm:grid-cols-2">
//             {/* Full name */}
//             <div>
//               <label
//                 htmlFor="fullName"
//                 className="text-sm font-semibold text-espresso"
//               >
//                 Full name
//               </label>

//               <input
//                 id="fullName"
//                 type="text"
//                 autoComplete="name"
//                 placeholder="Your full name"
//                 {...register("fullName", {
//                   required: "Please enter your full name",
//                   minLength: {
//                     value: 2,
//                     message: "Name must be at least 2 characters",
//                   },
//                 })}
//                 className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
//               />

//               {errors.fullName && (
//                 <p className="mt-1.5 text-xs font-medium text-tomato-600">
//                   {errors.fullName.message}
//                 </p>
//               )}
//             </div>

//             {/* Phone */}
//             <div>
//               <label
//                 htmlFor="phone"
//                 className="text-sm font-semibold text-espresso"
//               >
//                 Phone
//               </label>

//               <input
//                 id="phone"
//                 type="tel"
//                 autoComplete="tel"
//                 placeholder="Your phone number"
//                 {...register("phone", {
//                   required: "Please enter your phone number",
//                   minLength: {
//                     value: 7,
//                     message: "Please enter a valid phone number",
//                   },
//                 })}
//                 className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
//               />

//               {errors.phone && (
//                 <p className="mt-1.5 text-xs font-medium text-tomato-600">
//                   {errors.phone.message}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div className="sm:col-span-2">
//               <label
//                 htmlFor="email"
//                 className="text-sm font-semibold text-espresso"
//               >
//                 Email
//               </label>

//               <input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder="you@example.com"
//                 {...register("email", {
//                   required: "Please enter your email address",
//                   pattern: {
//                     value: /^\S+@\S+\.\S+$/,
//                     message: "Please enter a valid email address",
//                   },
//                 })}
//                 className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
//               />

//               {errors.email && (
//                 <p className="mt-1.5 text-xs font-medium text-tomato-600">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Delivery information */}
//         <section className="mt-10 border-t border-basil-500/10 pt-8">
//           <h2 className="text-xl font-bold text-espresso">
//             Delivery information
//           </h2>

//           <p className="mt-1 text-sm text-muted">
//             Where should we bring your order?
//           </p>

//           <div className="mt-6 grid gap-5 sm:grid-cols-2">
//             {/* Street address */}
//             <div className="sm:col-span-2">
//               <label
//                 htmlFor="address"
//                 className="text-sm font-semibold text-espresso"
//               >
//                 Street address
//               </label>

//               <input
//                 id="address"
//                 type="text"
//                 autoComplete="street-address"
//                 placeholder="Street and house number"
//                 {...register("address", {
//                   required: "Please enter your street address",
//                 })}
//                 className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
//               />

//               {errors.address && (
//                 <p className="mt-1.5 text-xs font-medium text-tomato-600">
//                   {errors.address.message}
//                 </p>
//               )}
//             </div>

//             {/* City */}
//             <div>
//               <label
//                 htmlFor="city"
//                 className="text-sm font-semibold text-espresso"
//               >
//                 City
//               </label>

//               <input
//                 id="city"
//                 type="text"
//                 autoComplete="address-level2"
//                 placeholder="City"
//                 {...register("city", {
//                   required: "Please enter your city",
//                 })}
//                 className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
//               />

//               {errors.city && (
//                 <p className="mt-1.5 text-xs font-medium text-tomato-600">
//                   {errors.city.message}
//                 </p>
//               )}
//             </div>

//             {/* Postal code */}
//             <div>
//               <label
//                 htmlFor="postalCode"
//                 className="text-sm font-semibold text-espresso"
//               >
//                 Postal code
//               </label>

//               <input
//                 id="postalCode"
//                 type="text"
//                 autoComplete="postal-code"
//                 placeholder="Postal code"
//                 {...register("postalCode", {
//                   required: "Please enter your postal code",
//                 })}
//                 className="mt-2 w-full rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
//               />

//               {errors.postalCode && (
//                 <p className="mt-1.5 text-xs font-medium text-tomato-600">
//                   {errors.postalCode.message}
//                 </p>
//               )}
//             </div>

//             {/* Delivery notes */}
//             <div className="sm:col-span-2">
//               <label
//                 htmlFor="notes"
//                 className="text-sm font-semibold text-espresso"
//               >
//                 Delivery notes{" "}
//                 <span className="font-normal text-muted">(optional)</span>
//               </label>

//               <textarea
//                 id="notes"
//                 rows="4"
//                 placeholder="Apartment number, doorbell, special instructions..."
//                 {...register("notes")}
//                 className="mt-2 w-full resize-none rounded-xl bg-cream px-4 py-3 text-sm text-espresso shadow-sm outline-none ring-1 ring-basil-500/10 transition focus:ring-2 focus:ring-basil-500/30"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Continue */}
//         <div className="mt-10 border-t border-basil-500/10 pt-7">
//           <button
//             type="submit"
//             className="w-full rounded-full bg-basil-500 px-6 py-3.5 text-sm font-semibold text-cream shadow-sm shadow-basil-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-basil-600 hover:shadow-md"
//           >
//             Continue to payment
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Checkout;
