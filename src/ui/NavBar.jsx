import { NavLink } from "react-router";

const navLinks = [
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
];

function NavBar() {
  return (
    <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider sm:gap-6 sm:text-base">
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `relative py-1 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-tomato-500 after:transition-all after:duration-300 md:text-xl ${
              isActive
                ? "text-tomato-600 after:w-full"
                : "text-basil-600 hover:text-tomato-600 hover:after:w-full"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default NavBar;

// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import { NavLink } from "react-router";
// const navLinks = [
//   { to: "/menu", label: "Menu" },
//   { to: "/about", label: "About" },
//   { to: "/gallery", label: "Gallery" },
// ];
// function NavBar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const linkStyles = ({ isActive }) =>
//     `relative py-1 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-tomato-500 after:transition-all after:duration-300 md:text-xl ${isActive ? "text-tomato-600 after:w-full" : "text-basil-600 hover:text-tomato-600 hover:after:w-full"}`;
//   return (
//     <nav className="relative">
//       {" "}
//       {/* Desktop navigation */}{" "}
//       <div className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-wider md:flex">
//         {" "}
//         {navLinks.map((link) => (
//           <NavLink key={link.to} to={link.to} className={linkStyles}>
//             {" "}
//             {link.label}{" "}
//           </NavLink>
//         ))}{" "}
//       </div>{" "}
//       {/* Mobile navigation */}{" "}
//       <div className="md:hidden">
//         {" "}
//         {/* Hamburger button */}{" "}
//         <button
//           type="button"
//           onClick={() => setIsOpen((open) => !open)}
//           className="text-basil-600 transition-colors hover:text-tomato-600"
//           aria-label={isOpen ? "Close navigation" : "Open navigation"}
//         >
//           {" "}
//           {isOpen ? (
//             <X size={28} strokeWidth={1.8} />
//           ) : (
//             <Menu size={28} strokeWidth={1.8} />
//           )}{" "}
//         </button>{" "}
//         {/* Links */}{" "}
//         {isOpen && (
//           <div className="absolute right-0 top-10 flex items-center gap-4 whitespace-nowrap rounded-lg bg-cream-50 px-4 py-3 shadow-md">
//             {" "}
//             {navLinks.map((link) => (
//               <NavLink
//                 key={link.to}
//                 to={link.to}
//                 className={linkStyles}
//                 onClick={() => setIsOpen(false)}
//               >
//                 {" "}
//                 {link.label}{" "}
//               </NavLink>
//             ))}{" "}
//           </div>
//         )}{" "}
//       </div>{" "}
//     </nav>
//   );
// }
// export default NavBar;

// export default NavBar;

// <nav>
//   <Link to="/menu">Menu</Link>
//   <Link to="/about">Visit us</Link>
// </nav>
