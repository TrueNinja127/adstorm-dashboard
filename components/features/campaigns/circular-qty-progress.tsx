"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type CircularQtyProgressTextSize = "xs" | "sm" | "md" | "lg" | "xl"

interface CircularQtyProgressProps {
  totalQty: number
  usedQty: number
  size?: number
  strokeWidth?: number
  textSize?: CircularQtyProgressTextSize
  resetKey?: string | number
  animationDurationMs?: number
}

export function CircularQtyProgress({
  totalQty,
  usedQty,
  size = 56,
  strokeWidth = 5,
  textSize = "xs",
  resetKey,
  animationDurationMs = 2000,
}: CircularQtyProgressProps) {
  const usedPct = totalQty > 0 ? Math.round((usedQty / totalQty) * 100) : 0
  const clampedPct = Math.min(100, Math.max(0, usedPct))

  const [animatedPct, setAnimatedPct] = useState(0)

  useEffect(() => {
    setAnimatedPct(0)
    const id = requestAnimationFrame(() => {
      setAnimatedPct(clampedPct)
    })
    return () => cancelAnimationFrame(id)
  }, [clampedPct, resetKey])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const filledOffset = circumference - (animatedPct / 100) * circumference

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={filledOffset}
          strokeLinecap="round"
          className="text-emerald-500 dark:text-emerald-400 transition-all"
          style={{
            transitionDuration: `${animationDurationMs}ms`,
            transitionProperty: "stroke-dashoffset",
          }}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-bold text-foreground tabular-nums",
          textSize === "xs"
            ? "text-xs"
            : textSize === "sm"
              ? "text-sm"
              : textSize === "md"
                ? "text-md"
                : textSize === "lg"
                  ? "text-lg"
                  : textSize === "xl"
                    ? "text-xl"
                    : "text-xs"
        )}
      >
        {animatedPct}%
      </span>
    </div>
  )
}

