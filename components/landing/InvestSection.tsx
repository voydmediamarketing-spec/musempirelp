"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 94, suffix: "%", title: "Fans who invest stay forever" },
  { value: 100, suffix: "%", title: "Artists keep creative control" },
  { value: 88, suffix: "%", title: "Returns tied to real music revenue" },
];

export default function InvestSection() {
  return (
    <motion.section
      id="invest"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-45">
        <svg viewBox="0 0 1200 480" className="h-full w-full" aria-hidden="true">
          <path
            className="chart-line"
            d="M0 360C96 305 175 319 264 257C343 204 434 205 518 231C595 255 676 222 748 168C832 105 926 87 1001 126C1062 157 1122 194 1200 122"
            fill="none"
            stroke="url(#chart-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(198,111,255,0.2)" />
              <stop offset="50%" stopColor="rgba(233,72,159,0.7)" />
              <stop offset="100%" stopColor="rgba(255,205,98,0.8)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <h2 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
          Your fans believe in you. Let them invest in you.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">
          The Artist Investment Platform turns your biggest fans into your biggest stakeholders.
          Fund your album. Share your success.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => (
            <CountCard key={stat.title} {...stat} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

type CountCardProps = {
  value: number;
  suffix: string;
  title: string;
  index: number;
};

function CountCard({ value, suffix, title, index }: CountCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const duration = 1100 + index * 170;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [inView, index, value]);

  return (
    <motion.article
      ref={ref}
      className="rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, delay: index * 0.12 }}
    >
      <p className="text-4xl font-black tracking-tight text-white sm:text-5xl">
        {count}
        {suffix}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-white/72">{title}</p>
    </motion.article>
  );
}
