import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DynamicBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        <img
          src="/images/background.jpeg"
          alt="Fireworks background"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] opacity-20"
        />
      </motion.div>
      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
    </div>
  );
}
