import { createBrowserRouter, RouterProvider } from "react-router";

import AppLayout from "./ui/AppLayout";

import About from "./ui/About";
import Menu from "./features/menu/Menu";
import { loader as menuLoader } from "./features/menu/menuLoader";
import Home from "./ui/Home";
import Error from "./ui/Error";
import Gallery from "./ui/Gallery";
import Cart from "./features/cart/Cart";
import Checkout from "./features/order/Checkout";
import OrderConfirmation from "./features/order/OrderConfirmation";

import StaffLogin from "./features/staff/StaffLogin";
import StaffLayout from "./features/staff/StaffLayout";
import StaffDashboard from "./features/staff/StaffDashboard";
import StaffOrders from "./features/staff/StaffOrders";
import StaffOrderDetails from "./features/staff/StaffOrderDetails";
import AdminLogin from "./features/admin/AdminLogin";
import AdminLayout from "./features/admin/AdminLayout";
import AdminDashboard from "./features/admin/dashboard/AdminDashboard";
import AdminOrders from "./features/admin/orders/AdminOrders";
import AdminOrderDetails from "./features/admin/orders/AdminOrderDetails";

import AdminSales from "./features/admin/sales/AdminSales";
import AdminPizzas from "./features/admin/pizzas/AdminPizzas";
import AdminUsers from "./features/admin/users/AdminUsers";
import StaffSetup from "./features/staff/StaffSetup";
import StaffResetPassword from "./features/staff/StaffResetPassword";
import AdminSettings from "./features/admin/settings/AdminSettings";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
        errorElement: <Error />,
      },
      {
        path: "/order/:orderId",
        element: <OrderConfirmation />,
        errorElement: <Error />,
      },
    ],
  },

  // Staff / Delivery login and account setup
  {
    path: "/staff/login",
    element: <StaffLogin />,
    errorElement: <Error />,
  },
  {
    path: "/staff/setup",
    element: <StaffSetup />,
  },
  {
    path: "/staff/reset-password",
    element: <StaffResetPassword />,
    errorElement: <Error />,
  },

  // Staff / Delivery application
  {
    element: <StaffLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/staff",
        element: <StaffDashboard />,
      },
      {
        path: "/staff/orders",
        element: <StaffOrders />,
      },
      {
        path: "/staff/orders/:orderId",
        element: <StaffOrderDetails />,
      },
    ],
  },

  // Admin login
  {
    path: "/admin/login",
    element: <AdminLogin />,
    errorElement: <Error />,
  },

  // Admin application
  {
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/orders",
        element: <AdminOrders />,
      },
      {
        path: "/admin/orders/:orderId",
        element: <AdminOrderDetails />,
      },
      {
        path: "/admin/sales",
        element: <AdminSales />,
      },
      {
        path: "/admin/pizzas",
        element: <AdminPizzas />,
      },
      {
        path: "/admin/users",
        element: <AdminUsers />,
      },
      {
        path: "/admin/settings",
        element: <AdminSettings />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

// import { createBrowserRouter, RouterProvider } from "react-router";
// import AppLayout from "./ui/AppLayout";

// import About from "./ui/About";
// import Menu, { loader as menuLoader } from "./features/menu/Menu";
// import Home from "./ui/Home";
// import Error from "./ui/Error";
// import Gallery from "./ui/Gallery";
// import Cart from "./features/cart/Cart";
// import Checkout from "./features/order/Checkout";
// import OrderConfirmation from "./features/order/OrderConfirmation";
// import StaffLogin from "./features/staff/StaffLogin";
// import StaffLayout from "./features/staff/StaffLayout";
// import StaffDashboard from "./features/staff/StaffDashboard";
// import StaffOrders from "./features/staff/StaffOrders";

// const router = createBrowserRouter([
//   {
//     element: <AppLayout />,
//     errorElement: <Error />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/menu",
//         element: <Menu />,
//         loader: menuLoader,
//       },
//       {
//         path: "/about",
//         element: <About />,
//       },
//       {
//         path: "/gallery",
//         element: <Gallery />,
//       },
//       {
//         path: "/cart",
//         element: <Cart />,
//       },
//       {
//         path: "/checkout",
//         element: <Checkout />,
//         errorElement: <Error />,
//       },
//       {
//         path: "/order/:orderId",
//         element: <OrderConfirmation />,
//         errorElement: <Error />,
//       },
//     ],
//   },

//   {
//     element: <StaffLayout />,
//     errorElement: <Error />,
//     children: [
//       {
//         path: "/staff/login",
//         element: <StaffLogin />,
//       },
//       {
//         path: "/staff",
//         element: <StaffDashboard />,
//       },
//       {
//         path: "/staff/orders",
//         element: <StaffOrders />,
//       },
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;
