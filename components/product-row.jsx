

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { ProductCard } from "./product-card";

export function ProductRow({ title, products }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [checkScroll]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 320;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-4 md:px-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border-2 border-foreground">
            <Sparkles className="h-4 w-4 text-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground md:text-xl">
            {title}
          </h3>
          <span className="border border-foreground px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {products.length}
          </span>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`flex h-10 w-10 items-center justify-center border-2 transition-all ${
              canScrollLeft
                ? "border-foreground bg-background text-foreground hover:bg-foreground hover:text-background"
                : "cursor-not-allowed border-border text-muted-foreground opacity-50"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`flex h-10 w-10 items-center justify-center border-2 transition-all ${
              canScrollRight
                ? "border-foreground bg-background text-foreground hover:bg-foreground hover:text-background"
                : "cursor-not-allowed border-border text-muted-foreground opacity-50"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="hide-scrollbar flex gap-4 md:gap-6 overflow-x-auto scroll-smooth px-4 pb-8 snap-x snap-mandatory md:px-0"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-center sm:snap-start shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
