export function AmbientGlow({
  className = "",
  position = "center",
}: {
  className?: string;
  position?: "top" | "center" | "bottom";
}) {
  const positionClasses = {
    top: "top-[-10%] left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-[-10%] left-1/2 -translate-x-1/2",
  }[position];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 overflow-hidden ${positionClasses} ${className}`}
    >
      <div className="size-[500px] sm:size-[700px] rounded-full bg-gradient-to-tr from-foreground/[0.04] via-foreground/[0.07] to-transparent blur-3xl dark:from-foreground/[0.03] dark:via-foreground/[0.06]" />
    </div>
  );
}
