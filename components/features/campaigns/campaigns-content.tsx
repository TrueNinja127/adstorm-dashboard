"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import {
  Search,
  Megaphone,
  LayoutGrid,
  List,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Tv,
  FileImage,
  ArrowRight,
  Calendar,
  Check,
  Trophy,
  Medal,
  MoreHorizontal,
  Play,
  Pause,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import type { Campaign, CampaignStatus } from "@/types/campaigns"
import Image from "next/image"
import {
  mockCampaigns,
  mockAds,
  type MockAd,
  mockBrands,
  mockSitesAndLocations,
  mockChannelsAndGenres,
} from "@/services"
import { ChartContainer } from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { AdPreviewVideoPlayer } from "./ad-preview-video-player"
import { useCreateCampaign } from "@/contexts/create-campaign-context"
import { format, parseISO, isValid } from "date-fns"
import { Pie, PieChart, Cell } from "recharts"
import { useToast } from "@/hooks/use-toast"

interface CampaignsContentProps {
  showHeaderAndFeatured?: boolean
  scrollContainer?: boolean
}

type ViewMode = "card" | "list"
type StatusGroup = "running" | "completed" | "paused"

/** Fallback sample video when ad has no video URL. */
const FALLBACK_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4"

const PAGE_SIZE = 8
const STATUS_OPTIONS: StatusGroup[] = ["running", "completed", "paused"]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

function formatDateTime(iso: string): string {
  try {
    const d = parseISO(iso)
    return isValid(d) ? format(d, "d MMM yyyy, h:mm a") : iso
  } catch {
    return iso
  }
}

function formatDate(iso: string): string {
  try {
    const d = parseISO(iso)
    return isValid(d) ? format(d, "MMM d, yyyy") : iso
  } catch {
    return iso
  }
}

