"use client";

export function MarketingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* 1. Global 40px Engineering Grid (masked, using theme grid-line) */}
      <div
        className="absolute inset-0 size-full pointer-events-none opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: `radial-gradient(
            ellipse at 50% 20%,
            black 20%,
            rgba(0, 0, 0, 0.85) 50%,
            rgba(0, 0, 0, 0.4) 75%,
            transparent 95%
          )`,
          WebkitMaskImage: `radial-gradient(
            ellipse at 50% 20%,
            black 20%,
            rgba(0, 0, 0, 0.85) 50%,
            rgba(0, 0, 0, 0.4) 75%,
            transparent 95%
          )`,
        }}
      />

      {/* 2. Large Environmental Hero Ambient Glow (80-100vw, lime + emerald) */}
      <div
        className="absolute top-[-5vw] left-1/2 -translate-x-1/2 w-[90vw] h-[90vw] max-w-[1200px] max-h-[1200px] rounded-full pointer-events-none blur-[90px] sm:blur-[130px] motion-reduce:animate-none"
        style={{
          background: `radial-gradient(
            circle at center,
            var(--glow-lime) 0%,
            var(--glow-emerald) 35%,
            transparent 70%
          )`,
        }}
      />

      {/* 3. Secondary Subtle Ambient Glow */}
      <div
        className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[75vw] h-[75vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none blur-[100px] sm:blur-[140px]"
        style={{
          background: `radial-gradient(
            circle at center,
            var(--glow-lime) 0%,
            var(--glow-emerald) 40%,
            transparent 70%
          )`,
        }}
      />

      {/* 4. Fine Tactile Grain Noise Layer (uses var(--grain-opacity)) */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          opacity: "var(--grain-opacity)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
