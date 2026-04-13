

import { Shield, Award, Clock } from "lucide-react";
import { useState } from "react";
import { ScrollAnimation } from "./ui/scroll-animation";

const features = [
  {
    icon: Shield,
    title: "Safety Certified",
    description: "All products meet strict safety standards",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Finest fireworks sourced worldwide",
  },
  {
    icon: Clock,
    title: "Expert Support",
    description: "Our pyrotechnic team helps you choose",
  },
];

export function AboutSection() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <section id="about" className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <ScrollAnimation className="mb-12 text-center" animation="fade-up">
          <div className="mb-4 inline-flex items-center gap-2 border-2 border-foreground bg-background px-4 py-2">
            <Award className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              About Us
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Your Trusted Fireworks
            <span
              className="ml-2"
              style={{
                WebkitTextStroke: "1.5px #1A1A1A",
                color: "transparent",
              }}
            >
              Destination
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            For over 25 years, PALANGAT-FIREWORKS has been the premier
            destination for fireworks enthusiasts. Quality pyrotechnics at
            competitive prices.
          </p>
        </ScrollAnimation>

        {/* Features Grid in One Row */}
        <ScrollAnimation
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          animation="fade-up"
          delay={0.2}
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="origami-card group relative overflow-hidden rounded-xl border border-white/5 bg-card/60 p-6 shadow-xl transition-all"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Icon */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                  hoveredFeature === index
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-primary"
                }`}
              >
                <feature.icon className="h-6 w-6" />
              </div>

              <h3 className="mb-2 text-lg font-serif font-medium text-foreground tracking-wide">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>

              {/* Hover accent */}
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ${
                  hoveredFeature === index ? "w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </ScrollAnimation>

        {/* Seasonal Offers */}
        <ScrollAnimation
          className="mt-20 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md p-8 md:p-12 shadow-2xl"
          animation="scale-up"
          delay={0.3}
        >
          <div className="mb-10 text-center">
            <h3 className="text-2xl font-serif font-medium text-foreground md:text-4xl tracking-wide">
              Seasonal <span className="text-primary italic">Offers</span>
            </h3>
            <p className="mt-3 text-muted-foreground w-full max-w-lg mx-auto">
              Take advantage of our exclusive premium bundles for your
              celebrations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                label: "Premium Collection",
                discount: "15% OFF",
                description: "On all luxury aerial shells",
              },
              {
                label: "Vishu Offer",
                discount: "Early Bird",
                description: "Special wholesale rates on sparkler bundles",
              },
              {
                label: "Offer ends ...",
                discount: "7th April",
                description: "Order now before stock runs out",
              },
            ].map((offer) => (
              <div
                key={offer.label}
                className="group relative flex flex-col justify-center overflow-hidden rounded-xl border border-white/10 bg-secondary/80 p-8 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(229,57,53,0.15)] text-center min-h-[220px]"
              >
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {offer.label}
                  </div>
                  <div className="mb-3 text-3xl font-serif text-foreground break-words max-w-full">
                    {offer.discount}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed max-w-[90%]">
                    {offer.description}
                  </div>
                </div>

                {/* Decorative subtle background element */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10"></div>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
