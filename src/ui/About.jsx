import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { MessageCircle, Phone } from "lucide-react";

function About() {
  return (
    <section className="w-full   ">
      {/* Introduction */}
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-golden-600">
          Our story started a long time ago
        </span>

        {/* Heading with background image */}
        {/* <div className="relative isolate mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl border border-warm-border/50 shadow-sm sm:rounded-3xl"> */}
        <div className="relative isolate mx-auto w-full max-w-7xl overflow-hidden  shadow-[0_8px_30px_rgba(43,37,32,0.08)] ">
          {/* Background image */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[url('/images/about.img.jpg')] bg-cover bg-center"
          />
          {/* Soft image overlay */}

          {/* Soft image overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-ivory/35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-cream/75 via-cream/55 to-ivory/85"
          />
          {/* Heading */}
          <h1 className="px-4 py-5 text-2xl font-bold leading-tight tracking-tight text-espresso sm:px-6 sm:py-7 sm:text-3xl md:px-6 md:py-9 md:text-4xl lg:py-9 xl:py-13">
            Come visit us and taste the authentic flavor
          </h1>
        </div>

        {/* <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-espresso sm:text-4xl md:text-5xl">
          Come visit us and taste the authentic flavor
        </h1> */}
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-warm-gray sm:text-lg">
          Good food, warm hospitality, and a place where friends and family can
          slow down, enjoy a meal, and feel at home.
        </p>
      </div>

      {/* Main content */}
      <div className="grid gap-12 md:grid-cols-3 md:gap-10">
        {/* Reservation */}
        <div className="relative">
          <div className="relative pt-1">
            <h2 className="text-xl font-bold text-espresso">
              Make a reservation
            </h2>
            <p className="mt-4 leading-7 text-warm-gray">
              Simply call or text us. We are always happy to reserve a table and
              make sure everything is ready for your visit.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="tel:+491234567890"
                aria-label="Call us"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-tomato-400/10 text-tomato-600 transition-all duration-200 hover:-translate-y-1 hover:bg-tomato-400/20"
              >
                <Phone size={19} />
              </a>
              <a
                href="https://wa.me/491234567890"
                aria-label="Message us on WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-basil-400/10 text-basil-600 transition-all duration-200 hover:-translate-y-1 hover:bg-basil-400/20"
              >
                <MessageCircle size={20} />
              </a>
              <span className="ml-1 text-sm text-warm-gray">
                Call or message us
              </span>
            </div>
            {/* <div className="mt-6 flex items-center gap-2 text-sm font-medium text-golden-600">
              <span className="h-1.5 w-1.5 rounded-full bg-golden-600" />A place
              for the whole family
            </div> */}
          </div>
        </div>

        {/* Location */}
        <div className="relative md:border-l md:border-espresso/10 md:pl-10">
          <div className="relative pt-1">
            <h2 className="text-xl font-bold text-espresso">Our location</h2>

            <p className="mt-4 leading-7 text-warm-gray">
              We are located in the center of town, close to the river. Our
              beautiful garden is filled with flowers and has a playground where
              the little ones can enjoy themselves.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-golden-600">
              <span className="h-1.5 w-1.5 rounded-full bg-golden-600" />{" "}
              Mainstreet 12 10432 Berlin
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="relative md:border-l md:border-espresso/10 md:pl-10">
          <div className="relative pt-1">
            <h2 className="text-xl font-bold text-espresso">Follow us</h2>

            <p className="mt-4 leading-7 text-warm-gray">
              Follow along for our latest dishes, special moments, and
              everything happening around the restaurant.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-tomato-400/10 text-tomato-600 transition-all duration-200 hover:-translate-y-1 hover:bg-tomato-400/20"
              >
                <FaInstagram size={19} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-basil-400/10 text-basil-600 transition-all duration-200 hover:-translate-y-1 hover:bg-basil-400/20"
              >
                <FaFacebookF size={17} />
              </a>

              <a
                href="#"
                aria-label="X"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso/10 text-espresso transition-all duration-200 hover:-translate-y-1 hover:bg-espresso/20"
              >
                <FaXTwitter size={17} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Small closing accent */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3">
        {/* Top line on mobile / left line on desktop */}
        <span className="h-px w-10 bg-golden-600/25 sm:w-16" />
        <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.12em] text-golden-600 sm:text-xs sm:tracking-[0.25em]">
          Good food · Good people · Good moments
        </span>
        {/* Bottom line on mobile / right line on desktop */}
        <span className="h-px w-10 bg-golden-600/25 sm:w-16" />
      </div>
    </section>
  );
}

export default About;
