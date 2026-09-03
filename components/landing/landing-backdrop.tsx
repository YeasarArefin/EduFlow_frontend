export function LandingBackdrop() {
  return (
    <>
      {/* 1. Fixed Luminous Ambient Radial Glow — centered both axes via inset-0 m-auto, compact radius, slow breathing */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 m-auto z-0 h-[52vw] w-[52vw] max-h-[680px] max-w-[680px] rounded-full blur-[70px] sm:blur-[100px] animate-glow-breathe motion-reduce:animate-none"
        style={{
          background:
            "radial-gradient(circle at center, var(--glow-lime) 0%, var(--glow-emerald) 38%, transparent 68%)",
        }}
      />

      {/* 2. Fixed 40px Technical Grid — subtle but visible, soft elliptical radial mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 35%, #000 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 35%, #000 30%, transparent 80%)",
        }}
      />

      {/* 3. Fixed SVG Noise / Fractal Grain Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[var(--grain-opacity)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
