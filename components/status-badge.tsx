import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles = {
  success: "border-[var(--status-success-fg)]/20 bg-[var(--status-success-bg)] text-[var(--status-success-fg)]",
  warning: "border-[var(--status-warning-fg)]/20 bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)]",
  danger: "border-[var(--status-danger-fg)]/20 bg-[var(--status-danger-bg)] text-[var(--status-danger-fg)]",
  info: "border-[var(--status-info-fg)]/20 bg-[var(--status-info-bg)] text-[var(--status-info-fg)]",
} as const

export function StatusBadge({ status, children, className }: { status: keyof typeof statusStyles; children: ReactNode; className?: string }) {
  return <Badge className={cn("font-medium", statusStyles[status], className)}>{children}</Badge>
}
