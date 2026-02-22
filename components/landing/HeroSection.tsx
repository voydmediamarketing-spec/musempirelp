"use client";

import { motion } from "framer-motion";

const headlineLines = [
  { words: ["Your", "Music."], baseDelay: 0 },
  { words: ["Your", "Empire."], baseDelay: 1.1 },
  { words: ["One", "Platform."], baseDelay: 2.15 },
];

const barHeights = [16, 34, 24, 42, 28, 36, 18];

export default function HeroSection() {
  return (
    <section className="hero-mesh relative flex min-h-screen items-center overflow-hidden px-6 pb-24 pt-28 sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,53,140,0.18),transparent_45%)]" />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.p
          className="mb-8 inline-flex rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          [YOUR APP NAME]
        </motion.p>
        <motion.p
          className="mb-8 text-xs uppercase tracking-[0.25em] text-fuchsia-200/80"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Create. Collaborate. Conquer.
        </motion.p>

        <h1 className="max-w-5xl text-5xl font-black leading-[0.88] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          {headlineLines.map((line, lineIndex) => (
            <span key={line.words.join(" ")} className="block">
              {line.words.map((word, wordIndex) => (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.22em]"
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.65,
                    ease: [0.21, 1, 0.34, 1],
                    delay: line.baseDelay + wordIndex * 0.2 + lineIndex * 0.05,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-8 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.05 }}
        >
          The all-in-one platform for the modern artist. Create. Collaborate. Conquer your
          career.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 3.35 }}
        >
          <motion.a
            href="#waitlist"
            className="glow-button inline-flex items-center justify-center rounded-full border border-fuchsia-300/70 px-7 py-3 text-sm font-semibold text-white"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Join the Waitlist
          </motion.a>
          <motion.a
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:bg-white/10"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            See the Vision
          </motion.a>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-end gap-2 rounded-full border border-white/10 bg-black/30 px-5 py-3 backdrop-blur">
        {barHeights.map((height, index) => (
          <span
            key={index}
            className="audio-bar block w-2 rounded-full bg-gradient-to-t from-fuchsia-500 via-purple-400 to-yellow-300"
            style={{
              height,
              animationDelay: `${index * 0.1}s`,
              animationDuration: `${1.1 + index * 0.08}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
