"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";

type LazyMountProps = {
  children: ReactNode;
  minHeight?: number;
};

export default function LazyMount({ children, minHeight = 320 }: LazyMountProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "400px 0px" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (inView) {
      setMounted(true);
    }
  }, [inView]);

  return (
    <div ref={ref} style={{ minHeight }}>
      {mounted ? (
        children
      ) : (
        <div className="mx-auto h-full max-w-6xl rounded-3xl border border-white/10 bg-white/[0.02]" />
      )}
    </div>
  );
}
