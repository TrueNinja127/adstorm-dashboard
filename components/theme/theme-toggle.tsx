"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  collapsed?: boolean
}

export function ThemeToggle({ className, collapsed }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={cn(
          "flex items-center justify-center gap-3 rounded-xl border border-transparent py-2.5 text-[hsl(var(--sidebar-foreground))] opacity-50",
          collapsed ? "mx-auto w-10 px-0" : "ml-3 w-[calc(100%-12px)] px-5",
          className
        )}
        disabled
      >
        <Sun className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span className="font-display text-sm">Theme</span>}
      </button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-transparent py-2.5 text-[hsl(var(--sidebar-foreground))] transition-colors hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
        collapsed
          ? "mx-auto w-10 justify-center px-0"
          : "ml-3 w-[calc(100%-12px)] px-5",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-5 w-5 flex-shrink-0" strokeWidth={1.8} />
      ) : (
        <Moon className="h-5 w-5 flex-shrink-0" strokeWidth={1.8} />
      )}
      {!collapsed && (
        <span className="font-display text-sm">
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      )}
    </button>
  )
}
