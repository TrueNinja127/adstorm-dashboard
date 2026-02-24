"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const loadingSteps = [
  "Initializing dashboard",
  "Loading campaigns",
  "Fetching analytics",
  "Preparing marketplace",
  "Almost ready",
]

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const duration = 2400
    const interval = 20
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          setFadeOut(true)
          setTimeout(onComplete, 500)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
    }, 480)
    return () => clearInterval(stepTimer)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Subtle radial glow behind logo (uses primary from theme/color) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="h-[400px] w-[400px] rounded-full animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo: light mode = logo-dark, dark mode = logo */}
        <div className="relative h-12 w-[180px]">
          <Image
            src="/images/logo-dark.png"
            alt="ADStorm"
            width={180}
            height={48}
            priority
            className="relative z-10 block dark:hidden object-contain object-left h-12 w-auto"
          />
          <Image
            src="/images/logo.png"
            alt="ADStorm"
            width={180}
            height={48}
            priority
            className="relative z-10 hidden dark:block object-contain object-left h-12 w-auto"
          />
        </div>

        {/* Progress bar area */}
        <div className="flex w-64 flex-col items-center gap-3">
          {/* Bar track */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step label + percentage */}
          <div className="flex w-full items-center justify-between">
            <span className="text-xs text-muted-foreground font-sans transition-all duration-200">
              {loadingSteps[stepIndex]}...
            </span>
            <span className="text-xs font-medium text-foreground tabular-nums font-display">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
