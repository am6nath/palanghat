

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const heroSlides = [
  {
    image: "/images/background.jpeg",
    title: "Light Up Your",
    highlight: "Celebrations",
    subtitle: "Premium quality fireworks for every special moment",
  },
  {
    image: "/images/hero-2.jpg",
    title: "Festival Season",
    highlight: "Specials",
    subtitle: "Exclusive Vishu offers available now",
  },
  {
    image: "/images/hero-3.jpg",
    title: "Create Magical",
    highlight: "Memories",
    subtitle: "Safe and spectacular fireworks for all occasions",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
    setTimeout(() => setIsAnimating(false), 600);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-background flex flex-col lg:flex-row"
    >
      {/* Content Side (Left Half) */}
      <div className="relative z-10 flex min-h-[100vh] lg:min-h-screen w-full lg:w-1/2 items-center px-4 py-24 sm:px-12 lg:px-20 xl:px-32 bg-background/70 lg:bg-background backdrop-blur-md lg:backdrop-blur-none transition-all">
        <div
          className={`w-full max-w-xl transition-all duration-1000 mt-12 lg:mt-0 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="space-y-6">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border-2 border-foreground bg-background/50 backdrop-blur-md px-4 py-2 rounded"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                Since 2001
              </span>
            </motion.div>

            {/* Title */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                <motion.h1
                  key={`title-${currentSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                  className="text-4xl font-black leading-tight text-foreground drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                <motion.h1
                  key={`highlight-${currentSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    type: "spring",
                    bounce: 0.3,
                  }}
                  className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl lg:text-7xl text-primary drop-shadow-md"
                >
                  {heroSlides[currentSlide].highlight}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Subtitle */}
            <AnimatePresence mode="popLayout">
              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-md text-base font-medium text-foreground/80 drop-shadow-sm md:text-lg"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4"
            >
              <a
                href="#products"
                className="paper-btn bg-foreground text-background hover:bg-foreground/90 font-bold px-6 py-4 flex items-center justify-center rounded"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Explore Products
              </a>
              <a
                href="#location"
                className="paper-btn-outline flex bg-background/40 w-full sm:w-auto text-foreground border-2 border-foreground/50 backdrop-blur-sm items-center justify-center px-6 py-4 font-semibold hover:bg-background/80 hover:border-foreground rounded transition"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Visit Store
              </a>
            </motion.div>

            {/* Slide Navigation */}
            <div className="flex items-center gap-6 pt-8">
              <div className="flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 transition-all duration-300 rounded ${
                      currentSlide === index
                        ? "w-8 bg-foreground"
                        : "w-2 bg-foreground/30 hover:bg-foreground/70"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <span className="font-mono text-sm text-foreground/80 font-semibold drop-shadow-sm">
                {String(currentSlide + 1).padStart(2, "0")} /{" "}
                {String(heroSlides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Side (Right Half Full Bleed) */}
      <div className="absolute inset-0 lg:left-1/2 w-full lg:w-1/2 h-full lg:min-h-screen overflow-hidden shadow-none lg:shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Elegant dark fade connecting left text area with right image */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:bg-gradient-to-r lg:from-background lg:via-background/40 lg:to-transparent mix-blend-multiply" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows positioned sleekly inside the image */}
        <div className="absolute bottom-8 right-8 flex gap-4 z-20">
          <button
            onClick={prevSlide}
            className="flex h-12 w-12 items-center justify-center border-2 border-white/20 bg-black/50 backdrop-blur-md text-white transition-all hover:bg-white hover:text-black rounded-full"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="flex h-12 w-12 items-center justify-center border-2 border-white/20 bg-black/50 backdrop-blur-md text-white transition-all hover:bg-white hover:text-black rounded-full"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
