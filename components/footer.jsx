

import {
  Sparkles,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Heart,
} from "lucide-react";


const socialLinks = [
  // { icon: Facebook, href: "", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/newpalanghat?igsh=NnM2cnF4NnFoM3Uw", label: "Instagram" },
  // { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@newpalanghat?si=P6AnPTnOOnYMF8jW", label: "YouTube" },
];

export function Footer() {
  const handleNavClick = (href) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer id="contact" className="border-t-2 border-foreground bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {/* GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded bg-transparent">
                <img src="/images/logo.png" alt="Palangat Logo" className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
              </div>

              <div className="flex flex-col">
                <span className="text-base font-bold tracking-wider text-foreground">
                  PALANGAT
                </span>
                <span className="text-[9px] tracking-[0.25em] text-muted-foreground">
                  FIREWORKS
                </span>
              </div>
            </div>

            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Your premier destination for quality fireworks since 2001. Making
              celebrations spectacular for over 25 years.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center border-2 border-foreground text-foreground transition-all hover:bg-foreground hover:text-background"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Optional columns (prevents layout break) */}
          <div />
          <div />
          <div />
        </div>{" "}
        {/* ✅ CLOSED GRID */}
        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t-2 border-dashed border-border pt-8 md:flex-row">
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-foreground" /> by
            PALANGAT-FIREWORKS © {new Date().getFullYear()}
          </p>

          <div className="flex gap-6 text-sm">
            <a
              href="https://amarnathh.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-muted-foreground transition-colors hover:text-foreground"
            >
              Amarnath T V
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-foreground transition-all group-hover:w-full" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
