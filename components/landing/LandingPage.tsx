"use client";

import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import LazyMount from "./LazyMount";

const ProblemSection = dynamic(() => import("./ProblemSection"), {
  ssr: false,
  loading: () => <SectionFallback />,
});

const FeaturesSection = dynamic(() => import("./FeaturesSection"), {
  ssr: false,
  loading: () => <SectionFallback />,
});

const AIMSection = dynamic(() => import("./AIMSection"), {
  ssr: false,
  loading: () => <SectionFallback />,
});

const MapSection = dynamic(() => import("./MapSection"), {
  ssr: false,
  loading: () => <SectionFallback />,
});

const InvestSection = dynamic(() => import("./InvestSection"), {
  ssr: false,
  loading: () => <SectionFallback />,
});

const WaitlistSection = dynamic(() => import("./WaitlistSection"), {
  ssr: false,
  loading: () => <SectionFallback />,
});

const FooterSection = dynamic(() => import("./FooterSection"), {
  ssr: false,
  loading: () => <SectionFallback />,
});

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-stage text-white">
      <HeroSection />
      <LazyMount minHeight={520}>
        <ProblemSection />
      </LazyMount>
      <LazyMount minHeight={640}>
        <FeaturesSection />
      </LazyMount>
      <LazyMount minHeight={640}>
        <AIMSection />
      </LazyMount>
      <LazyMount minHeight={560}>
        <MapSection />
      </LazyMount>
      <LazyMount minHeight={600}>
        <InvestSection />
      </LazyMount>
      <LazyMount minHeight={500}>
        <WaitlistSection />
      </LazyMount>
      <LazyMount minHeight={240}>
        <FooterSection />
      </LazyMount>
    </main>
  );
}

function SectionFallback() {
  return <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.02] py-24" />;
}
