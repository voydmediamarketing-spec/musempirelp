"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🎵",
    title: "AI Artist Manager",
    description: "Your personal career guide, available 24/7",
  },
  {
    icon: "🗺️",
    title: "World Artist Map",
    description: "Find collaborators, studios, and gigs near you",
  },
  {
    icon: "📈",
    title: "Artist Investment Platform",
    description: "Let fans fund your journey and share your success",
  },
  {
    icon: "🎛️",
    title: "Music Creation Suite",
    description: "Record, produce, and release from one place",
  },
  {
    icon: "📣",
    title: "Content & Social Engine",
    description: "AI writes your posts, schedules them, tracks performance",
  },
  {
    icon: "💸",
    title: "Full Monetization Stack",
    description: "Royalties, merch, tickets, subscriptions - all tracked",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function FeaturesSection() {
  return (
    <motion.section
      id="features"
      className="px-6 py-24 sm:px-10 lg:px-16"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Everything. One Place.
        </motion.h2>

        <motion.div
          className="mt-14 grid gap-5 md:grid-cols-2"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-black/35 p-7 backdrop-blur-sm transition hover:border-fuchsia-300/40"
              variants={item}
              transition={{ duration: 0.7 }}
            >
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/40 via-purple-500/30 to-yellow-300/25 text-2xl">
                {feature.icon}
              </span>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
