import { PRODUCT_IMAGES } from "@/data/images";

const logos = [PRODUCT_IMAGES.press1, PRODUCT_IMAGES.press2, PRODUCT_IMAGES.press3, PRODUCT_IMAGES.press4];

export function PressStrip() {
  return (
    <section className="border-y border-border/60 bg-paper">
      <div className="container-page py-7">
        <p className="mb-4 text-center micro-label">As Featured In</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-16">
          {logos.map((src) => (
            <img
              key={src}
              src={src}
              alt="As featured in"
              className="h-7 w-auto object-contain opacity-55 grayscale transition-opacity hover:opacity-80 md:h-8"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
