"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      const response = await fetch("/api/waitlist", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load waitlist count");
      }

      const data = (await response.json()) as { count: number };
      setCount(data.count);
    } catch {
      setCount(null);
    } finally {
      setLoadingCount(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();

    const timer = setInterval(() => {
      fetchCount();
    }, 20000);

    return () => clearInterval(timer);
  }, [fetchCount]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email) {
      setError("Please add your email.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { message?: string; count?: number };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to join the waitlist.");
      }

      setSubmitted(true);
      setEmail("");

      if (typeof payload.count === "number") {
        setCount(payload.count);
      } else {
        fetchCount();
      }
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      id="waitlist"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-fuchsia-200/25 bg-[linear-gradient(140deg,rgba(127,30,196,0.4),rgba(7,7,18,0.92)_52%,rgba(212,32,148,0.33))] px-7 py-12 shadow-[0_35px_80px_-50px_rgba(227,54,172,0.75)] sm:px-12">
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          The revolution starts here.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/78 sm:text-base">
          Be among the first artists on the platform. Early members get lifetime founding artist
          status.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="waitlist-email" className="sr-only">
            Email
          </label>
          <input
            id="waitlist-email"
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 flex-1 rounded-full border border-white/25 bg-black/35 px-5 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-fuchsia-300/70 focus:ring-2 focus:ring-fuchsia-300/30"
          />
          <motion.button
            type="submit"
            className="glow-button h-12 rounded-full border border-fuchsia-300/80 px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={submitting}
          >
            {submitting ? "Joining..." : "Join Waitlist"}
          </motion.button>
        </form>

        <p className="mt-4 min-h-[1.5rem] text-sm text-white/88">
          {submitted ? "You're in. We'll be in touch." : error ?? ""}
        </p>

        <p className="mt-5 text-sm text-white/76">
          Join {loadingCount ? "..." : (count ?? 0).toLocaleString()} artists already on the
          waitlist
        </p>
      </div>
    </motion.section>
  );
}
