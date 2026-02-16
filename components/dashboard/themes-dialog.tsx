"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, Monitor, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useColorTheme,
  COLOR_THEMES,
  type ColorThemeId,
} from "@/contexts/color-theme-context"
import { cn } from "@/lib/utils"

const MODE_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Auto", icon: Monitor },
] as const

const COLOR_LABELS: Record<ColorThemeId, string> = {
  red: "Red",
  blue: "Blue",
  emerald: "Emerald",
  purple: "Purple",
  pink: "Pink",
  teal: "Teal",
  orange: "Orange",
  black: "Black",
  mint: "Mint",
}

const COLOR_SWATCH: Record<ColorThemeId, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  teal: "bg-teal-500",
  orange: "bg-orange-500",
  black: "bg-neutral-700",
  mint: "bg-teal-400",
}

interface ThemesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemesDialog({ open, onOpenChange }: ThemesDialogProps) {
  const { theme, setTheme } = useTheme()
  const { colorTheme, setColorTheme } = useColorTheme()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Themes</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Mode: Light / Dark / Auto */}
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">Mode</p>
            <div className="flex gap-2">
              {MODE_OPTIONS.map((opt) => {
                const isActive = theme === opt.value
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTheme(opt.value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color theme */}
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Color theme
            </p>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_THEMES.map((id) => {
                const isActive = colorTheme === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setColorTheme(id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30"
                        : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "h-5 w-5 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-background",
                        COLOR_SWATCH[id],
                        isActive ? "ring-primary" : "ring-transparent"
                      )}
                    />
                    {COLOR_LABELS[id]}
                    {isActive && (
                      <Check
                        className="ml-auto h-4 w-4 shrink-0 text-primary"
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
