"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"
type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void; resolvedTheme: "light" | "dark" }
const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = "eduflow.theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark" || stored === "system") {
      // Theme preference is external browser state; hydrate it once on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const next = theme === "system" ? (media.matches ? "dark" : "light") : theme
      document.documentElement.classList.toggle("dark", next === "dark")
      document.documentElement.style.colorScheme = next
      setResolvedTheme(next)
    }
    apply()
    media.addEventListener("change", apply)
    window.localStorage.setItem(STORAGE_KEY, theme)
    return () => media.removeEventListener("change", apply)
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme, resolvedTheme }), [theme, resolvedTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
