import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const statusDotStyles = {
  success: "bg-[#27c93f]",
  warning: "bg-[#ffbd2e]",
  danger: "bg-[#ff5f56]",
  info: "bg-[#a3a3a3]",
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
        "inline-flex h-6 w-fit items-center gap-1.5 rounded-full border border-border bg-surface-soft px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors",
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

