import { Link } from "react-router";

function Home() {
  return (
    <section className="w-full">
      {/* ==================== HERO IMAGE CONTAINER ==================== */}

      <div className="relative isolate mx-auto w-full max-w-7xl overflow-hidden shadow-[0_12px_35px_rgba(43,37,32,0.45)] xl:mt-1">
        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[url('/images/home.jpg')] bg-cover bg-center"
        />
        {/* Keep the photo soft and consistent with the app */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-slate-100/25"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-100/60 via-slate-200/45 to-slate-300/65"
        />
        {/* Soft edges at the bottom of the image */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-10 bg-gradient-to-t from-ivory/30 to-transparent sm:h-14"
        />
        {/* Content */}
        <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-10 xl:py-15 2xl:py-18 ">
          {/* ==================== HERO ==================== */}
          <div className="mx-auto max-w-4xl text-center">
            {/* Small accent */}
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-golden-600/80 sm:w-12" />

              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-dark-espresso sm:text-sm lg:text-base">
                Handmade with tradition
              </span>

              <span className="h-px w-8 bg-golden-600/80 sm:w-12" />
            </div>

            {/* Main heading */}
            <div className="mt-5">
              {/* <h1 className="font-serif text-2xl italic tracking-tight text-basil-600 sm:text-5xl md:text-6xl lg:text-5xl">
                A Taste of Tradition
              </h1> */}

              <div className="mx-auto mt-4 flex items-center justify-center gap-2">
                <span className="h-px w-10 bg-golden-600/80 sm:w-16" />

                <span className="h-1.5 w-1.5 rounded-full bg-golden-600/50" />

                <span className="h-px w-10 bg-golden-600/80 sm:w-16" />
              </div>
            </div>

            {/* Introduction */}
            <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3 sm:gap-5">
              <p className="text-sm font-medium leading-relaxed text-warm-gray sm:text-base md:text-lg lg:text-lg xl:text-xl">
                Traditional recipes,
                <br className="hidden sm:block" />
                just like Nanna&apos;s.
              </p>

              <p className="text-sm font-medium leading-relaxed text-warm-gray sm:border-x sm:border-golden-600/15 sm:px-4 sm:text-base md:text-lg lg:text-lg xl:text-xl">
                Fresh ingredients,
                <br className="hidden sm:block" />
                handmade dough.
              </p>

              <p className="text-sm font-medium leading-relaxed text-warm-gray sm:text-base md:text-lg lg:text-lg xl:text-xl">
                Authentic flavours,
                <br className="hidden sm:block" />
                made with love.
              </p>
            </div>

            {/* Navigation */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-4 lg:mt-14">
              <Link
                to="/menu"
                className="min-w-36 rounded-full bg-basil-500 px-6 py-2.5 text-sm font-semibold text-cream shadow-md shadow-basil-500/20 transition-all duration-200 hover:-translate-y-1 hover:bg-basil-500 hover:shadow-lg hover:shadow-basil-500/25 lg:px-8 lg:py-3 lg:text-base"
              >
                Order now
              </Link>

              <Link
                to="/about"
                className="min-w-36 rounded-full border border-warm-border bg-cream/85 px-6 py-2.5 text-sm font-semibold text-basil-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:bg-cream hover:shadow-md lg:px-8 lg:py-3 lg:text-base"
              >
                Visit us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== OPENING HOURS ==================== */}
      <div className="mx-auto mt-8 max-w-4xl border-t border-golden-600/15 pt-6 text-center sm:mt-14 sm:pt-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-golden-600 sm:text-sm">
            Open daily
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-golden-600/50 sm:block" />

          <span className="text-sm font-medium text-warm-gray sm:text-base">
            10:00am – 12:00pm
          </span>
        </div>

        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-warm-gray/80 sm:text-xs">
          Sundays and public holidays we are closed
        </p>
      </div>

      {/* ==================== BOTTOM ACCENT ==================== */}
      <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:mt-7 sm:flex-row sm:gap-3">
        <span className="h-px w-8 bg-golden-600/25 sm:w-16" />

        <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.14em] text-golden-600 sm:text-xs sm:tracking-[0.25em]">
          Good food · Good people · Good moments
        </span>

        <span className="h-px w-8 bg-golden-600/25 sm:w-16" />
      </div>
    </section>
  );
}

export default Home;
