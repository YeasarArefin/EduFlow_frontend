import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const statusDotStyles = {
  success: "bg-primary shadow-[0_0_8px_var(--glow-lime)]",
  warning: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  danger: "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.4)]",
  info: "bg-emerald-500 shadow-[0_0_8px_var(--glow-emerald)]",
} as const;

export function StatusBadge({
  status,
  children,
  className,
}: {
  status: keyof typeof statusDotStyles;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors",
        className
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", statusDotStyles[status])}
        aria-hidden="true"
      />
      <span>{children}</span>
    </span>
  );
}

