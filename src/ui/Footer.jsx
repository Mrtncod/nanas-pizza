import { Link } from "react-router";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="w-full border-t border-basil-600/10 bg-basil-500/5">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between sm:gap-6 sm:px-8 sm:py-3 lg:px-6">
        {/* Brand */}
        <div className="text-center sm:text-left">
          <Link
            to="/"
            className="text-sm font-bold text-basil-600 transition-colors hover:text-tomato-500 sm:text-base lg:text-sm"
          >
            Nanna’s Pizza
          </Link>

          <p className="mt-0.5 text-[10px] text-warm-gray sm:text-xs">
            Handmade with tradition
          </p>
        </div>

        {/* Contact */}
        <div className="text-center sm:text-left">
          <h2 className="text-xs font-semibold text-basil-600">Contact us</h2>

          <div className="mt-1 flex flex-col gap-0.5 text-[10px] text-warm-gray sm:text-xs">
            <a
              href="mailto:hello@nannaspizza.com"
              className="transition-colors hover:text-tomato-500"
            >
              hello@nannaspizza.com
            </a>

            <a
              href="tel:+491234567890"
              className="  transition-colors hover:text-tomato-500 lg:text-[10px]"
            >
              +49 123 4567890
            </a>
          </div>
        </div>

        {/* Social links */}
        <nav aria-label="Follow us" className="flex items-center gap-4">
          <a
            href="#"
            aria-label="Instagram"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/80 text-basil-600 transition-colors hover:bg-basil-500/10 hover:text-tomato-500 sm:h-9 sm:w-9"
          >
            <FaInstagram size={16} />
          </a>

          <a
            href="#"
            aria-label="Facebook"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/80 text-basil-600 transition-colors hover:bg-basil-500/10 hover:text-tomato-500 sm:h-9 sm:w-9"
          >
            <FaFacebookF size={15} />
          </a>

          <a
            href="#"
            aria-label="X"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/80 text-basil-600 transition-colors hover:bg-basil-500/10 hover:text-tomato-500 sm:h-9 sm:w-9"
          >
            <FaXTwitter size={15} />
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-center text-[10px] text-warm-gray sm:text-right sm:text-xs">
          © 2026 Nanna’s Pizza. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

// import { Link } from "react-router";
// import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
// // shrink-0
// function Footer() {
//   return (
//     <footer className="w-full  border-t border-basil-600/10 bg-basil-500/5">
//       <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 py-2 sm:flex-row sm:justify-between sm:gap-8 sm:px-8 sm:py-3 lg:gap-12 lg:px-6 lg:py-1">
//         {/* Brand */}
//         <div className="text-center sm:text-left">
//           <Link
//             to="/"
//             className="text-sm font-bold text-basil-600 transition-colors hover:text-tomato-500 sm:text-base lg:text-sm"
//           >
//             Nanna’s Pizza
//           </Link>

//           <p className="mt-0.5 text-[10px] text-warm-gray sm:text-xs">
//             Handmade with tradition
//           </p>
//         </div>

//         {/* Social links */}
//         <nav aria-label="Follow us" className="flex items-center gap-7">
//           <a
//             href="#"
//             aria-label="Instagram"
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/80 text-basil-600 transition-colors hover:bg-basil-500/10 hover:text-tomato-500 sm:h-9 sm:w-9 lg:h-7"
//           >
//             <FaInstagram size={16} />
//           </a>

//           <a
//             href="#"
//             aria-label="Facebook"
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/80 text-basil-600 transition-colors hover:bg-basil-500/10 hover:text-tomato-500 sm:h-9 sm:w-9 lg:h-7"
//           >
//             <FaFacebookF size={15} />
//           </a>

//           <a
//             href="#"
//             aria-label="X"
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/80 text-basil-600 transition-colors hover:bg-basil-500/10 hover:text-tomato-500 sm:h-9 sm:w-9 lg:h-7"
//           >
//             <FaXTwitter size={15} />
//           </a>
//         </nav>

//         {/* Copyright */}
//         <p className="text-center text-[10px] text-warm-gray sm:text-right sm:text-xs">
//           © 2026 Nanna’s Pizza. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
