

import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";

export function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [isViewingImage, setIsViewingImage] = useState(false);

  // Stop body scroll when viewing image
  useEffect(() => {
    if (isViewingImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isViewingImage]);

  // ==========================================
  // EDIT CRACKER DETAILS HERE
  // You can change these variables manually in the code
  //
  // DEMO CODE: How to override specific product images/names
  // const crackerName = product.id === "sp-001" ? "My Custom Super Sparkler" : product.name;
  // const crackerImage = product.id === "sp-001" ? "/images/custom-crack-image.png" : product.image;
  // ==========================================
  const crackerName = product.name;
  const crackerImage = product.image;
  // ==========================================

  return (
    <>
      {/* Paper / Origami Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="origami-card group relative flex h-[460px] w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] shrink-0 flex-col p-0 mx-auto overflow-hidden"
        style={{ willChange: "transform" }}
      >
        {/* Image Container */}
        <div
          className="relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-secondary border-b-2 border-foreground"
          onClick={() => setIsViewingImage(true)}
        >
          {!imageError ? (
            <img
              src={crackerImage}
              alt={crackerName}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Sparkles
                className="mb-2 h-8 w-8 text-muted-foreground"
                strokeWidth={1.5}
              />
              <span className="text-sm font-serif font-medium tracking-widest text-muted-foreground uppercase">
                {product.category}
              </span>
            </div>
          )}

          {/* "View" overlay on hover */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background border-2 border-foreground text-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
              View
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pt-5 pb-4">
          {/* Category Tag */}
          <div className="mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground border border-foreground/20 px-2 py-0.5">
              {product.category}
            </span>
          </div>

          {/* Name */}
          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-foreground leading-snug tracking-tight min-h-[3.2rem]">
            {crackerName}
          </h3>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground min-h-[2.8rem]">
            {product.description ||
              `Premium ${product.category.toLowerCase()} for your celebration.`}
          </p>

          {/* Price — bottom of card */}
          <div className="mt-auto flex items-end justify-between border-t-2 border-dashed border-foreground/20 pt-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-0.5">
                Price
              </span>
              <div className="text-3xl font-black text-foreground leading-none">
                ₹{product.price.toFixed(0)}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center border-2 border-foreground bg-foreground text-background">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>
      </motion.div>


      {/* Lightbox / Full screen Image Viewer */}
      {isViewingImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm"
          onClick={() => setIsViewingImage(false)}
        >
          <button
            className="absolute right-6 top-6 rounded-none bg-secondary p-2 text-foreground transition-colors hover:bg-muted border border-border"
            onClick={() => setIsViewingImage(false)}
            aria-label="Close image"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative h-[80vh] w-[90vw] max-w-4xl"
            onClick={(e) => e.stopPropagation()} // Prevent close on clicking the image itself
          >
            {!imageError ? (
              <img
                src={crackerImage}
                alt={crackerName}
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center rounded-sm bg-secondary border border-border">
                <Sparkles className="mb-4 h-16 w-16 text-muted-foreground" />
                <span className="text-2xl font-serif font-light text-muted-foreground uppercase tracking-widest">
                  Preview Unavailable
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
