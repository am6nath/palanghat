

import { MapPin, Clock, Phone } from "lucide-react";
import { ScrollAnimation } from "./ui/scroll-animation";

export function LocationSection() {
  return (
    <section id="location" className="bg-secondary py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Compact Header */}
        <ScrollAnimation
          className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row"
          animation="fade-up"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 border-2 border-foreground bg-background px-3 py-1">
              <MapPin className="h-3 w-3" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Find Us
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              Visit Our{" "}
              <span
                style={{
                  WebkitTextStroke: "1.5px #1A1A1A",
                  color: "transparent",
                }}
              >
                Store
              </span>
            </h2>
          </div>

          {/* Contact Info - Inline */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 border border-foreground bg-background px-3 py-1.5">
              <Clock className="h-3 w-3 text-foreground" />
              <span className="text-muted-foreground">9AM - 9PM</span>
            </div>
            <div className="flex items-center gap-2 border border-foreground bg-background px-3 py-1.5">
              <Phone className="h-3 w-3 text-foreground" />
              <span className="text-muted-foreground">9061320621</span>
            </div>
            <div className="flex items-center gap-2 border border-foreground bg-background px-3 py-1.5">
              <MapPin className="h-3 w-3 text-foreground" />
              <span className="text-muted-foreground">
                Near Beverage, Nileswaram
              </span>
            </div>
          </div>
        </ScrollAnimation>

        {/* Map - Compact with Origami style */}
        <ScrollAnimation
          className="origami-card overflow-hidden"
          animation="scale-up"
          delay={0.2}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3895.318330936427!2d75.1324595!3d12.2589109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba47b20e454edff%3A0xfff5988b2920569e!2sPalanghat%20Fire%20Works!5e0!3m2!1sen!2sin!4v1710000000000"
            width="100%"
            height="240"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="PALANGAT-FIREWORKS Location"
            className="grayscale transition-all duration-500 hover:grayscale-0"
          />
        </ScrollAnimation>
      </div>
    </section>
  );
}
