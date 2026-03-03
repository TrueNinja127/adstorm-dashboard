"use client"

import { cn } from "@/lib/utils"
import type { CampaignStatus } from "@/types/campaigns"

export type StatusGroup = "running" | "completed" | "paused"

export function getStatusGroup(status: CampaignStatus): StatusGroup {
  switch (status) {
    case "active":
    case "scheduled":
      return "running"
    case "ended":
      return "completed"
    case "paused":
    case "draft":
    default:
      return "paused"
  }
}

const STATUS_VARIANTS: Record<
  StatusGroup,
  { label: string; className: string; dotClassName: string }
> = {
  running: {
    label: "Running",
    className: "text-emerald-600 dark:text-emerald-400",
    dotClassName: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    className: "text-muted-foreground",
    dotClassName: "bg-[#666]",
  },
  paused: {
    label: "Paused",
    className: "text-amber-600 dark:text-amber-400",
    dotClassName: "bg-primary",
  },
}

interface StatusBadgeProps {
  status: CampaignStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const group = getStatusGroup(status)
  const { label, className, dotClassName } = STATUS_VARIANTS[group]
  const isRunning = group === "running"

  return (
    <div
      className={cn("inline-flex items-center text-xs font-medium", className)}
    >
      <span className="relative mr-2 flex h-2 w-2 items-center justify-center">
        {isRunning && (
          <span
            className={cn(
              "absolute inline-flex h-2.5 w-2.5 rounded-full opacity-40 animate-ping",
              dotClassName
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            dotClassName
          )}
        />
      </span>
      {label}
    </div>
  )
}
