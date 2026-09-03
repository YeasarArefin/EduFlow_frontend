"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"
type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void; resolvedTheme: "light" | "dark" }
const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = "eduflow.theme"

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")
  const [isHydrated, setIsHydrated] = useState(false)
  const [transitionColor, setTransitionColor] = useState<string | null>(null)
  const [transitionKey, setTransitionKey] = useState(0)
  const transitionTimeout = useRef<number | null>(null)

  const applyTheme = useCallback((preference: Theme) => {
    const next = preference === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : preference

    document.documentElement.classList.toggle("dark", next === "dark")
    document.documentElement.dataset.theme = preference
    document.documentElement.style.colorScheme = next
    setResolvedTheme(next)
  }, [])

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const preference = isTheme(stored) ? stored : "system"

    // The pre-paint script has already applied the matching class.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(preference)
    setResolvedTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => applyTheme(theme)
    apply()
    media.addEventListener("change", apply)
    window.localStorage.setItem(STORAGE_KEY, theme)
    return () => media.removeEventListener("change", apply)
  }, [applyTheme, isHydrated, theme])

  useEffect(() => () => {
    if (transitionTimeout.current) window.clearTimeout(transitionTimeout.current)
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    const root = document.documentElement
    const apply = () => {
      applyTheme(nextTheme)
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
      setThemeState(nextTheme)
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!prefersReducedMotion) {
      root.classList.add("theme-changing")
      setTransitionColor(window.getComputedStyle(document.body).backgroundColor)
      setTransitionKey((key) => key + 1)
      if (transitionTimeout.current) window.clearTimeout(transitionTimeout.current)
      transitionTimeout.current = window.setTimeout(() => {
        root.classList.remove("theme-changing")
        setTransitionColor(null)
      }, 280)
    }

    apply()
  }, [applyTheme])

  const value = useMemo(() => ({ theme, setTheme, resolvedTheme }), [theme, setTheme, resolvedTheme])
  return (
    <ThemeContext.Provider value={value}>
      {children}
      {transitionColor && (
        <div
          key={transitionKey}
          aria-hidden="true"
          className="theme-transition-veil"
          style={{ backgroundColor: transitionColor }}
        />
      )}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
