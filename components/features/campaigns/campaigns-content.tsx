"use client"

import { useState, useMemo, useEffect } from "react"
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
  BarChart3,
  MousePointer,
  Tv,
  FileImage,
  ArrowRight,
  Eye,
  Calendar,
  Check,
  Trophy,
  Medal,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { mockCampaigns, mockAds, type MockAd } from "@/services"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdPreviewVideoPlayer } from "./ad-preview-video-player"
import { useCreateCampaign } from "@/contexts/create-campaign-context"
import { format, parseISO, isValid } from "date-fns"

interface CampaignsContentProps {
  showHeaderAndFeatured?: boolean
  scrollContainer?: boolean
}

type ViewMode = "card" | "list"

/** Fallback sample video when ad has no video URL. */
const FALLBACK_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4"

const PAGE_SIZE = 8
const STATUS_OPTIONS: CampaignStatus[] = [
  "draft",
  "scheduled",
  "active",
  "paused",
  "ended",
]

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

function formatDate(iso: string): string {
  try {
    const d = parseISO(iso)
    return isValid(d) ? format(d, "MMM d, yyyy") : iso
  } catch {
    return iso
  }
}

/** Circular progress bar showing used Qty % (green = used/delivered, gray = remaining). */
function CircularQtyProgress({
  totalQty,
  usedQty,
  size = 56,
  strokeWidth = 5,
}: {
  totalQty: number
  usedQty: number
  size?: number
  strokeWidth?: number
}) {
  const usedPct = totalQty > 0 ? Math.round((usedQty / totalQty) * 100) : 0
  const clampedPct = Math.min(100, Math.max(0, usedPct))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const filledOffset = circumference - (clampedPct / 100) * circumference
  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
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
          className="text-emerald-500 dark:text-emerald-400 transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground tabular-nums">
        {clampedPct}%
      </span>
    </div>
  )
}

