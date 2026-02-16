"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export const COLOR_THEMES = [
  "red",
  "blue",
  "emerald",
  "purple",
  "pink",
  "teal",
  "orange",
  "black",
  "mint",
] as const
export type ColorThemeId = (typeof COLOR_THEMES)[number]

const STORAGE_KEY = "adstorm-color-theme"

interface ColorThemeContextValue {
  colorTheme: ColorThemeId
  setColorTheme: (id: ColorThemeId) => void
}

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null)

function getStoredTheme(): ColorThemeId {
  if (typeof window === "undefined") return "orange"
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && COLOR_THEMES.includes(stored as ColorThemeId)) {
    return stored as ColorThemeId
  }
  return "orange"
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorThemeId>("orange")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setColorThemeState(getStoredTheme())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute("data-color-theme", colorTheme)
    localStorage.setItem(STORAGE_KEY, colorTheme)
  }, [colorTheme, mounted])

  const setColorTheme = (id: ColorThemeId) => setColorThemeState(id)

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const ctx = useContext(ColorThemeContext)
  if (!ctx) {
    throw new Error("useColorTheme must be used within ColorThemeProvider")
  }
  return ctx
}