function getStatusGroup(status: CampaignStatus): StatusGroup {
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

const primaryAdByCampaignId: Record<string, MockAd | undefined> =
  mockAds.reduce(
    (acc, ad) => {
      if (!acc[ad.campaignId]) {
        acc[ad.campaignId] = ad
      }
      return acc
    },
    {} as Record<string, MockAd | undefined>
  )

const brandByImage = mockBrands.reduce(
  (acc, brand) => {
    if (brand.image) {
      acc[brand.image] = brand
    }
    return acc
  },
  {} as Record<string, (typeof mockBrands)[number]>
)

const siteByImage = mockSitesAndLocations.reduce(
  (acc, site) => {
    if (site.image) {
      acc[site.image] = site
    }
    return acc
  },
  {} as Record<string, (typeof mockSitesAndLocations)[number]>
)

const genreByImage = mockChannelsAndGenres
  .filter((item) => item.type === "genre")
  .reduce(
    (acc, genre) => {
      if (genre.image) {
        acc[genre.image] = genre
      }
      return acc
    },
    {} as Record<string, (typeof mockChannelsAndGenres)[number]>
  )

function CircularQtyProgress({
  totalQty,
  usedQty,
  size = 56,
  strokeWidth = 5,
  textSize = "xs",
  resetKey,
}: {
  totalQty: number
  usedQty: number
  size?: number
  strokeWidth?: number
  textSize?: "xs" | "sm" | "md" | "lg" | "xl"
  resetKey?: string | number
  animationDurationMs?: number
}) {
  const animationDurationMs = 2000
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

function campaignAdId(campaignId: string): string {
  const num = campaignId.replace(/\D/g, "") || "0"
  return `#ADS${num.padStart(6, "0")}`
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const group = getStatusGroup(status)
  const variants: Record<
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
  const { label, className, dotClassName } = variants[group]
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

export function CampaignsContent({
  showHeaderAndFeatured = true,
  scrollContainer = true,
}: CampaignsContentProps) {
  const { openCreateCampaign } = useCreateCampaign()
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusGroup[]>([])
  const [approvedFilter, setApprovedFilter] = useState<
    "approved" | "pending" | null
  >(null)
  const [brandFilter, setBrandFilter] = useState<string[]>([])
  const [channelFilter, setChannelFilter] = useState<string[]>([])
  const [genreFilter, setGenreFilter] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [page, setPage] = useState(1)
  const [dateRange, setDateRange] = useState<string>("month")
  const [now, setNow] = useState(() => new Date())
  const [selectedAd, setSelectedAd] = useState<MockAd | null>(null)
  const [statusTooltip, setStatusTooltip] = useState<{
    x: number
    y: number
    key: "running" | "completed" | "paused"
    label: string
    value: number
  } | null>(null)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    campaignId: string
    action: "pause" | "resume"
  } | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([])
  const [pendingBulkStatusChange, setPendingBulkStatusChange] = useState<{
    action: "pause" | "resume"
  } | null>(null)
  const [detailsCampaignId, setDetailsCampaignId] = useState<string | null>(
    null
  )
  const browseAllRef = useRef<HTMLDivElement | null>(null)
  const gridLongPressRef = useRef<{
    id: string | null
    didLongPress: boolean
    timer: ReturnType<typeof setTimeout> | null
  }>({
    id: null,
    didLongPress: false,
    timer: null,
  })

  const pendingCampaign = useMemo(
    () =>
      pendingStatusChange
        ? (campaigns.find((c) => c.id === pendingStatusChange.campaignId) ??
          null)
        : null,
    [pendingStatusChange, campaigns]
  )

  const pendingDeleteCampaign = useMemo(
    () =>
      pendingDeleteId
        ? (campaigns.find((c) => c.id === pendingDeleteId) ?? null)
        : null,
    [pendingDeleteId, campaigns]
  )

  const detailsCampaign = useMemo(
    () =>
      detailsCampaignId
        ? (campaigns.find((c) => c.id === detailsCampaignId) ?? null)
        : null,
    [detailsCampaignId, campaigns]
  )

  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])

  const statusCounts = useMemo(() => {
    const acc: Record<StatusGroup, number> = {
      running: 0,
      completed: 0,
      paused: 0,
    }
    campaigns.forEach((c) => {
      const group = getStatusGroup(c.status)
      acc[group] = (acc[group] ?? 0) + 1
    })
    return acc
  }, [campaigns])

  const approvedCounts = useMemo(
    () =>
      campaigns.reduce(
        (acc, c) => {
          const isApproved = c.status !== "draft"
          if (isApproved) {
            acc.approved += 1
          } else {
            acc.pending += 1
          }
          return acc
        },
        { approved: 0, pending: 0 }
      ),
    [campaigns]
  )

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    campaigns.forEach((c) => {
      const imageKey = c.image ?? ""
      const brand = brandByImage[imageKey]
      if (!brand?.title) return
      counts[brand.title] = (counts[brand.title] ?? 0) + 1
    })
    return counts
  }, [campaigns])

  const channelCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    campaigns.forEach((c) => {
      c.channelNames?.forEach((ch) => {
        if (!ch) return
        counts[ch] = (counts[ch] ?? 0) + 1
      })
    })
    return counts
  }, [campaigns])

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    campaigns.forEach((c) => {
      const imageKey = c.image ?? ""
      const genre = genreByImage[imageKey]
      if (!genre?.name) return
      counts[genre.name] = (counts[genre.name] ?? 0) + 1
    })
    return counts
  }, [campaigns])

  const brandOptions = useMemo(
    () => Object.keys(brandCounts).sort(),
    [brandCounts]
  )

  const channelOptions = useMemo(
    () => Object.keys(channelCounts).sort(),
    [channelCounts]
  )

  const genreOptions = useMemo(
    () => Object.keys(genreCounts).sort(),
    [genreCounts]
  )

  const overviewStats = useMemo(() => {
    const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0)
    const totalAdsAired = campaigns.reduce((s, c) => s + c.usedQty, 0)
    const approvedCampaigns = campaigns.filter(
      (c) => c.status !== "draft"
    ).length
    return { totalSpent, totalAdsAired, approvedCampaigns }
  }, [campaigns])

  const statusChartData = useMemo(
    () => [
      { key: "running", label: "Running", value: statusCounts.running },
      { key: "completed", label: "Completed", value: statusCounts.completed },
      { key: "paused", label: "Paused", value: statusCounts.paused },
    ],
    [statusCounts]
  )

  const statusChartConfig = {
    running: {
      label: "Running",
      color: "#34D399", // emerald
    },
    completed: {
      label: "Completed",
      color: "hsl(210 10% 80%)", // gray
    },
    paused: {
      label: "Paused",
      color: "hsl(38 92% 50%)", // orange
    },
  } as const

  const runningPercent = useMemo(() => {
    const total = statusChartData.reduce((sum, item) => sum + item.value, 0)
    if (!total) return 0
    const running =
      statusChartData.find((item) => item.key === "running")?.value ?? 0
    return Math.round((running / total) * 100)
  }, [statusChartData])

  const topCampaigns = useMemo(
    () =>
      [...campaigns]
        // .filter((c) => c.spent > 0 || c.impressions > 0)
        // .sort((a, b) => b.spent - a.spent)
        .slice(0, 6),
    [campaigns]
  )

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        !search ||
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.objective.toLowerCase().includes(searchLower)
      const matchesStatus =
        statusFilter.length === 0 ||
        statusFilter.includes(getStatusGroup(campaign.status))
      const isApproved = campaign.status !== "draft"
      const matchesApproved =
        approvedFilter === null ||
        (approvedFilter === "approved" ? isApproved : !isApproved)

      const imageKey = campaign.image ?? ""
      const brand = brandByImage[imageKey]
      const genre = genreByImage[imageKey]
      const brandLabel = brand?.title
      const genreLabel = genre?.name

      const matchesBrand =
        brandFilter.length === 0 ||
        (brandLabel ? brandFilter.includes(brandLabel) : false)

      const matchesChannel =
        channelFilter.length === 0 ||
        (campaign.channelNames?.some((ch) => channelFilter.includes(ch)) ??
          false)

      const matchesGenre =
        genreFilter.length === 0 ||
        (genreLabel ? genreFilter.includes(genreLabel) : false)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesApproved &&
        matchesBrand &&
        matchesChannel &&
        matchesGenre
      )
    })
  }, [
    search,
    statusFilter,
    approvedFilter,
    brandFilter,
    channelFilter,
    genreFilter,
    campaigns,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCampaigns.length / PAGE_SIZE)
  )
  const paginatedCampaigns = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredCampaigns.slice(start, start + PAGE_SIZE)
  }, [filteredCampaigns, page])

  const visibleCampaignIds = useMemo(
    () => paginatedCampaigns.map((c) => c.id),
    [paginatedCampaigns]
  )

  const allVisibleSelected =
    visibleCampaignIds.length > 0 &&
    visibleCampaignIds.every((id) => selectedCampaignIds.includes(id))

  const someVisibleSelected =
    !allVisibleSelected &&
    visibleCampaignIds.some((id) => selectedCampaignIds.includes(id))

  const hasSelection = selectedCampaignIds.length > 0

  useEffect(() => {
    setPage(1)
  }, [
    search,
    statusFilter,
    approvedFilter,
    brandFilter,
    channelFilter,
    genreFilter,
  ])

  function resetAllFilters() {
    setStatusFilter([])
    setApprovedFilter(null)
    setBrandFilter([])
    setChannelFilter([])
    setGenreFilter([])
  }

  function toggleStatus(value: StatusGroup) {
    setStatusFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  function handleConfirmStatusChange() {
    if (!pendingStatusChange) return

    const { campaignId, action } = pendingStatusChange
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (!campaign) {
      setPendingStatusChange(null)
      return
    }

    const nextStatus: CampaignStatus = action === "pause" ? "paused" : "active"

    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: nextStatus } : c))
    )

    toast({
      title: action === "pause" ? "Campaign paused" : "Campaign played",
      description: `"${campaign.name}" is now ${nextStatus}.`,
      variant: action === "pause" ? "warning" : "success",
    })

    setPendingStatusChange(null)
  }

  function handleConfirmDelete() {
    if (!pendingDeleteId) return

    const campaign = campaigns.find((c) => c.id === pendingDeleteId)

    setCampaigns((prev) => prev.filter((c) => c.id !== pendingDeleteId))

    if (campaign) {
      toast({
        title: "Campaign deleted",
        description: `"${campaign.name}" has been removed.`,
        variant: "destructive",
      })
    }

    setPendingDeleteId(null)
  }

  function handleConfirmBulkStatusChange() {
    if (!pendingBulkStatusChange || selectedCampaignIds.length === 0) return

    const { action } = pendingBulkStatusChange

    setCampaigns((prev) =>
      prev.map((c) => {
        if (!selectedCampaignIds.includes(c.id)) return c
        const group = getStatusGroup(c.status)
        if (action === "pause" && group === "running") {
          return { ...c, status: "paused" }
        }
        if (action === "resume" && group === "paused") {
          return { ...c, status: "active" }
        }
        return c
      })
    )

    const affectedCount = campaigns.filter((c) =>
      selectedCampaignIds.includes(c.id)
    ).length

    if (affectedCount > 0) {
      toast({
        title: action === "pause" ? "Campaigns paused" : "Campaigns played",
        description:
          action === "pause"
            ? `${affectedCount} selected campaigns have been paused.`
            : `${affectedCount} selected campaigns have been played.`,
        variant: action === "pause" ? "warning" : "success",
      })
    }

    setPendingBulkStatusChange(null)
  }

  const inner = (
    <div className="px-8 py-8">
      {showHeaderAndFeatured && (
        <>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up">
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
                Campaigns
              </h1>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Manage your ad campaigns, track performance, and launch new
                campaigns.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col items-end min-w-[160px]">
                <span className="font-display text-lg font-bold tracking-tight text-foreground leading-none">
                  {format(now, "h:mm a")}
                </span>
                <span className="mt-1.5 text-xs font-medium text-muted-foreground leading-tight">
                  {format(now, "EEEE, d MMMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Row 1: Overview — 3 KPI cards + status pie chart */}
          <div className="mb-5 animate-fade-in-up delay-75">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-9">
              <div className="col-span-2 rounded-2xl bg-card/95 backdrop-blur-sm p-5 shadow-sm dark:ring-white/5 flex justify-between items-end gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Total Spent
                  </p>
                  <p className="font-display text-3xl font-bold tabular-nums text-foreground truncate">
                    {formatCurrency(overviewStats.totalSpent)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total budget used
                  </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1b1c20] text-[#666] dark:text-[#999]">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="col-span-2 rounded-2xl bg-card/95 backdrop-blur-sm p-5 shadow-sm dark:ring-white/5 flex justify-between items-end gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Ads Aired
                  </p>
                  <p className="font-display text-3xl font-bold tabular-nums text-foreground truncate">
                    {formatNumber(overviewStats.totalAdsAired)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total advertisements aired
                  </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1b1c20] text-[#666] dark:text-[#999]">
                  <Tv className="h-5 w-5" />
                </div>
              </div>
              <div className="col-span-2 rounded-2xl bg-card/95 backdrop-blur-sm p-5 shadow-sm dark:ring-white/5 flex justify-between items-end gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Approved
                  </p>
                  <p className="font-display text-3xl font-bold tabular-nums text-foreground">
                    {overviewStats.approvedCampaigns}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Campaigns approved
                  </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1b1c20] text-[#666] dark:text-[#999]">
                  <Check className="h-5 w-5" />
                </div>
              </div>
              <div className="col-span-3 rounded-2xl bg-card/95 backdrop-blur-sm p-4 shadow-sm dark:ring-white/5 flex items-end justify-between gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Campaign Status
                  </p>
                  <p className="font-display text-3xl font-bold text-foreground">
                    {runningPercent}%
                    <span className="text-lg text-muted-foreground font-medium ml-2">
                      running
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Distribution of running, completed, and paused campaigns
                  </p>
                </div>
                <div
                  className="relative flex h-[120px] w-[120px] items-center justify-center"
                  onMouseMove={(e) => {
                    if (!statusTooltip) return
                    const rect = (
                      e.currentTarget as HTMLDivElement
                    ).getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    setStatusTooltip((prev) =>
                      prev ? { ...prev, x, y } : prev
                    )
                  }}
                  onMouseLeave={() => setStatusTooltip(null)}
                >
                  <ChartContainer
                    config={statusChartConfig}
                    className="relative z-10 h-full w-full"
                  >
                    <PieChart key={viewMode}>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={48}
                        outerRadius={60}
                        paddingAngle={4}
                        strokeWidth={5}
                        isAnimationActive
                        animationDuration={600}
                        onMouseEnter={(_, index: number) => {
                          const item = statusChartData[index]
                          if (!item) return
                          setStatusTooltip((prev) => ({
                            x: prev?.x ?? 60,
                            y: prev?.y ?? 60,
                            key: item.key as "running" | "completed" | "paused",
                            label: item.label,
                            value: item.value,
                          }))
                        }}
                        onMouseLeave={() => setStatusTooltip(null)}
                      >
                        {statusChartData.map((entry) => (
                          <Cell
                            key={entry.key}
                            fill={`var(--color-${entry.key})`}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
                    <span className="font-display text-lg font-bold text-foreground">
                      {runningPercent}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Running
                    </span>
                  </div>
                  {statusTooltip && (
                    <div
                      className="pointer-events-none absolute z-20 rounded-lg px-2.5 py-1.5 text-[11px] shadow-lg text-background"
                      style={{
                        left: statusTooltip.x + 8,
                        top: statusTooltip.y + 8,
                        backgroundColor:
                          statusChartConfig[statusTooltip.key].color,
                      }}
                    >
                      <div className="font-medium inline">
                        {statusTooltip.label}{" "}
                        {statusTooltip.value.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Ads — 4 cards in one line */}
          <div className="mb-5 animate-fade-in-up delay-75">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Ads
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mockAds.length} creatives
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="btn-gelatine h-8 gap-1.5 text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                aria-label="View all ads"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-6 overflow-visible">
              {mockAds.slice(0, 6).map((ad) => (
                <button
                  key={ad.id}
                  type="button"
                  onClick={() => setSelectedAd(ad)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border-0 border-transparent hover:border-4 hover:border-primary bg-card/95 shadow-sm dark:ring-white/5 aspect-[8/4] transition-all duration-200 hover:scale-[1.1] hover:ring-[hsl(var(--primary))]/30 hover:shadow-lg origin-center text-left"
                >
                  {ad.image ? (
                    <Image
                      src={ad.image}
                      alt={ad.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <FileImage className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                    aria-hidden
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 overflow-hidden">
                    <p className="translate-y-full opacity-0 text-lg font-semibold text-white drop-shadow-lg transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:whitespace-normal group-hover:break-words">
                      {ad.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <Dialog
              open={!!selectedAd}
              onOpenChange={(open) => !open && setSelectedAd(null)}
            >
              <DialogContent
                className="max-w-4xl w-full p-0 gap-0 overflow-hidden border-0 aspect-video"
                hideClose
                style={{ borderRadius: 0 }}
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>{selectedAd?.name ?? "Ad preview"}</DialogTitle>
                </DialogHeader>
                {selectedAd && (
                  <div className="relative h-full w-full">
                    <AdPreviewVideoPlayer
                      key={selectedAd.id}
                      src={selectedAd.video ?? FALLBACK_VIDEO}
                      title={selectedAd.name}
                      autoPlay
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Top Campaigns — card grid like Ads, with progress + rank + name */}
          <div className="mb-5 animate-fade-in-up delay-100">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Top Campaigns
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  By spend — best performers
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="btn-gelatine h-8 gap-1.5 text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                aria-label="View all top campaigns"
                onClick={() => {
                  if (browseAllRef.current) {
                    browseAllRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                }}
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            {topCampaigns.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/95 p-10 text-center text-sm text-muted-foreground">
                No campaign spend yet. Launch a campaign to see performance
                here.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 overflow-visible">
                {topCampaigns.map((campaign) => {
                  return (
                    <div
                      key={campaign.id}
                      onClick={() => setDetailsCampaignId(campaign.id)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border-0 border-transparent hover:border-4 hover:border-primary bg-card/95 shadow-sm dark:ring-white/5 aspect-[8/4] transition-all duration-200 hover:scale-[1.1] hover:ring-[hsl(var(--primary))]/30 hover:shadow-lg origin-center"
                    >
                      {campaign.image ? (
                        <Image
                          src={campaign.image}
                          alt={campaign.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 20vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <Megaphone className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                        aria-hidden
                      />

                      <div className="absolute bottom-0 left-0 right-0 p-3 overflow-hidden">
                        <p className="translate-y-full opacity-0 text-lg font-semibold text-white drop-shadow-lg transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:whitespace-normal group-hover:break-words">
                          {campaign.name}
                        </p>
                        {campaign.channelNames &&
                          campaign.channelNames.length > 0 && (
                            <p className="translate-y-full opacity-0 text-sm text-white/90 drop-shadow-md transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 delay-75">
                              {campaign.channelNames.join(", ")}
                            </p>
                          )}
                        <span className="mt-1.5 inline-block translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 delay-100">
                          <StatusBadge status={campaign.status} />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Browse all campaigns heading */}
          <div
            ref={browseAllRef}
            className="mb-3 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up delay-150"
          >
            <h2 className="font-display text-[15px] font-bold text-foreground">
              Browse all campaigns
            </h2>
          </div>
        </>
      )}

      {!showHeaderAndFeatured && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
            All campaigns
          </h2>
          <Button
            onClick={openCreateCampaign}
            variant="outline"
            size="sm"
            className="gap-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      )}

      <div
        className={cn(
          "mb-4 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up",
          showHeaderAndFeatured ? "delay-150" : "delay-100"
        )}
      >
        <div className="relative min-w-[200px] max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 rounded-xl bg-card border-border"
          />
        </div>
        <div
          key={viewMode}
          className="flex items-center gap-1 rounded-xl border border-border bg-card p-1"
        >
          <button
            type="button"
            onClick={() => setViewMode("card")}
            className={cn(
              "flex btn-gelatine h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
              viewMode === "card"
                ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex btn-gelatine h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
              viewMode === "list"
                ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
            List
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1 order-2 lg:order-1">
          {viewMode === "card" && (
            <div
              className={cn(
                "animate-fade-in-up grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                showHeaderAndFeatured ? "delay-200" : ""
              )}
            >
              {hasSelection && (
                <div className="col-span-full flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-2 text-xs sm:text-sm">
                  <span className="font-medium text-foreground">
                    {selectedCampaignIds.length} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 px-2 text-xs"
                      onClick={() =>
                        setPendingBulkStatusChange({ action: "resume" })
                      }
                    >
                      <Play className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Play</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 px-2 text-xs"
                      onClick={() =>
                        setPendingBulkStatusChange({ action: "pause" })
                      }
                    >
                      <Pause className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">Pause</span>
                    </Button>
                  </div>
                </div>
              )}
              {filteredCampaigns.length === 0 ? (
                <div className="col-span-full flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm text-muted-foreground">
                  <Megaphone className="h-10 w-10 opacity-50" />
                  <p>No campaigns match your filters.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openCreateCampaign}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create your first campaign
                  </Button>
                </div>
              ) : (
                paginatedCampaigns.map((campaign) => {
                  const ad = primaryAdByCampaignId[campaign.id]
                  const imageKey = campaign.image ?? ""
                  const brand = brandByImage[imageKey]
                  const site = siteByImage[imageKey]
                  const genre = genreByImage[imageKey]
                  const primaryChannel = campaign.channelNames?.[0]
                  const unitPrice =
                    campaign.totalQty > 0
                      ? campaign.budget / campaign.totalQty
                      : 0

                  const brandLabel = brand?.title ?? "Brand not set"
                  const siteChannelLabel = site
                    ? `${site.subtitle ?? site.name}${
                        primaryChannel ? ` · ${primaryChannel}` : ""
                      }`
                    : (primaryChannel ?? "Site / channel not set")
                  const genreLabel = genre?.name ?? "Genre not set"
                  const adLabel = ad
                    ? `${ad.name} · ${ad.duration ?? "duration not set"}`
                    : "No ad file linked"
                  const isSelected = selectedCampaignIds.includes(campaign.id)

                  return (
                    <div
                      key={campaign.id}
                      data-selected={isSelected ? "true" : "false"}
                      onMouseDown={(e) => {
                        if (e.button !== 0) return
                        const lp = gridLongPressRef.current
                        lp.id = campaign.id
                        lp.didLongPress = false
                        if (lp.timer) {
                          clearTimeout(lp.timer)
                          lp.timer = null
                        }
                        lp.timer = setTimeout(() => {
                          lp.didLongPress = true
                          setSelectedCampaignIds((prev) => {
                            const alreadySelected = prev.includes(campaign.id)
                            if (alreadySelected) {
                              return prev.filter((id) => id !== campaign.id)
                            }
                            return [...prev, campaign.id]
                          })
                        }, 400)
                      }}
                      onMouseUp={(e) => {
                        if (e.button !== 0) return
                        const lp = gridLongPressRef.current
                        if (lp.timer) {
                          clearTimeout(lp.timer)
                          lp.timer = null
                        }
                      }}
                      onMouseLeave={() => {
                        const lp = gridLongPressRef.current
                        if (lp.timer) {
                          clearTimeout(lp.timer)
                          lp.timer = null
                        }
                      }}
                      onClick={() => {
                        const lp = gridLongPressRef.current
                        if (lp.didLongPress && lp.id === campaign.id) {
                          // consume click after long-press selection
                          lp.didLongPress = false
                          lp.id = null
                          return
                        }

                        if (hasSelection) {
                          // selection mode: toggle selection
                          setSelectedCampaignIds((prev) => {
                            const alreadySelected = prev.includes(campaign.id)
                            if (alreadySelected) {
                              return prev.filter((id) => id !== campaign.id)
                            }
                            return [...prev, campaign.id]
                          })
                        } else {
                          // no selection yet: open details drawer
                          setDetailsCampaignId(campaign.id)
                        }
                      }}
                      className="group flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-border bg-card/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20"
                    >
                      <div className="relative h-28 w-full overflow-hidden bg-muted">
                        {campaign.image ? (
                          <Image
                            src={campaign.image}
                            alt={campaign.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <Megaphone className="h-6 w-6" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-between p-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="inline-flex rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90">
                              {campaignAdId(campaign.id)}
                            </span>
                            <Checkbox
                              aria-label={`Select campaign ${campaign.name}`}
                              checked={isSelected}
                              className={cn(
                                "transition-opacity",
                                isSelected
                                  ? "opacity-100"
                                  : "opacity-0 pointer-events-none"
                              )}
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                              onCheckedChange={(checked) => {
                                const isChecked = !!checked
                                setSelectedCampaignIds((prev) => {
                                  if (isChecked) {
                                    if (prev.includes(campaign.id)) return prev
                                    return [...prev, campaign.id]
                                  }
                                  return prev.filter((id) => id !== campaign.id)
                                })
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="line-clamp-2 font-display text-sm font-semibold text-white drop-shadow">
                              {campaign.name}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              {primaryChannel && (
                                <p className="text-[11px] text-white/80">
                                  {primaryChannel}
                                </p>
                              )}
                              <StatusBadge status={campaign.status} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1 text-[11px]">
                            <p className="font-semibold text-foreground">
                              {brandLabel}
                            </p>
                            <p className="truncate text-muted-foreground">
                              {siteChannelLabel}
                            </p>
                            {genre && (
                              <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                <Trophy className="h-3 w-3 shrink-0" />
                                <span className="truncate">{genreLabel}</span>
                              </div>
                            )}
                          </div>
                          <CircularQtyProgress
                            totalQty={campaign.totalQty}
                            usedQty={campaign.usedQty}
                            size={46}
                            strokeWidth={4}
                            resetKey={viewMode}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="space-y-0.5">
                            <p className="text-muted-foreground">
                              Price / spot
                            </p>
                            <p className="font-semibold tabular-nums text-foreground">
                              {formatCurrency(unitPrice)}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-muted-foreground">Qty</p>
                            <p className="font-semibold tabular-nums text-foreground">
                              {campaign.totalQty}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-muted-foreground">Created</p>
                            <p className="truncate text-[11px]">
                              {formatDateTime(campaign.createdAt)}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-muted-foreground">Ad</p>
                            <p className="truncate font-medium text-foreground">
                              {adLabel}
                            </p>
                          </div>
                        </div>

                        <div className="mt-1 flex items-center justify-between border-t border-border pt-3">
                          <span className="text-[11px] text-muted-foreground">
                            {campaign.usedQty} of {campaign.totalQty} spots used
                          </span>
                          <div className="flex items-center gap-1">
                            {(() => {
                              const group = getStatusGroup(campaign.status)
                              const isRunning = group === "running"
                              const isPaused = group === "paused"

                              if (!isRunning && !isPaused) return null

                              const action: "pause" | "resume" = isRunning
                                ? "pause"
                                : "resume"

                              return (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 btn-gelatine"
                                  aria-label={
                                    isRunning
                                      ? "Pause campaign"
                                      : "Resume campaign"
                                  }
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setPendingStatusChange({
                                      campaignId: campaign.id,
                                      action,
                                    })
                                  }}
                                >
                                  {isRunning ? (
                                    <Pause className="h-3.5 w-3.5 text-primary" />
                                  ) : (
                                    <Play className="h-3.5 w-3.5 text-emerald-600" />
                                  )}
                                </Button>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {viewMode === "list" && (
            <div
              className={cn(
                "animate-fade-in-up rounded-2xl border border-border bg-card overflow-hidden",
                showHeaderAndFeatured ? "delay-200" : ""
              )}
            >
              {hasSelection && (
                <div className="flex items-center justify-between gap-3 border-b border-border/80 bg-muted/40 px-4 py-2 text-xs sm:text-sm">
                  <span className="font-medium text-foreground">
                    {selectedCampaignIds.length} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 px-2 text-xs"
                      onClick={() =>
                        setPendingBulkStatusChange({ action: "resume" })
                      }
                    >
                      <Play className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Play</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 px-2 text-xs"
                      onClick={() =>
                        setPendingBulkStatusChange({ action: "pause" })
                      }
                    >
                      <Pause className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">Pause</span>
                    </Button>
                  </div>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent items-center">
                    <TableHead className="h-12 px-6 w-10 pt-2">
                      <Checkbox
                        aria-label="Select all campaigns"
                        checked={allVisibleSelected}
                        onCheckedChange={(checked) => {
                          const shouldSelect = !!checked
                          if (shouldSelect) {
                            setSelectedCampaignIds((prev) => {
                              const next = new Set(prev)
                              visibleCampaignIds.forEach((id) => next.add(id))
                              return Array.from(next)
                            })
                          } else {
                            setSelectedCampaignIds((prev) =>
                              prev.filter(
                                (id) => !visibleCampaignIds.includes(id)
                              )
                            )
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Campaign
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Channel
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Genre
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Progress
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Approved
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Qty
                    </TableHead>
                    <TableHead className="h-12 px-6 text-right font-display font-semibold text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="h-32 px-6 text-center text-muted-foreground"
                      >
                        No campaigns match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCampaigns.map((campaign) => {
                      const isSelected = selectedCampaignIds.includes(
                        campaign.id
                      )
                      return (
                        <TableRow
                          key={campaign.id}
                          className="border-border transition-colors hover:bg-accent/50 cursor-pointer"
                          data-selected={isSelected ? "true" : "false"}
                          onClick={() => {
                            setSelectedCampaignIds((prev) =>
                              prev.includes(campaign.id)
                                ? prev.filter((id) => id !== campaign.id)
                                : [...prev, campaign.id]
                            )
                          }}
                        >
                          <TableCell className="px-6 py-4">
                            <Checkbox
                              aria-label={`Select campaign ${campaign.name}`}
                              checked={isSelected}
                              onClick={(e) => e.stopPropagation()}
                              onCheckedChange={(checked) => {
                                const isChecked = !!checked
                                setSelectedCampaignIds((prev) => {
                                  if (isChecked) {
                                    if (prev.includes(campaign.id)) return prev
                                    return [...prev, campaign.id]
                                  }
                                  return prev.filter((id) => id !== campaign.id)
                                })
                              }}
                            />
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted flex-shrink-0">
                                {campaign.image ? (
                                  <Image
                                    src={campaign.image}
                                    alt={campaign.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    <Megaphone className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  {campaignAdId(campaign.id)}
                                </p>
                                <p className="truncate font-display text-sm font-medium text-foreground">
                                  {campaign.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                            {(() => {
                              const primaryChannel = campaign.channelNames?.[0]

                              return (
                                <span className="text-sm text-foreground">
                                  {primaryChannel ?? "Channel not set"}
                                </span>
                              )
                            })()}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                            {(() => {
                              const imageKey = campaign.image ?? ""
                              const genre = genreByImage[imageKey]

                              const genreLabel = genre?.name ?? "Genre not set"

                              return (
                                <span className="text-sm text-foreground">
                                  {genreLabel}
                                </span>
                              )
                            })()}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <CircularQtyProgress
                              totalQty={campaign.totalQty}
                              usedQty={campaign.usedQty}
                              size={46}
                              strokeWidth={4}
                              resetKey={viewMode}
                            />
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <StatusBadge status={campaign.status} />
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {campaign.status !== "draft" ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-muted px-3 py-0.5 text-[11px] font-medium text-muted-foreground dark:text-gray-400">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {(() => {
                              const unitPrice =
                                campaign.totalQty > 0
                                  ? campaign.budget / campaign.totalQty
                                  : 0

                              return (
                                <span className="text-sm font-medium text-foreground">
                                  {formatCurrency(unitPrice)}
                                </span>
                              )
                            })()}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="text-sm text-foreground">
                              {campaign.totalQty}
                            </span>
                          </TableCell>
                          <TableCell
                            className="px-6 py-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-2">
                              {(() => {
                                const group = getStatusGroup(campaign.status)
                                const isRunning = group === "running"
                                const isPaused = group === "paused"

                                if (!isRunning && !isPaused) return null

                                const action: "pause" | "resume" = isRunning
                                  ? "pause"
                                  : "resume"

                                return (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 px-0 btn-gelatine"
                                    aria-label={
                                      isRunning
                                        ? "Pause campaign"
                                        : "Resume campaign"
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setPendingStatusChange({
                                        campaignId: campaign.id,
                                        action,
                                      })
                                    }}
                                  >
                                    {isRunning ? (
                                      <Pause className="h-3.5 w-3.5 text-primary" />
                                    ) : (
                                      <Play className="h-3.5 w-3.5 text-emerald-600" />
                                    )}
                                  </Button>
                                )
                              })()}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 btn-gelatine"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setDetailsCampaignId(campaign.id)
                                    }
                                  >
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() =>
                                      setPendingDeleteId(campaign.id)
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-sm text-muted-foreground order-2 sm:order-1 whitespace-nowrap">
                Page {page} of {totalPages}
              </p>
              <Pagination className="order-1 sm:order-2">
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="default"
                      className="gap-1 pl-2.5 h-9"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      aria-label="Go to previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <Button
                          variant={page === p ? "outline" : "ghost"}
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setPage(p)}
                          aria-current={page === p ? "page" : undefined}
                          aria-label={`Go to page ${p}`}
                        >
                          {p}
                        </Button>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="default"
                      className="gap-1 pr-2.5 h-9"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                      aria-label="Go to next page"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        <aside className="w-full flex-shrink-0 animate-fade-in-up order-1 lg:order-2 lg:w-[280px]">
          <div className="sticky top-8 rounded-2xl bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">
                Filters
              </h3>
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Reset all
              </button>
            </div>

            <div className="space-y-1 border-t border-border pt-4">
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="group flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-foreground hover:text-foreground">
                  Status
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground hidden group-data-[state=open]:inline-block" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pb-3">
                    {STATUS_OPTIONS.map((status) => (
                      <label
                        key={status}
                        className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground capitalize"
                      >
                        <Checkbox
                          checked={statusFilter.includes(status)}
                          onCheckedChange={() => toggleStatus(status)}
                          className="btn-gelatine"
                        />
                        {status} ({statusCounts[status] ?? 0})
                      </label>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="group flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-foreground hover:text-foreground">
                  Approved
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground hidden group-data-[state=open]:inline-block" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pb-3">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                      <Checkbox
                        checked={approvedFilter === "approved"}
                        onCheckedChange={(checked) =>
                          setApprovedFilter(checked ? "approved" : null)
                        }
                        className="btn-gelatine"
                      />
                      Approved ({approvedCounts.approved ?? 0})
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                      <Checkbox
                        checked={approvedFilter === "pending"}
                        onCheckedChange={(checked) =>
                          setApprovedFilter(checked ? "pending" : null)
                        }
                        className="btn-gelatine"
                      />
                      Pending ({approvedCounts.pending ?? 0})
                    </label>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {brandOptions.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="group flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-foreground hover:text-foreground">
                    Brands
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground hidden group-data-[state=open]:inline-block" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 pb-3 max-h-48 overflow-y-auto pr-1">
                      {brandOptions.map((brand) => (
                        <label
                          key={brand}
                          className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Checkbox
                            checked={brandFilter.includes(brand)}
                            onCheckedChange={(checked) =>
                              setBrandFilter((prev) =>
                                checked
                                  ? [...prev, brand]
                                  : prev.filter((b) => b !== brand)
                              )
                            }
                            className="btn-gelatine"
                          />
                          {brand} ({brandCounts[brand] ?? 0})
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {channelOptions.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="group flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-foreground hover:text-foreground">
                    Channel
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground hidden group-data-[state=open]:inline-block" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 pb-3 max-h-48 overflow-y-auto pr-1">
                      {channelOptions.map((channel) => (
                        <label
                          key={channel}
                          className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Checkbox
                            checked={channelFilter.includes(channel)}
                            onCheckedChange={(checked) =>
                              setChannelFilter((prev) =>
                                checked
                                  ? [...prev, channel]
                                  : prev.filter((c) => c !== channel)
                              )
                            }
                            className="btn-gelatine"
                          />
                          {channel} ({channelCounts[channel] ?? 0})
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {genreOptions.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="group flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-foreground hover:text-foreground">
                    Genre
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground hidden group-data-[state=open]:inline-block" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 pb-3 max-h-48 overflow-y-auto pr-1">
                      {genreOptions.map((genre) => (
                        <label
                          key={genre}
                          className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Checkbox
                            checked={genreFilter.includes(genre)}
                            onCheckedChange={(checked) =>
                              setGenreFilter((prev) =>
                                checked
                                  ? [...prev, genre]
                                  : prev.filter((g) => g !== genre)
                              )
                            }
                            className="btn-gelatine"
                          />
                          {genre} ({genreCounts[genre] ?? 0})
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Campaign details drawer */}
      <Drawer
        open={!!detailsCampaignId}
        onOpenChange={(open) => {
          if (!open) setDetailsCampaignId(null)
        }}
      >
        <DrawerContent className="max-h-[85vh] overflow-hidden rounded-t-2xl border border-border bg-background/95 px-0 pb-0 pt-2 shadow-2xl backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl">
          {detailsCampaign ? (
            <div className="flex h-full w-full flex-col px-4 pb-4 pt-2 text-sm sm:px-6 sm:pb-6">
              {(() => {
                const imageKey = detailsCampaign.image ?? ""
                const brand = brandByImage[imageKey]
                const site = siteByImage[imageKey]
                const genre = genreByImage[imageKey]
                const linkedAd = primaryAdByCampaignId[detailsCampaign.id]
                const ad: MockAd | null =
                  linkedAd ??
                  (detailsCampaign.image || detailsCampaign.name
                    ? ({
                        id: `campaign-${detailsCampaign.id}`,
                        campaignId: detailsCampaign.id,
                        name: detailsCampaign.name,
                        image: (detailsCampaign.image ??
                          undefined) as MockAd["image"],
                        video: FALLBACK_VIDEO,
                        duration: "Preview",
                      } as MockAd)
                    : null)
                const primaryChannel = detailsCampaign.channelNames?.[0]
                const unitPrice =
                  detailsCampaign.totalQty > 0
                    ? detailsCampaign.budget / detailsCampaign.totalQty
                    : 0

                const brandLabel = brand?.title ?? "Brand not set"
                const siteChannelLabel = site
                  ? `${site.subtitle ?? site.name}${
                      primaryChannel ? ` · ${primaryChannel}` : ""
                    }`
                  : (primaryChannel ?? "Site / channel not set")
                const genreLabel = genre?.name ?? "Genre not set"
                const adLabel = ad
                  ? `${ad.name} · ${ad.duration ?? "duration not set"}`
                  : detailsCampaign.image || detailsCampaign.name
                    ? `${detailsCampaign.name} · preview`
                    : "No ad file linked"

                const statusGroup = getStatusGroup(detailsCampaign.status)
                const isRunning = statusGroup === "running"
                const isPaused = statusGroup === "paused"
                const canToggle = isRunning || isPaused
                const toggleAction: "pause" | "resume" = isRunning
                  ? "pause"
                  : "resume"
                const toggleLabel = isRunning
                  ? "Pause"
                  : "Play"

                return (
                  <div className="flex items-stretch gap-6 py-3">
                    {/* Left: thumbnail + id + name + status */}
                    <div className="flex items-start gap-6">
                      <button
                        type="button"
                        onClick={() => {
                          if (ad) setSelectedAd(ad)
                        }}
                        className="group relative w-40 aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm"
                      >
                        {(ad?.image ?? detailsCampaign.image) ? (
                          <Image
                            src={ad?.image ?? (detailsCampaign.image as string)}
                            alt={detailsCampaign.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Megaphone className="h-5 w-5" />
                          </div>
                        )}
                        {ad && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </button>
                      <div className="min-w-0 space-y-2">
                        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                          {campaignAdId(detailsCampaign.id)}
                        </p>
                        <p className="truncate font-display text-xl font-semibold tracking-tight text-foreground">
                          {detailsCampaign.name}
                        </p>
                        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                          Created {formatDateTime(detailsCampaign.createdAt)}
                        </p>
                        <div className="mt-1">
                          <StatusBadge status={detailsCampaign.status} />
                        </div>
                      </div>
                    </div>

                    {/* Middle: three info columns */}
                    <div className="grid grid-cols-3 flex-1 items-center gap-8 pl-6 text-xs">
                      <div className="col-span-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Brand
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {brandLabel}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Site
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {siteChannelLabel}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Channel
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {primaryChannel ?? "Not set"}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Genre
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {genreLabel}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Ad
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {adLabel}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Approved
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {detailsCampaign.status !== "draft" ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Price
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(unitPrice)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Spots used
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {detailsCampaign.usedQty} /{" "}
                            {detailsCampaign.totalQty}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Total
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {formatCurrency(detailsCampaign.budget)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chart circle */}
                    <div className="flex flex-col items-center justify-center px-3 sm:px-4">
                      <CircularQtyProgress
                        totalQty={detailsCampaign.totalQty}
                        usedQty={detailsCampaign.usedQty}
                        size={100}
                        strokeWidth={9}
                        textSize="lg"
                      />
                    </div>

                    {/* Right: actions */}
                    <div className="flex flex-col items-start justify-center gap-3 pl-4 text-xs">
                      {canToggle && (
                        <Button
                          type="button"
                          onClick={() =>
                            setPendingStatusChange({
                              campaignId: detailsCampaign.id,
                              action: toggleAction,
                            })
                          }
                          variant="secondary"
                          className={cn("inline-flex btn-gelatine w-full items-center justify-start gap-1.5 text-sm font-medium py-4 text-white", isRunning ? "bg-primary hover:bg-primary/90" : "bg-emerald-500 hover:bg-emerald-700 text-white")}
                        >
                          {isRunning ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                          <span>{toggleLabel}</span>
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={() => setPendingDeleteId(detailsCampaign.id)}
                        variant="destructive"
                        className="inline-flex btn-gelatine w-full items-center justify-start gap-1.5 text-sm font-medium text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className="p-4 text-sm text-muted-foreground">
              No campaign selected.
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Confirm play/pause dialog */}
      <Dialog
        open={!!pendingStatusChange}
        onOpenChange={(open) => {
          if (!open) setPendingStatusChange(null)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              {pendingStatusChange?.action === "pause"
                ? "Pause campaign?"
                : "Resume campaign?"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-3 text-sm text-muted-foreground">
            {pendingCampaign && (
              <p>
                {pendingStatusChange?.action === "pause"
                  ? `This will pause "${pendingCampaign.name}" and stop serving its ads until you resume it.`
                  : `This will resume "${pendingCampaign.name}" and start serving its ads again.`}
              </p>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="min-w-[88px]"
              onClick={() => setPendingStatusChange(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className={`min-w-[88px] btn-gelatine ${pendingStatusChange?.action === "pause" ? "bg-primary" : "bg-emerald-500 hover:bg-emerald-700 text-white"}`}
              onClick={handleConfirmStatusChange}
              disabled={!pendingStatusChange}
            >
              {pendingStatusChange?.action === "pause" ? "Pause" : "Play"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm bulk play/pause dialog */}
      <Dialog
        open={!!pendingBulkStatusChange}
        onOpenChange={(open) => {
          if (!open) setPendingBulkStatusChange(null)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              {pendingBulkStatusChange?.action === "pause"
                ? "Pause selected campaigns?"
                : "Play selected campaigns?"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-3 text-sm text-muted-foreground">
            {hasSelection && (
              <p>
                {pendingBulkStatusChange?.action === "pause"
                  ? `This will pause ${selectedCampaignIds.length} selected campaign(s) and stop serving their ads until you resume them.`
                  : `This will play ${selectedCampaignIds.length} selected campaign(s) and start serving their ads.`}
              </p>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="min-w-[88px]"
              onClick={() => setPendingBulkStatusChange(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className={`min-w-[88px] btn-gelatine ${pendingBulkStatusChange?.action === "pause" ? "bg-primary" : "bg-emerald-500 hover:bg-emerald-700 text-white"}`}
              onClick={handleConfirmBulkStatusChange}
              disabled={!pendingBulkStatusChange || !hasSelection}
            >
              {pendingBulkStatusChange?.action === "pause" ? "Pause" : "Play"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm delete dialog */}
      <Dialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-destructive">
              Delete campaign?
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-3 text-sm text-muted-foreground">
            {pendingDeleteCampaign && (
              <p>
                {`This will permanently remove "${pendingDeleteCampaign.name}" from your campaigns. This action cannot be undone.`}
              </p>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="min-w-[88px]"
              onClick={() => setPendingDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="min-w-[88px] btn-gelatine"
              onClick={handleConfirmDelete}
              disabled={!pendingDeleteId}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  if (scrollContainer) {
    return <div className="flex-1 min-h-0 overflow-y-auto">{inner}</div>
  }
  return <>{inner}</>
}