function campaignAdId(campaignId: string): string {
  const num = campaignId.replace(/\D/g, "") || "0"
  return `#ADS${num.padStart(6, "0")}`
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const variants: Record<
    CampaignStatus,
    { label: string; className: string }
  > = {
    draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
    scheduled: {
      label: "Scheduled",
      className: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    },
    active: {
      label: "Active",
      className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    paused: {
      label: "Paused",
      className: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
    ended: { label: "Ended", className: "bg-muted text-muted-foreground" },
  }
  const { label, className } = variants[status]
  return (
    <Badge variant="secondary" className={cn("text-[10px] font-medium", className)}>
      {label}
    </Badge>
  )
}

export function CampaignsContent({
  showHeaderAndFeatured = true,
  scrollContainer = true,
}: CampaignsContentProps) {
  const { openCreateCampaign } = useCreateCampaign()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<CampaignStatus[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [page, setPage] = useState(1)
  const [dateRange, setDateRange] = useState<string>("month")
  const [now, setNow] = useState(() => new Date())
  const [selectedAd, setSelectedAd] = useState<MockAd | null>(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])

  const statusCounts = useMemo(() => {
    const acc: Record<CampaignStatus, number> = {
      draft: 0,
      scheduled: 0,
      active: 0,
      paused: 0,
      ended: 0,
    }
    mockCampaigns.forEach((c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1
    })
    return acc
  }, [])

  const overviewStats = useMemo(() => {
    const active = mockCampaigns.filter((c) => c.status === "active").length
    const totalSpent = mockCampaigns.reduce((s, c) => s + c.spent, 0)
    const totalImpressions = mockCampaigns.reduce((s, c) => s + c.impressions, 0)
    const totalClicks = mockCampaigns.reduce((s, c) => s + c.clicks, 0)
    return { active, totalSpent, totalImpressions, totalClicks }
  }, [])

  const topCampaigns = useMemo(
    () =>
      [...mockCampaigns]
        // .filter((c) => c.spent > 0 || c.impressions > 0)
        // .sort((a, b) => b.spent - a.spent)
        .slice(0, 6),
    []
  )

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        !search ||
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.objective.toLowerCase().includes(searchLower)
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(campaign.status)
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCampaigns.length / PAGE_SIZE)
  )
  const paginatedCampaigns = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredCampaigns.slice(start, start + PAGE_SIZE)
  }, [filteredCampaigns, page])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  function resetAllFilters() {
    setStatusFilter([])
  }

  function toggleStatus(value: CampaignStatus) {
    setStatusFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
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

          {/* Row 1: Overview — 4 cards in one line */}
          <div className="mb-5 animate-fade-in-up delay-75">
            <div className="mb-3">
              <h3 className="font-display text-base font-bold text-foreground">Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Campaign performance at a glance</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-5 shadow-sm ring-1 ring-black/5 dark:ring-white/5 flex flex-col gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/12 text-[hsl(var(--primary))]">
                  <Megaphone className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl font-bold tabular-nums text-foreground">{overviewStats.active}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Active</p>
                <p className="text-xs text-muted-foreground">campaigns running</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-5 shadow-sm ring-1 ring-black/5 dark:ring-white/5 flex flex-col gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl font-bold tabular-nums text-foreground truncate">{formatCurrency(overviewStats.totalSpent)}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Spent</p>
                <p className="text-xs text-muted-foreground">total budget used</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-5 shadow-sm ring-1 ring-black/5 dark:ring-white/5 flex flex-col gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:text-blue-400">
                  <Eye className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl font-bold tabular-nums text-foreground">{formatNumber(overviewStats.totalImpressions)}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Impressions</p>
                <p className="text-xs text-muted-foreground">total views</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-5 shadow-sm ring-1 ring-black/5 dark:ring-white/5 flex flex-col gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/12 text-violet-600 dark:text-violet-400">
                  <MousePointer className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl font-bold tabular-nums text-foreground">{formatNumber(overviewStats.totalClicks)}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Clicks</p>
                <p className="text-xs text-muted-foreground">total interactions</p>
              </div>
            </div>
          </div>

          {/* Row 2: Ads — 4 cards in one line */}
          <div className="mb-5 animate-fade-in-up delay-75">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Ads</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{mockAds.length} creatives</p>
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
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border-0 border-transparent hover:border-2 hover:border-primary bg-card/95 shadow-sm ring-1 ring-black/5 dark:ring-white/5 aspect-[8/4] transition-all duration-200 hover:scale-[1.1] hover:ring-[hsl(var(--primary))]/30 hover:shadow-lg origin-center text-left"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" aria-hidden />
                  <div className="absolute bottom-0 left-0 right-0 p-3 overflow-hidden">
                    <p className="translate-y-full opacity-0 text-lg font-semibold text-white drop-shadow-lg transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:whitespace-normal group-hover:break-words">
                      {ad.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <Dialog open={!!selectedAd} onOpenChange={(open) => !open && setSelectedAd(null)}>
              <DialogContent className="max-w-4xl w-full p-0 gap-0 overflow-hidden border-0 aspect-video" hideClose style={{ borderRadius: 0 }}>
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
                <h3 className="font-display text-base font-bold text-foreground">Top Campaigns</h3>
                <p className="text-xs text-muted-foreground mt-0.5">By spend — best performers</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="btn-gelatine h-8 gap-1.5 text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                aria-label="View all top campaigns"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            {topCampaigns.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/95 p-10 text-center text-sm text-muted-foreground">
                No campaign spend yet. Launch a campaign to see performance here.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 overflow-visible">
                {topCampaigns.map((campaign) => {
                  return (
                    <div
                      key={campaign.id}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border-0 border-transparent hover:border-2 hover:border-primary bg-card/95 shadow-sm ring-1 ring-black/5 dark:ring-white/5 aspect-[8/4] transition-all duration-200 hover:scale-[1.1] hover:ring-[hsl(var(--primary))]/30 hover:shadow-lg origin-center"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" aria-hidden />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 overflow-hidden">
                        <p className="translate-y-full opacity-0 text-lg font-semibold text-white drop-shadow-lg transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:whitespace-normal group-hover:break-words">
                          {campaign.name}
                        </p>
                        {campaign.channelNames && campaign.channelNames.length > 0 && (
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
          <div className="mb-3 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up delay-150">
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
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
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
          <div
            className={cn(
              "mb-6 flex flex-wrap items-center gap-4 animate-fade-in-up",
              showHeaderAndFeatured ? "delay-100" : ""
            )}
          >
            <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5">
              <Megaphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {filteredCampaigns.length === 0
                  ? "0 campaigns"
                  : totalPages === 1
                    ? `${filteredCampaigns.length} campaigns`
                    : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filteredCampaigns.length)} of ${filteredCampaigns.length} campaigns`}
              </span>
            </div>
          </div>

          {viewMode === "card" && (
            <div
              className={cn(
                "animate-fade-in-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
                showHeaderAndFeatured ? "delay-200" : ""
              )}
            >
              {filteredCampaigns.length === 0 ? (
                <div className="col-span-full flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card text-muted-foreground text-sm">
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
                paginatedCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
                  >
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center gap-4">
                        <CircularQtyProgress
                          totalQty={campaign.totalQty}
                          usedQty={campaign.usedQty}
                          size={56}
                          strokeWidth={5}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {campaignAdId(campaign.id)}
                          </p>
                          <h3 className="font-display text-sm font-bold tracking-tight text-foreground line-clamp-2 mt-0.5">
                            {campaign.name}
                          </h3>
                          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Check className="h-3 w-3 shrink-0" />
                            Published on {format(parseISO(campaign.startDate), "d MMMM yyyy")}
                          </p>
                        </div>
                        <StatusBadge status={campaign.status} />
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {campaign.objective}
                      </p>
                      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="h-3.5 w-3.5" />
                            Budget
                          </span>
                          <span className="font-medium tabular-nums text-foreground">
                            {formatCurrency(campaign.budget)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5" />
                            Spent
                          </span>
                          <span className="font-medium tabular-nums text-foreground">
                            {formatCurrency(campaign.spent)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {formatDate(campaign.startDate)} –{" "}
                          {formatDate(campaign.endDate)}
                        </div>
                        {campaign.impressions > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Tv className="h-3.5 w-3.5 shrink-0" />
                            {formatNumber(campaign.impressions)} impr.
                            {campaign.clicks > 0 && (
                              <>
                                {" · "}
                                <MousePointer className="h-3.5 w-3.5 shrink-0" />
                                {formatNumber(campaign.clicks)} clicks
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Tv className="h-3.5 w-3.5" />
                          {campaign.channelsCount} channels
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
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
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground w-14">
                      Qty
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Campaign
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Budget / Spent
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Dates
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Performance
                    </TableHead>
                    <TableHead className="h-12 px-6 text-right font-display font-semibold text-muted-foreground">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-32 px-6 text-center text-muted-foreground"
                      >
                        No campaigns match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCampaigns.map((campaign) => (
                      <TableRow
                        key={campaign.id}
                        className="border-border transition-colors hover:bg-accent/50"
                      >
                        <TableCell className="px-6 py-4">
                          <CircularQtyProgress
                            totalQty={campaign.totalQty}
                            usedQty={campaign.usedQty}
                            size={40}
                            strokeWidth={3}
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div>
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              {campaignAdId(campaign.id)}
                            </p>
                            <p className="font-display font-medium text-foreground">
                              {campaign.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {campaign.objective}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <StatusBadge status={campaign.status} />
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="text-sm">
                            <span className="font-medium text-foreground">
                              {formatCurrency(campaign.budget)}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              / {formatCurrency(campaign.spent)} spent
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(campaign.startDate)} –{" "}
                          {formatDate(campaign.endDate)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                          {campaign.impressions > 0 ? (
                            <>
                              {formatNumber(campaign.impressions)} impr.
                              {campaign.clicks > 0 && (
                                <> · {formatNumber(campaign.clicks)} clicks</>
                              )}
                            </>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
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
            </div>
          </div>
        </aside>
      </div>
    </div>
  )

  if (scrollContainer) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto">{inner}</div>
    )
  }
  return <>{inner}</>
}
