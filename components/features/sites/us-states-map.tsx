"use client"

import { useMemo } from "react"
import { USAMap } from "@mirawision/usa-map-react"
import type { USAStateAbbreviation } from "@mirawision/usa-map-react"
import { STATE_ABBR_TO_NAME, STATE_NAME_TO_ABBR } from "@/lib/us-state-abbr"
import { cn } from "@/lib/utils"

interface UsStatesMapProps {
  selectedStateNames: string[]
  onStateClick?: (stateName: string) => void
  className?: string
}

export function UsStatesMap({
  selectedStateNames,
  onStateClick,
  className,
}: UsStatesMapProps) {
  const selectedSet = useMemo(
    () => new Set(selectedStateNames),
    [selectedStateNames]
  )

  const customStates = useMemo(() => {
    const abbrs = Object.keys(STATE_ABBR_TO_NAME) as USAStateAbbreviation[]
    const result: Partial<
      Record<
        USAStateAbbreviation,
        {
          fill?: string
          stroke?: string
          onClick?: (state: USAStateAbbreviation) => void
          label?: { enabled: boolean }
          tooltip?: { enabled: boolean }
        }
      >
    > = {}
    const primaryFill = "hsl(var(--primary))"
    const primaryStroke = "hsl(var(--primary) / 0.8)"
    const defaultFill = "hsl(var(--muted))"
    const defaultStroke = "hsl(var(--border))"

    for (const abbr of abbrs) {
      const fullName = STATE_ABBR_TO_NAME[abbr]
      if (!fullName) continue
      const isSelected = selectedSet.has(fullName)
      result[abbr] = {
        fill: isSelected ? primaryFill : defaultFill,
        stroke: isSelected ? primaryStroke : defaultStroke,
        label: { enabled: false },
        tooltip: { enabled: true },
        ...(onStateClick && {
          onClick: () => onStateClick(fullName),
        }),
      }
    }
    return result
  }, [selectedSet, onStateClick])

  return (
    <div className={cn("rounded-2xl bg-card overflow-hidden p-4", className)}>
      <USAMap
        defaultState={{
          fill: "hsl(var(--muted))",
          stroke: "hsl(var(--border))",
          label: { enabled: false },
          tooltip: { enabled: true },
        }}
        customStates={customStates}
        mapSettings={{ width: "100%", height: "auto" }}
        className="w-full h-auto"
      />
    </div>
  )
}
