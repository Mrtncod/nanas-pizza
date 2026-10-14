import { Link } from "react-router";
import NavBar from "./NavBar";
//bg-gradient-to-r from-ivory via-cream to-[#f8f1e7]
function Header() {
  return (
    <header className="bg-basil-500/5 relative z-10 flex w-full shrink-0 items-center justify-between gap-4 border-b border-warm-border/70 px-4 py-2.5 shadow-[0_2px_12px_rgba(43,37,32,0.04)] sm:px-8 lg:px-20 lg:py-4">
      {/* Subtle golden highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-golden-600/30 to-transparent"
      />

      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(230,173,67,0.08),transparent_55%)]"
      />

      {/* Logo */}

      <Link
        to="/"
        aria-label="Nanna's Pizza home"
        className="relative z-10 shrink-0 leading-none transition-transform duration-200 hover:scale-[1.02]"
      >
        <h1 className="flex flex-col font-bold text-2xl leading-[0.85] tracking-tight lg:text-3xl">
          <span className=" font-bold text-tomato-500 ">Nana's</span>

          <span className="mt-1 font-semibold italic text-basil-500">
            Pizza
          </span>
        </h1>
      </Link>

      {/* Navigation */}
      <div className="relative z-10">
        <NavBar />
      </div>
    </header>
  );
}

export default Header;

// import { Link } from "react-router";
// import NavBar from "./NavBar";

// function Header() {
//   return (
//     <header className="flex items-center justify-between border-b border-warm-border bg-cream px-6 py-5 shadow-sm sm:px-10 lg:px-16">
//       <Link
//         to="/"
//         className="group leading-none transition-transform duration-200 hover:scale-[1.02]"
//       >
//         <img
//           src="/images/nanas-pizza-nana-logo_1.jpg"
//           alt="Nanna's Pizza"
//           className="h-22 w-32 object-contain"
//         />
//         {/* <h1 className=" text-4xl font-semibold  tracking-tight text-tomato-500 sm:text-4xl">
//           <strong className="font-bold">Nanna's</strong>
//           <br />
//           <span className="ml-5 text-basil-600">Pizza</span>
//         </h1> */}
//       </Link>

//       <NavBar />
//     </header>
//   );
// }

// function Header() {
//   return (
//     <header className="border-warm-border bg-cream border-b">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="group leading-none transition-transform duration-200 hover:scale-[1.02]"
//         >
//           <h1 className="font-serif text-3xl tracking-tight text-tomato-600 sm:text-4xl">
//             <strong className="font-bold">Nanna's</strong>
//             <br />
//             <span className="ml-5 text-espresso">Pizza</span>
//           </h1>
//         </Link>

//         {/* Navigation */}
//         <NavBar />
//       </div>
//     </header>
//   );
// }
