"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import type { Campaign } from "@/types/campaigns"
import {
  mockAds,
  type MockAd,
  mockBrands,
  mockSitesAndLocations,
  mockChannelsAndGenres,
} from "@/services"
import { CircularQtyProgress } from "./circular-qty-progress"
import { StatusBadge, getStatusGroup } from "./status-badge"
import { format, parseISO, isValid } from "date-fns"
import { Megaphone, Pause, Play, Trash2 } from "lucide-react"

const FALLBACK_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4"

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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDateTime(iso: string): string {
  try {
    const d = parseISO(iso)
    return isValid(d) ? format(d, "d MMM yyyy, h:mm a") : iso
  } catch {
    return iso
  }
}

function campaignAdId(campaignId: string): string {
  const num = campaignId.replace(/\D/g, "") || "0"
  return `#ADS${num.padStart(6, "0")}`
}

interface CampaignDetailsDrawerProps {
  open: boolean
  campaign: Campaign | null
  onOpenChange: (open: boolean) => void
  onRequestStatusChange: (campaignId: string, action: "pause" | "resume") => void
  onRequestDelete: (campaignId: string) => void
  onPreviewAd: (ad: MockAd) => void
}

export function CampaignDetailsDrawer({
  open,
  campaign,
  onOpenChange,
  onRequestStatusChange,
  onRequestDelete,
  onPreviewAd,
}: CampaignDetailsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] overflow-hidden rounded-t-2xl border border-border bg-background/95 px-0 pb-0 pt-2 shadow-2xl backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl">
        {campaign ? (
          <InnerDetails
            campaign={campaign}
            onRequestStatusChange={onRequestStatusChange}
            onRequestDelete={onRequestDelete}
            onPreviewAd={onPreviewAd}
          />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            No campaign selected.
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}

interface InnerDetailsProps {
  campaign: Campaign
  onRequestStatusChange: (campaignId: string, action: "pause" | "resume") => void
  onRequestDelete: (campaignId: string) => void
  onPreviewAd: (ad: MockAd) => void
}

function InnerDetails({
  campaign,
  onRequestStatusChange,
  onRequestDelete,
  onPreviewAd,
}: InnerDetailsProps) {
  const imageKey = campaign.image ?? ""
  const brand = brandByImage[imageKey]
  const site = siteByImage[imageKey]
  const genre = genreByImage[imageKey]
  const linkedAd = primaryAdByCampaignId[campaign.id]

  const ad: MockAd | null =
    linkedAd ??
    (campaign.image || campaign.name
      ? ({
          id: `campaign-${campaign.id}`,
          campaignId: campaign.id,
          name: campaign.name,
          image: (campaign.image ?? undefined) as MockAd["image"],
          video: FALLBACK_VIDEO,
          duration: "Preview",
        } as MockAd)
      : null)

  const primaryChannel = campaign.channelNames?.[0]
  const unitPrice =
    campaign.totalQty > 0 ? campaign.budget / campaign.totalQty : 0

  const brandLabel = brand?.title ?? "Brand not set"
  const siteChannelLabel = site
    ? `${site.subtitle ?? site.name}${
        primaryChannel ? ` · ${primaryChannel}` : ""
      }`
    : (primaryChannel ?? "Site / channel not set")
  const genreLabel = genre?.name ?? "Genre not set"
  const adLabel = ad
    ? `${ad.name} · ${ad.duration ?? "duration not set"}`
    : campaign.image || campaign.name
      ? `${campaign.name} · preview`
      : "No ad file linked"

  const statusGroup = getStatusGroup(campaign.status)
  const isRunning = statusGroup === "running"
  const isPaused = statusGroup === "paused"
  const canToggle = isRunning || isPaused
  const toggleAction: "pause" | "resume" = isRunning ? "pause" : "resume"
  const toggleLabel = isRunning ? "Pause" : "Play"

  return (
    <div className="flex h-full w-full flex-col px-4 pb-4 pt-2 text-sm sm:px-6 sm:pb-6">
      <div className="flex items-stretch gap-6 py-3">
        <div className="flex items-start gap-6">
          <button
            type="button"
            onClick={() => {
              if (ad) onPreviewAd(ad)
            }}
            className="group relative w-40 aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm"
          >
            {(ad?.image ?? campaign.image) ? (
              <Image
                src={ad?.image ?? (campaign.image as string)}
                alt={campaign.name}
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
              {campaignAdId(campaign.id)}
            </p>
            <p className="truncate font-display text-xl font-semibold tracking-tight text-foreground">
              {campaign.name}
            </p>
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Created {formatDateTime(campaign.createdAt)}
            </p>
            <div className="mt-1">
              <StatusBadge status={campaign.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 flex-1 items-center gap-8 pl-6 text-xs">
          <div className="col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Brand
              </p>
              <p className="text-sm font-medium text-foreground">{brandLabel}</p>
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
              <p className="text-sm font-medium text-foreground">{adLabel}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Approved
              </p>
              <p className="text-sm font-medium text-foreground">
                {campaign.status !== "draft" ? "Yes" : "No"}
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
                {campaign.usedQty} / {campaign.totalQty}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total
              </p>
              <p className="text-sm font-medium text-foreground">
                {formatCurrency(campaign.budget)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-3 sm:px-4">
          <CircularQtyProgress
            totalQty={campaign.totalQty}
            usedQty={campaign.usedQty}
            size={100}
            strokeWidth={9}
            textSize="lg"
          />
        </div>

        <div className="flex flex-col items-start justify-center gap-3 pl-4 text-xs">
          {canToggle && (
            <Button
              type="button"
              onClick={() => onRequestStatusChange(campaign.id, toggleAction)}
              variant="secondary"
              className={cn(
                "inline-flex btn-gelatine w-full items-center justify-start gap-1.5 text-sm font-medium py-4 text-white",
                isRunning
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-emerald-500 hover:bg-emerald-700 text-white"
              )}
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
            onClick={() => onRequestDelete(campaign.id)}
            variant="destructive"
            className="inline-flex btn-gelatine w-full items-center justify-start gap-1.5 text-sm font-medium text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

