import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  { src: "/images/galery.1.jpg", alt: "Freshly prepared food" },
  { src: "/images/galery.2.jpg", alt: "Handmade pizza" },
  { src: "/images/galery.3.jpg", alt: "Fresh ingredients" },
  { src: "/images/galery.4.jpg", alt: "Restaurant interior" },
  { src: "/images/galery.5.jpg", alt: "Family dining together" },
  { src: "/images/galery.6.jpg", alt: "Traditional food preparation" },
];
function Gallery() {
  const [currentImage, setCurrentImage] = useState(0);
  function previousImage() {
    setCurrentImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }
  function nextImage() {
    setCurrentImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }
  return (
    <section className="w-full pt-8 pb-2 sm:px-8 sm:py-1">
      {/* Heading */}

      <div className="mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 shrink-0 bg-golden-600/40 sm:w-16" />

          <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-golden-600 sm:tracking-[0.25em]">
            A taste of our world
          </span>

          <span className="h-px w-10 shrink-0 bg-golden-600/40 sm:w-16" />
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-md font-medium leading-6 text-basil-500 sm:mt-5 sm:text-lg sm:leading-7">
          A little look at the food, people, and moments that make our place
          special.
        </p>
      </div>

      {/* Slider */}
      <div className="mx-auto mt-5 max-w-3xl sm:mt-10">
        <div className="relative overflow-hidden rounded-xl shadow-md shadow-espresso/10 sm:rounded-2xl sm:shadow-lg">
          <img
            src={images[currentImage].src}
            alt={images[currentImage].alt}
            className="h-[200px] w-full object-cover sm:h-[230px] md:h-[330px] lg:h-[400px]"
          />
          {/* Previous */}
          <button
            type="button"
            onClick={previousImage}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-basil-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-cream sm:left-4 sm:h-10 sm:w-10"
          >
            <ChevronLeft size={17} className="sm:size-[20px]" />
          </button>
          {/* Next */}
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-basil-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-cream sm:right-4 sm:h-10 sm:w-10"
          >
            <ChevronRight size={17} className="sm:size-[20px]" />
          </button>
        </div>
        {/* Dots */}
        <div className="mt-4 flex justify-center gap-1.5 sm:mt-5 sm:gap-2">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setCurrentImage(index)}
              aria-label={`Show image ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImage ? "w-6 bg-golden-600 sm:w-7" : "w-1.5 bg-golden-600/25 hover:bg-golden-600/50"}`}
            />
          ))}
        </div>
      </div>
      {/* Closing accent */}
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
export default Gallery;
