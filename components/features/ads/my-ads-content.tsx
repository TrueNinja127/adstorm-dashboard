"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Search,
  FileImage,
  Play,
  Pause,
  Clock,
  Download,
  Trash2,
  Megaphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, parseISO, isValid } from "date-fns"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AdPreviewVideoPlayer } from "@/components/features/campaigns/ad-preview-video-player"
import { mockAds, mockCampaigns, type MockAd } from "@/services"
import type { Campaign } from "@/types/campaigns"

interface MyAdsContentProps {
  showHeader?: boolean
  scrollContainer?: boolean
}

const FALLBACK_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4"

export function MyAdsContent({
  showHeader = true,
  scrollContainer = true,
}: MyAdsContentProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [ads, setAds] = useState<MockAd[]>(() => mockAds)
  const [selectedAd, setSelectedAd] = useState<MockAd | null>(null)
  const [pendingDeleteAd, setPendingDeleteAd] = useState<MockAd | null>(null)
  const [pendingDownloadAd, setPendingDownloadAd] = useState<MockAd | null>(null)
  const [autoPlay, setAutoPlay] = useState(true)

  const filteredAds = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return ads
    return ads.filter((ad) => {
      const name = ad.name.toLowerCase()
      return name.includes(query)
    })
  }, [search, ads])

  const mostPopularAd = useMemo(() => {
    if (ads.length === 0) return null
    return ads.reduce((best, current) => {
      const bestScore =
        (best.campaignIds && best.campaignIds.length > 0
          ? best.campaignIds.length
          : 1) ?? 1
      const currentScore =
        (current.campaignIds && current.campaignIds.length > 0
          ? current.campaignIds.length
          : 1) ?? 1
      return currentScore > bestScore ? current : best
    }, ads[0])
  }, [ads])

  function formatUploadedDate(value?: string): string {
    if (!value) return "—"
    try {
      const d = parseISO(value)
      if (!isValid(d)) return value
      return format(d, "M/d/yyyy")
    } catch {
      return value
    }
  }

  function formatCampaignDate(value: string): string {
    try {
      const d = parseISO(value)
      if (!isValid(d)) return value
      return format(d, "M/d/yyyy")
    } catch {
      return value
    }
  }

  function formatCampaignYear(value: string): string {
    try {
      const d = parseISO(value)
      if (!isValid(d)) return value
      return format(d, "yyyy")
    } catch {
      return value
    }
  }

  function handleDownload(ad: MockAd) {
    const url = ad.video ?? ad.image
    if (!url) return

    try {
      const link = document.createElement("a")
      link.href = url
      link.download = ad.name || "ad"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch {
      // best-effort only; ignore failures
    }
  }

  function handleConfirmDelete() {
    if (!pendingDeleteAd) return
    setAds((prev) => prev.filter((ad) => ad.id !== pendingDeleteAd.id))
    if (selectedAd?.id === pendingDeleteAd.id) {
      setSelectedAd(null)
    }
    setPendingDeleteAd(null)
  }

  const inner = (
    <div className="px-8 py-8">
      {showHeader && (
        <>
          {/* <div className="mb-4 animate-fade-in-up">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
              My Ads
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Browse, preview, and manage your ad creatives.
            </p>
          </div> */}

          {/* Hero section: single most popular ad with its campaigns */}
          {mostPopularAd ? (
            <div className="mb-8 grid gap-4 animate-fade-in-up delay-75 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.8fr)]">
              <div className="rounded-2xl shadow-sm flex flex-col justify-between min-h-[480px]">
                <div className="relative flex-1 rounded-2xl overflow-hidden">
                  <div className="flex h-full flex-col">
                    <div className="relative flex-1 overflow-hidden">
                      {mostPopularAd.image ? (
                        <Image
                          src={mostPopularAd.image}
                          alt={mostPopularAd.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <FileImage className="h-10 w-10 opacity-70" />
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
                      <button
                        type="button"
                        className="absolute btn-gelatine bottom-6 right-6 flex items-center justify-center"
                        onClick={() => {
                          setSelectedAd(mostPopularAd)
                          setAutoPlay(true)
                        }}
                        aria-label="Play ad"
                      >
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white shadow-xl backdrop-blur-sm">
                          <Play className="h-7 w-7 ml-0.5" />
                        </span>
                      </button>
                    </div>
                    <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex flex-col gap-1 text-left">
                      <p className="text-base text-primary font-bold">2026</p>
                      <p className="font-display text-3xl font-bold tracking-wide text-white drop-shadow-lg">
                        {mostPopularAd.name.toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-2 py-0.5 text-sm text-white/80">
                          <Clock className="h-4 w-4" />{" "}
                          {mostPopularAd.duration &&
                            `${mostPopularAd.duration}`}
                        </span>
                        <p className="text-sm text-white/70">
                          Uploaded:&nbsp;
                          {formatUploadedDate(mostPopularAd.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="rounded-3xl shadow-sm flex flex-col">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-bold tracking-wide text-foreground">
                      Campaigns
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold text-primary hover:bg-primary/10"
                    onClick={() => {
                      router.push("/campaigns")
                    }}
                  >
                    View all
                  </Button>
                </div>
                <div className="relative flex-1 overflow-hidden">
                  {(() => {
                    const targetCampaignIds =
                      mostPopularAd.campaignIds &&
                      mostPopularAd.campaignIds.length > 0
                        ? mostPopularAd.campaignIds
                        : [mostPopularAd.campaignId]

                    const campaignsForAd = mockCampaigns
                      .filter((c) => targetCampaignIds.includes(c.id))
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )

                    if (campaignsForAd.length === 0) {
                      return (
                        <div className="flex h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/40 text-xs text-muted-foreground">
                          <Megaphone className="h-6 w-6 opacity-60" />
                          <span>No campaigns linked to this ad.</span>
                        </div>
                      )
                    }

                    return (
                      <div className="relative h-full">
                        <div className="flex h-full flex-col gap-4 overflow-y-auto max-h-[430px] pr-3 -mr-3">
                          {campaignsForAd.map((campaign) => (
                            <div
                              key={campaign.id}
                              className="flex items-center gap-4 rounded-2xl bg-[#14151A] px-4 py-3 text-xs shadow-sm"
                            >
                              <div className="relative flex-shrink-0 overflow-hidden rounded-xl bg-muted text-muted-foreground w-28 aspect-[4/3]">
                                {campaign.image ? (
                                  <Image
                                    src={campaign.image}
                                    alt={campaign.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Megaphone className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                <p className="truncate font-display text-base font-semibold tracking-wide text-white">
                                  {campaign.name}
                                </p>
                                <p className="text-sm text-white/60">
                                  {formatCampaignYear(campaign.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </aside>
            </div>
          ) : (
            <div className="mb-8 flex h-[260px] items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/40 text-sm text-muted-foreground animate-fade-in-up delay-75">
              <div className="flex flex-col items-center gap-2">
                <FileImage className="h-8 w-8 opacity-60" />
                <span>No ads available yet.</span>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up delay-75">
        <div className="relative min-w-[200px] max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ads by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 rounded-xl bg-card border-border"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Autoplay preview</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2 rounded-xl border-border"
            onClick={() => setAutoPlay((prev) => !prev)}
          >
            {autoPlay ? (
              <>
                <Pause className="h-3.5 w-3.5 text-primary" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-600" />
                <span>Play</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div id="my-ads-grid" className="animate-fade-in-up delay-100">
        {filteredAds.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm text-muted-foreground">
            <FileImage className="h-10 w-10 opacity-50" />
            <p>No ads match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAds.map((ad) => {
              const campaignCount =
                ad.campaignIds && ad.campaignIds.length > 0
                  ? ad.campaignIds.length
                  : ad.campaignId
                    ? 1
                    : 0
              const hasVideo = Boolean(ad.video)

              return (
                <div
                  key={ad.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedAd(ad)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setSelectedAd(ad)
                    }
                  }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-card/95 via-card/98 to-background shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 text-left cursor-pointer"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-muted">
                    {ad.image ? (
                      <Image
                        src={ad.image}
                        alt={ad.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <FileImage className="h-6 w-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                      <Badge
                        variant="outline"
                        className="border-none bg-black/60 text-[11px] font-medium text-white/95 backdrop-blur-sm"
                      >
                        {ad.status === "pending"
                          ? "Pending approval"
                          : "Approved"}
                      </Badge>
                      <div className="flex items-center gap-2 text-[11px] text-white/80">
                        
                        {hasVideo && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPendingDownloadAd(ad)
                              }}
                              className="hidden group-hover:inline-flex btn-gelatine items-center gap-1 rounded-full bg-black/40 p-2 font-medium hover:bg-black/60 transition-colors"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-3 space-y-1">
                      <p className="line-clamp-2 font-display text-sm font-semibold text-white drop-shadow">
                        {ad.name}
                      </p>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-white/85">
                      <div className="flex items-center gap-2">
                        {ad.duration && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">{ad.duration}</span>
                          </span>
                        )}
                        <span className="truncate">
                          {formatUploadedDate(ad.uploadedAt)}
                        </span>
                        </div>
                        {campaignCount > 0 && (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Megaphone className="h-3 w-3" />
                            <span>
                              {campaignCount} campaign
                              {campaignCount > 1 ? "s" : ""}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
                autoPlay={autoPlay}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!pendingDownloadAd}
        onOpenChange={(open) => {
          if (!open) setPendingDownloadAd(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download ad?</AlertDialogTitle>
            <AlertDialogDescription>
              This will download{" "}
              <span className="font-medium text-foreground">
                {pendingDownloadAd?.name ?? "this ad"}
              </span>{" "}
              to your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDownloadAd) {
                  handleDownload(pendingDownloadAd)
                }
                setPendingDownloadAd(null)
              }}
            >
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={!!pendingDeleteAd}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteAd(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ad?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove{" "}
              <span className="font-medium text-foreground">
                {pendingDeleteAd?.name ?? "this ad"}
              </span>{" "}
              from your list. This action cannot be undone in this preview.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  if (scrollContainer) {
    return <div className="flex-1 min-h-0 overflow-y-auto">{inner}</div>
  }

  return <>{inner}</>
}
