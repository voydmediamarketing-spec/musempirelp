"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const points = [
  [12, 38],
  [18, 31],
  [24, 44],
  [31, 48],
  [35, 28],
  [41, 36],
  [46, 53],
  [52, 32],
  [58, 41],
  [61, 56],
  [65, 25],
  [71, 34],
  [77, 47],
  [83, 31],
  [88, 41],
  [43, 24],
  [55, 22],
  [66, 18],
  [75, 22],
  [28, 26],
];

export default function MapSection() {
  const dots = useMemo(
    () =>
      points.map(([x, y], index) => ({
        x,
        y,
        delay: (index % 6) * 0.35 + Math.random() * 0.35,
        duration: 2.2 + (index % 4) * 0.5,
      })),
    [],
  );

  return (
    <motion.section
      id="map"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-black/35 p-7 sm:p-10">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(177,58,255,0.2),transparent_55%)] p-7 sm:p-10">
          <svg
            viewBox="0 0 1000 420"
            className="absolute inset-0 h-full w-full opacity-25"
            aria-hidden="true"
          >
            <defs>
              <pattern id="map-grid" width="45" height="45" patternUnits="userSpaceOnUse">
                <path d="M45 0H0V45" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="1000" height="420" fill="url(#map-grid)" />
            <path
              d="M92 186c44-66 89-102 149-100 48 1 101 38 148 72 35 25 59 36 107 33 55-3 89-38 148-67 53-26 111-29 164-13 34 10 66 26 100 64"
              fill="none"
              stroke="rgba(235,186,255,0.55)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M127 247c34 24 59 36 102 34 38-2 77-20 114-40 45-24 91-45 136-40 39 4 74 27 107 52 28 21 55 40 91 44 52 7 108-22 150-66"
              fill="none"
              stroke="rgba(200,150,255,0.45)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Your stage is the whole world.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
              Discover artists, book studios, find collaborators - on a live map of the global
              music community.
            </p>
            <a
              href="#waitlist"
              className="glow-button mt-8 inline-flex rounded-full border border-fuchsia-300/70 px-7 py-3 text-sm font-semibold text-white"
            >
              Join the Map
            </a>
          </div>

          <div className="pointer-events-none absolute inset-0">
            {dots.map((dot, index) => (
              <span
                key={index}
                className="map-dot absolute h-2.5 w-2.5 rounded-full bg-fuchsia-300"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  animationDelay: `${dot.delay}s`,
                  animationDuration: `${dot.duration}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
