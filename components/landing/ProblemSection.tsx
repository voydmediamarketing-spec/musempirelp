"use client";

import { motion } from "framer-motion";

const painPoints = [
  {
    title: "6 apps to manage your career",
    Icon: FragmentedPuzzleIcon,
  },
  {
    title: "Labels own your music and your money",
    Icon: BrokenChainIcon,
  },
  {
    title: "No tools built for the independent artist",
    Icon: MissingPiecesIcon,
  },
];

export default function ProblemSection() {
  return (
    <motion.section
      id="vision"
      className="relative px-6 py-24 sm:px-10 lg:px-16"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          Artists deserve better.
        </motion.h2>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {painPoints.map((item, index) => (
            <motion.article
              key={item.title}
              className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 shadow-[0_20px_60px_-45px_rgba(225,49,164,0.55)] transition hover:border-fuchsia-300/40 hover:shadow-[0_30px_60px_-40px_rgba(225,49,164,0.75)]"
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: index * 0.15 }}
            >
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-black/40 text-fuchsia-200 transition group-hover:border-fuchsia-300/40 group-hover:text-white">
                <item.Icon />
              </span>
              <p className="text-lg font-semibold leading-snug text-white">{item.title}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function FragmentedPuzzleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M3.75 4.5h6v6h-6v-6Zm10.5 0h6v6h-6v-6Zm-10.5 9h6v6h-6v-6Zm7.5 3v-3.75h2.25a1.5 1.5 0 1 0 0-3h-2.25V8.25h3.75"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrokenChainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="m14.5 8.5 1.5-1.5a3.5 3.5 0 1 1 5 5L19.5 13.5M9.5 15.5 8 17a3.5 3.5 0 1 1-5-5L4.5 10.5M8 12h8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 8.5 14 15.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function MissingPiecesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M4.5 5.25h6v6h-6v-6Zm9 0h6v6h-6v-6Zm-9 9h6v6h-6v-6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 15h5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="3 3" />
    </svg>
  );
}
