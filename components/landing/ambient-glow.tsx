export function AmbientGlow({
  className = "",
  position = "center",
  withGrid = false,
}: {
  className?: string;
  position?: "top" | "center" | "bottom";
  withGrid?: boolean;
}) {
  const positionClasses = {
    top: "top-[-6%] left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-[-6%] left-1/2 -translate-x-1/2",
  }[position];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 overflow-hidden select-none ${positionClasses} ${className}`}
    >
      {/* 40px Technical Grid — subtle but visible, radial edge fade */}
      {withGrid && (
        <div
          className="absolute inset-0 size-full opacity-[0.45] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)]"
          style={{
            backgroundImage: `linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      )}

      {/* Primary Luminous Ambient Glow — breathes via scale/opacity only, parent handles positioning */}
      <div
        className="size-[480px] sm:size-[720px] rounded-full blur-[80px] sm:blur-[110px] animate-glow-breathe motion-reduce:animate-none"
        style={{
          background: `radial-gradient(circle at center, var(--glow-lime) 0%, var(--glow-emerald) 35%, transparent 70%)`,
        }}
      />

      {/* Secondary soft accent glow */}
      <div
        className="absolute inset-0 m-auto size-[280px] sm:size-[420px] rounded-full blur-[60px] sm:blur-[85px] animate-glow-breathe motion-reduce:animate-none"
        style={{
          animationDelay: "-7s",
          background: `radial-gradient(circle at center, var(--glow-lime) 0%, var(--glow-emerald) 45%, transparent 70%)`,
        }}
      />
    </div>
  );
}
