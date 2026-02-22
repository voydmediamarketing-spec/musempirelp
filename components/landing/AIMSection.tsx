"use client";

import { motion } from "framer-motion";

const bullets = [
  "Career blueprint personalized to your goals",
  "Contract drafting and review",
  "Release strategy and timing",
  "Social media content creation",
  "Industry insights and trend alerts",
];

export default function AIMSection() {
  return (
    <motion.section
      id="aim"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-fuchsia-400/80 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <motion.h2
            className="text-4xl font-black tracking-tight text-white sm:text-5xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            Meet AiM.
          </motion.h2>
          <motion.p
            className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.12 }}
          >
            Your AI artist manager that never sleeps. Drafts your contracts. Plans your
            releases. Writes your emails. Grows your career.
          </motion.p>

          <ul className="mt-8 space-y-3">
            {bullets.map((bullet, index) => (
              <motion.li
                key={bullet}
                className="flex items-start gap-3 text-sm text-white/80 sm:text-base"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 + index * 0.1 }}
              >
                <span className="mt-[3px] text-fuchsia-300">✦</span>
                <span>{bullet}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          className="relative rounded-3xl border border-fuchsia-200/20 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-5 shadow-[0_25px_60px_-35px_rgba(240,70,170,0.45)]"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
        >
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/60">
            <span>AiM Conversation</span>
            <span>Live Demo</span>
          </div>

          <div className="space-y-4">
            <div className="ml-auto max-w-[86%] rounded-2xl rounded-br-sm border border-fuchsia-300/30 bg-fuchsia-500/12 px-4 py-3 text-sm text-white/90">
              When should I drop my next single?
            </div>
            <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-cyan-200/20 bg-black/45 px-4 py-3 text-sm leading-relaxed text-white/80">
              Based on your audience activity and current trends in your genre, Friday release at
              6PM IST is optimal. Want me to draft the social media campaign for it?
            </div>
          </div>

          <div className="mt-5 h-10 rounded-xl border border-white/10 bg-black/40 px-4 text-sm leading-10 text-white/45">
            Type a question...
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
