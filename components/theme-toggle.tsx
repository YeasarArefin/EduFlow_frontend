"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor
  return (
    <Button variant="outline" size="icon" aria-label={`Switch theme (currently ${theme})`} title={`Switch to ${next} theme`} onClick={() => setTheme(next)}>
      <Icon data-icon="inline-start" />
    </Button>
  )
}
