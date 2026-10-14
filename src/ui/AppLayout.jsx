import { Outlet, useLocation, useNavigation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";
import CartOverview from "../features/cart/CartOverview";

function AppLayout() {
  const location = useLocation();
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";
  const isCartPage = location.pathname === "/cart";
  const isOrderPage = location.pathname.startsWith("/order");

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <Header />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        {!isCartPage && !isOrderPage && <CartOverview />}

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          {isLoading && <Loader />}
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default AppLayout;

// import { Outlet, useLocation, useNavigation } from "react-router";
// import Header from "./Header";
// import Footer from "./Footer";
// import Loader from "./Loader";
// import CartOverview from "../features/cart/CartOverview";

// function AppLayout() {
//   const location = useLocation();
//   const navigation = useNavigation();
//   const isLoading = navigation.state === "loading";
//   const isCartPage = location.pathname === "/cart";
//   const isOrderPage = location.pathname.startsWith("/order");

//   return (
//     <div className="grid h-screen grid-rows-[auto_1fr_auto]">
//       <Header />

//       <div className="min-h-0 overflow-y-auto">
//         {!isCartPage && !isOrderPage && <CartOverview />}
//         <main className="mx-auto  w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
//           {isLoading && <Loader />}
//           <Outlet />
//         </main>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default AppLayout;

//   return (
//     <div className="flex min-h-screen flex-col">
//       <Header />

//       <div className="flex flex-1 flex-col">
//         {!isCartPage && !isOrderPage && <CartOverview />}

//         <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
//           {isLoading && <Loader />}
//           <Outlet />
//         </main>
//       </div>

//       <Footer />
//     </div>
//   );
// }
