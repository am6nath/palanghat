

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Products", href: "#products" },
  { name: "Location", href: "#location" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isOpen ? "glass-navbar py-3 bg-background/95 lg:bg-transparent shadow-sm lg:shadow-none" : "bg-transparent py-5"
      }`}
    >
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="group flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded bg-transparent transition-transform duration-300 group-hover:scale-[1.15]">
              <img src="/images/logo.png" alt="Palangat Logo" className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-wider text-foreground md:text-lg">
                PALANGHAT
              </span>
              <span className="text-[9px] tracking-[0.25em] text-muted-foreground">
                FIREWORKS
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group relative text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Visit Store Button */}
          <a
            href="#location"
            className="hidden paper-btn-sm lg:inline-flex bg-foreground text-background"
          >
            Visit Our Store
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex h-10 w-10 items-center justify-center border-2 border-foreground bg-background lg:hidden"
            aria-label="Toggle menu"
          >
            <div className="relative h-5 w-5">
              <span
                className={`absolute left-0 top-1 h-0.5 w-5 bg-foreground transition-all duration-300 ${
                  isOpen ? "top-2 rotate-45" : ""
                }`}
              />

              <span
                className={`absolute left-0 top-2 h-0.5 w-5 bg-foreground transition-all duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`absolute left-0 top-3 h-0.5 w-5 bg-foreground transition-all duration-300 ${
                  isOpen ? "top-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute left-0 right-0 top-full overflow-hidden transition-all duration-500 ease-out lg:hidden ${
            isOpen ? "max-h-[80vh] border-b-2 border-foreground shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-background px-4 py-6 paper-stack h-full overflow-y-auto">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block border-b border-dashed border-border py-4 font-medium text-foreground transition-all last:border-0 hover:pl-2 text-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#location"
              onClick={() => setIsOpen(false)}
              className="mt-6 block paper-btn text-center text-sm w-full py-4"
            >
              Visit Our Store
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
