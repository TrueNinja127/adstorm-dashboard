"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateCampaign } from "@/contexts/create-campaign-context"
import { STATE_NAME_TO_ABBR } from "@/lib/us-state-abbr"
import { Building2, MapPin, Tv, Sparkles, ChevronLeft, ChevronRight, ChevronDown, Info, Check, Newspaper, Trophy, Clapperboard, Baby, BookOpen, Laugh, Film, Radio, CalendarIcon, Plus, Trash2, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, parseISO, isValid, addMonths } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockBrands, mockChannelsAndGenres, mockSitesAndLocations } from "@/services"

/** URL for a US state outline SVG (Borderly API). */
function getStateMapSvgUrl(stateName: string, selected: boolean): string {
  const abbr = STATE_NAME_TO_ABBR[stateName]?.toLowerCase() || stateName.toLowerCase().replace(/\s+/g, "-")
  const fill = "ffffff"
  const stroke = selected ? "ffffff" : "ffffff"
  return `https://borderly.dev/${abbr}.svg?fill=${fill}&stroke=${stroke}&strokeWidth=1`
}

type ObjectiveType = "brands" | "sites" | "channels" | "ai"
type PublishType = "auto" | "direct"

const OBJECTIVE_OPTIONS: { id: ObjectiveType; label: string; icon: typeof Building2 }[] = [
  { id: "brands", label: "Brands", icon: Building2 },
  { id: "sites", label: "Sites & Locations", icon: MapPin },
  { id: "channels", label: "Channels & Genres", icon: Tv },
  { id: "ai", label: "AI Assistant", icon: Sparkles },
]

type SelectionItem = { id: string; name: string; image: string }

const MOCK_AI_OPTIONS: SelectionItem[] = [
  { id: "ai-1", name: "AI Campaign 1", image: "/images/ai/campaign-1.jpg" },
  { id: "ai-2", name: "AI Campaign 2", image: "/images/ai/campaign-2.jpg" },
]
const GENRE_OPTIONS: { id: string; label: string; icon: typeof Newspaper }[] = [
  { id: "News", label: "News", icon: Newspaper },
  { id: "Sports", label: "Sports", icon: Trophy },
  { id: "Entertainment", label: "Entertainment", icon: Clapperboard },
  { id: "Kids", label: "Kids", icon: Baby },
  { id: "Documentary", label: "Documentary", icon: BookOpen },
  { id: "Comedy", label: "Comedy", icon: Laugh },
  { id: "Drama", label: "Drama", icon: Film },
  { id: "Reality", label: "Reality", icon: Radio },
]
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
]
const AD_DURATIONS = ["15s", "30s", "45s", "1m"]
const POPULAR_CPM_VALUES = [2, 5, 10, 15, 25]
const MOCK_ADS: { id: string; name: string; duration: string; image: string }[] = [
  { id: "ad1", name: "Summer Sale 2024", duration: "30s", image: "/images/ads/summer-sale.jpg" },
  { id: "ad2", name: "Product Launch", duration: "15s", image: "/images/ads/product-launch.jpg" },
  { id: "ad3", name: "Brand Story", duration: "1m", image: "/images/ads/brand-story.jpg" },
  { id: "ad4", name: "Holiday Promo", duration: "45s", image: "/images/ads/holiday-promo.jpg" },
]

const DAYS_OF_WEEK: { value: number; label: string }[] = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
]

type TimeWindowEntry = { startTime: string; endTime: string; counts: string }

const DEFAULT_TIME_WINDOW: TimeWindowEntry = { startTime: "00:00", endTime: "23:59", counts: "5" }

const TIMEZONE_OPTIONS: { value: string; label: string }[] = [
  { value: "America/New_York", label: "Eastern (America/New_York)" },
  { value: "America/Chicago", label: "Central (America/Chicago)" },
  { value: "America/Denver", label: "Mountain (America/Denver)" },
  { value: "America/Los_Angeles", label: "Pacific (America/Los_Angeles)" },
  { value: "America/Phoenix", label: "Arizona (America/Phoenix)" },
  { value: "America/Anchorage", label: "Alaska (America/Anchorage)" },
  { value: "Pacific/Honolulu", label: "Hawaii (Pacific/Honolulu)" },
  { value: "UTC", label: "UTC" },
  { value: "Europe/London", label: "London (Europe/London)" },
  { value: "Europe/Paris", label: "Paris (Europe/Paris)" },
  { value: "Europe/Berlin", label: "Berlin (Europe/Berlin)" },
  { value: "Asia/Tokyo", label: "Tokyo (Asia/Tokyo)" },
  { value: "Asia/Shanghai", label: "Shanghai (Asia/Shanghai)" },
  { value: "Australia/Sydney", label: "Sydney (Australia/Sydney)" },
]

const HOUR_OPTIONS_12 = Array.from({ length: 12 }, (_, i) => {
  const v = i === 0 ? "12" : String(i).padStart(2, "0")
  return { value: v, label: v }
})
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => {
  const v = String(i).padStart(2, "0")
  return { value: v, label: v }
})
const AM_PM_OPTIONS = [{ value: "AM", label: "AM" }, { value: "PM", label: "PM" }]

const timeSelectTriggerClass =
  "h-9 min-w-0 border-0 bg-transparent shadow-none focus:ring-0 text-white text-sm data-[placeholder]:text-white/50 [&>span]:line-clamp-1 [&>svg]:hidden"
const timeSelectContentClass = "z-[120] min-w-0 border-[#333] bg-[#1a1a1a] text-white rounded-lg"

/** Parse 24h "HH:mm" into 12h display: hour01-12, minute, ampm */
function parseTime12(value: string): { hour12: string; minute: string; ampm: "AM" | "PM" } {
  if (!value || !value.includes(":")) return { hour12: "12", minute: "00", ampm: "AM" }
  const [h, m] = value.split(":")
  const h24 = Math.min(23, Math.max(0, parseInt(h?.replace(/\D/g, "") || "0", 10)))
  const minute = String(Math.min(59, Math.max(0, parseInt(m?.replace(/\D/g, "") || "0", 10)))).padStart(2, "0")
  if (h24 === 0) return { hour12: "12", minute, ampm: "AM" }
  if (h24 < 12) return { hour12: String(h24).padStart(2, "0"), minute, ampm: "AM" }
  if (h24 === 12) return { hour12: "12", minute, ampm: "PM" }
  return { hour12: String(h24 - 12).padStart(2, "0"), minute, ampm: "PM" }
}

/** Convert 12h + AM/PM to 24h "HH:mm" */
function to24h(hour12: string, minute: string, ampm: string): string {
  const m = minute.padStart(2, "0")
  const h12 = parseInt(hour12, 10) || 12
  if (ampm === "AM") {
    const h24 = hour12 === "12" ? 0 : h12
    return `${String(h24).padStart(2, "0")}:${m}`
  }
  const h24 = hour12 === "12" ? 12 : h12 + 12
  return `${String(h24).padStart(2, "0")}:${m}`
}

function TimeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { hour12, minute, ampm } = parseTime12(value)
  return (
    <div className="flex items-center gap-0 rounded-xl border border-[#333] bg-[#2a2a2a] pl-3 pr-2 py-0.5 min-w-[7.5rem]">
      <Select value={hour12} onValueChange={(h) => onChange(to24h(h, minute, ampm))}>
        <SelectTrigger className={cn(timeSelectTriggerClass, "w-7 px-0 justify-center")}>
          <SelectValue placeholder="12" />
        </SelectTrigger>
        <SelectContent className={timeSelectContentClass}>
          {HOUR_OPTIONS_12.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="focus:bg-[#2a2a2a] focus:text-white">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-white/70 text-sm font-medium select-none">:</span>
      <Select value={minute} onValueChange={(m) => onChange(to24h(hour12, m, ampm))}>
        <SelectTrigger className={cn(timeSelectTriggerClass, "w-8 px-0 justify-center")}>
          <SelectValue placeholder="00" />
        </SelectTrigger>
        <SelectContent className={timeSelectContentClass}>
          {MINUTE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="focus:bg-[#2a2a2a] focus:text-white">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={ampm} onValueChange={(a) => onChange(to24h(hour12, minute, a))}>
        <SelectTrigger className={cn(timeSelectTriggerClass, "w-10 px-0 justify-center font-medium")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={timeSelectContentClass}>
          {AM_PM_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="focus:bg-[#2a2a2a] focus:text-white">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ChevronDown className="h-4 w-4 shrink-0 text-white/50 pointer-events-none" aria-hidden />
    </div>
  )
}

// Same step count for both flows so progress bar uses one scale (no jump when selecting type).
const TOTAL_STEPS = 10

const STEP_ORDER_DIRECT: string[] = [
  "objective", "selection", "publishType", "channels", "regions", "pricing", "duration", "ad", "additionalSettings", "name",
]
const STEP_ORDER_AUTO: string[] = [
  "objective", "selection", "publishType", "genres", "regions", "cpm", "duration", "ad", "additionalSettings", "name",
]

function getStepOrder(publishType: PublishType | null): string[] {
  if (publishType === "direct") return STEP_ORDER_DIRECT
  if (publishType === "auto") return STEP_ORDER_AUTO
  return ["objective", "selection", "publishType"]
}

// Deterministic gradient from name for selection card thumbnails
const CARD_GRADIENTS = [
  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
  "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
  "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
]
function getCardGradient(name: string, index: number) {
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length]
}

const CONFETTI_COLORS = ["#d13447", "#ffbf00", "#263672"]

type ConfettiPiece = {
  leftStart: number
  leftEnd: number
  delay: number
  duration: number
  size: number
  color: string
  opacity: number
  rotation: number
}

function ConfettiLayer() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const count = 301
    const next: ConfettiPiece[] = []

    for (let i = 0; i < count; i++) {
      const size = 1 + Math.floor(Math.random() * 8) // random(8)
      const left = 1 + Math.floor(Math.random() * 100) // random(100)
      const leftEnd = left + Math.floor(Math.random() * 15) // l + random(15)

      next.push({
        leftStart: left,
        leftEnd,
        delay: Math.random(), // random()
        duration: 4 + Math.random(), // 4 + random()
        size,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        opacity: 0.5 + Math.random(), // random() + 0.5
        rotation: Math.random() * 360,
      })
    }

    setPieces(next)
  }, [])

  if (!pieces.length) return null

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((piece, index) => (
          <div
            key={index}
            className="confetti-piece"
            style={{
              width: `${piece.size}px`,
              height: `${piece.size * 0.4}px`,
              backgroundColor: piece.color,
              opacity: Math.min(piece.opacity, 1),
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              transform: `rotate(${piece.rotation}deg)`,
              // CSS custom props used inside keyframes
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              "--left-start": `${piece.leftStart}%`,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              "--left-end": `${piece.leftEnd}%`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .confetti-piece {
          position: absolute;
          top: -10%;
          left: var(--left-start);
          border-radius: 9999px;
          animation-name: confetti-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes confetti-fall {
          0% {
            top: -10%;
            left: var(--left-start);
          }
          100% {
            top: 110%;
            left: var(--left-end);
          }
        }
      `}</style>
    </>
  )
}

export function CreateCampaignDialog() {
  const { isOpen, closeCreateCampaign } = useCreateCampaign()
  const [stepIndex, setStepIndex] = useState(0)
  const [objective, setObjective] = useState<ObjectiveType | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [publishType, setPublishType] = useState<PublishType | null>(null)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [maxPricePerPlay, setMaxPricePerPlay] = useState("")
  const [quantity, setQuantity] = useState("")
  const [maxPerHour, setMaxPerHour] = useState("")
  const [maxPerDay, setMaxPerDay] = useState("")
  const [cpm, setCpm] = useState("")
  const [adDuration, setAdDuration] = useState("")
  const [selectedAdIds, setSelectedAdIds] = useState<string[]>([])
  const [configureAdditional, setConfigureAdditional] = useState<boolean | null>(null)
  const [scheduleStart, setScheduleStart] = useState("")
  const [scheduleEnd, setScheduleEnd] = useState("")
  const [openStartCalendar, setOpenStartCalendar] = useState(false)
  const [openEndCalendar, setOpenEndCalendar] = useState(false)
  const [timezone, setTimezone] = useState("")
  const [timeWindows, setTimeWindows] = useState<TimeWindowEntry[]>([{ ...DEFAULT_TIME_WINDOW }])
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([])
  const [campaignName, setCampaignName] = useState("")
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [failedAdImages, setFailedAdImages] = useState<Set<string>>(new Set())
  const [phase, setPhase] = useState<"form" | "processing" | "completed">("form")
  const [showCongratsOverlay, setShowCongratsOverlay] = useState(false)
  const shouldAdvanceAfterPublishType = useRef(false)
  const hasAppliedOpenDefaults = useRef(false)
  const processingCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const completedCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const hasInitializedChannelsFromSelection = useRef(false)

  const stepOrder = useMemo(() => getStepOrder(publishType), [publishType])
  const currentStepId = stepOrder[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === stepOrder.length - 1
  const isFormPhase = phase === "form"

  // When user clicks auto/direct, advance to next step after state updates (so stepOrder is the full 10-step flow).
  useEffect(() => {
    if (shouldAdvanceAfterPublishType.current && publishType !== null && currentStepId === "publishType") {
      shouldAdvanceAfterPublishType.current = false
      setStepIndex((i) => Math.min(i + 1, stepOrder.length - 1))
    }
  }, [publishType, currentStepId, stepOrder.length])

  // When dialog opens, apply default values for schedule, timezone, days, and time windows.
  useEffect(() => {
    if (isOpen && !hasAppliedOpenDefaults.current) {
      hasAppliedOpenDefaults.current = true
      setScheduleStart(format(new Date(), "yyyy-MM-dd"))
      setScheduleEnd(format(addMonths(new Date(), 1), "yyyy-MM-dd"))
      setTimezone("America/New_York")
      setSelectedDaysOfWeek([0, 1, 2, 3, 4, 5, 6])
      setTimeWindows([{ ...DEFAULT_TIME_WINDOW }])
    }
    if (!isOpen) {
      hasAppliedOpenDefaults.current = false
      setPhase("form")
    }
  }, [isOpen])

  // Preload Lottie files when dialog opens so animations play without network delay later.
  useEffect(() => {
    if (!isOpen) return
    if (typeof window === "undefined") return

    const sources = [
      "/lottie/videos.lottie",
      "/lottie/congratulation.lottie",
      "/lottie/confirm.lottie",
    ]
    sources.forEach((src) => {
      fetch(src).catch(() => {
        // ignore preload errors; runtime effect will handle real load/fail
      })
    })
  }, [isOpen])

  // Simulate processing phase completion. Replace with real API handling when hooked up.
  useEffect(() => {
    if (phase !== "processing") return

    const timer = setTimeout(() => {
      setPhase("completed")
      setShowCongratsOverlay(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [phase])

  function handleCongratsClose() {
    setShowCongratsOverlay(false)
    closeCreateCampaign()
    resetForm()
  }

  // Setup processing animation
  useEffect(() => {
    if (phase !== "processing") return
    if (typeof window === "undefined") return
    const canvas = processingCanvasRef.current
    if (!canvas) return

    let animation: any

    import("@lottiefiles/dotlottie-web")
      .then(({ DotLottie }) => {
        animation = new DotLottie({
          canvas,
          src: "/lottie/videos.lottie",
          autoplay: true,
          loop: true,
        })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load DotLottie for processing animation", error)
      })

    return () => {
      if (animation) {
        animation.destroy()
      }
    }
  }, [phase])

  // Setup completion animation: play congratulation once, then confirm once.
  useEffect(() => {
    if (phase !== "completed") return
    if (typeof window === "undefined") return
    const canvas = completedCanvasRef.current
    if (!canvas) return

    let animation: any
    let cancelled = false

    import("@lottiefiles/dotlottie-web")
      .then(({ DotLottie }) => {
        if (cancelled) return

        const playConfirm = () => {
          if (cancelled) return
          if (animation) {
            animation.destroy()
            animation = null
          }
          animation = new DotLottie({
            canvas,
            src: "/lottie/confirm.lottie",
            autoplay: true,
            loop: false,
          })
        }

        animation = new DotLottie({
          canvas,
          src: "/lottie/congratulation.lottie",
          autoplay: true,
          loop: false,
        })

        animation.addEventListener?.("complete", playConfirm)
      })
      .catch((error) => {
        console.error("Failed to load DotLottie for completion animation", error)
      })

    return () => {
      cancelled = true
      if (animation) {
        animation.destroy()
      }
    }
  }, [phase])

  const selectionList = useMemo((): SelectionItem[] => {
    if (objective === "brands") {
      return mockBrands.map((brand) => ({
        id: brand.id,
        name: brand.title,
        image: brand.image,
      }))
    }
    if (objective === "sites") {
      return mockSitesAndLocations.map((site) => ({
        id: site.id,
        name: site.name,
        image: site.image,
      }))
    }
    if (objective === "channels") {
      // When objective is channels, let users pick concrete channels up-front (not genres).
      return mockChannelsAndGenres
        .filter((item) => item.type === "channel")
        .map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
        }))
    }
    if (objective === "ai") return MOCK_AI_OPTIONS
    return []
  }, [objective])

  // Channels actually available for the "channels" step, based on earlier selections.
  const availableChannelsForStep = useMemo(() => {
    // Only concrete channels (exclude genres here; genres are handled in the auto flow).
    const allChannels = mockChannelsAndGenres.filter((c) => c.type === "channel")

    if (objective === "brands" && selectedItems.length > 0) {
      const selectedBrandIds = new Set(selectedItems)
      const sitesForBrands = mockSitesAndLocations.filter((s) =>
        selectedBrandIds.has(s.brandId),
      )
      const siteIds = new Set(sitesForBrands.map((s) => s.id))
      return allChannels.filter((ch) => siteIds.has(ch.siteId))
    }

    if (objective === "sites" && selectedItems.length > 0) {
      const selectedSiteIds = new Set(selectedItems)
      return allChannels.filter((ch) => selectedSiteIds.has(ch.siteId))
    }

    if (objective === "channels" && selectedItems.length > 0) {
      const selectedChannelIds = new Set(selectedItems)
      return allChannels.filter((ch) => selectedChannelIds.has(ch.id))
    }

    // Fallback: all channels.
    return allChannels
  }, [objective, selectedItems])

  // When entering the "channels" step for the first time, default-select all derived channels.
  useEffect(() => {
    if (
      currentStepId !== "channels" ||
      hasInitializedChannelsFromSelection.current ||
      !isFormPhase
    ) {
      return
    }

    hasInitializedChannelsFromSelection.current = true

    if (availableChannelsForStep.length && selectedChannels.length === 0) {
      setSelectedChannels(availableChannelsForStep.map((ch) => ch.id))
    }
  }, [
    currentStepId,
    isFormPhase,
    availableChannelsForStep,
    selectedChannels.length,
  ])

  function toggleSelection(id: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  function handleNext() {
    if (!isFormPhase) return

    if (isLastStep) {
      // Start processing phase instead of closing immediately
      setPhase("processing")
      return
    }
    setStepIndex((i) => Math.min(i + 1, stepOrder.length - 1))
  }

  function handleBack() {
    setStepIndex((i) => Math.max(0, i - 1))
  }

  function resetForm() {
    setPhase("form")
    setStepIndex(0)
    setObjective(null)
    setSelectedItems([])
    setPublishType(null)
    setSelectedChannels([])
    setSelectedGenres([])
    setSelectedRegions([])
    setMaxPricePerPlay("")
    setQuantity("")
    setMaxPerHour("")
    setMaxPerDay("")
    setCpm("")
    setAdDuration("")
    setSelectedAdIds([])
    setConfigureAdditional(null)
    setScheduleStart(format(new Date(), "yyyy-MM-dd"))
    setScheduleEnd(format(addMonths(new Date(), 1), "yyyy-MM-dd"))
    setOpenStartCalendar(false)
    setOpenEndCalendar(false)
    setTimezone("America/New_York")
    setTimeWindows([{ ...DEFAULT_TIME_WINDOW }])
    setSelectedDaysOfWeek([0, 1, 2, 3, 4, 5, 6])
    setCampaignName("")
    setFailedImages(new Set())
    setFailedAdImages(new Set())
    hasInitializedChannelsFromSelection.current = false
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      closeCreateCampaign()
      resetForm()
    }
  }

  const canProceed = (): boolean => {
    if (!isFormPhase) return false
    switch (currentStepId) {
      case "objective":
        return objective != null
      case "selection":
        return selectedItems.length > 0
      case "publishType":
        return publishType != null
      case "channels":
        return selectedChannels.length > 0
      case "genres":
        return selectedGenres.length > 0
      case "regions":
        return selectedRegions.length > 0
      case "pricing":
        return !!(maxPricePerPlay && quantity && maxPerHour && maxPerDay)
      case "cpm":
        return !!cpm
      case "duration":
        return !!adDuration
      case "ad":
        return selectedAdIds.length > 0
      case "additionalSettings":
        return configureAdditional !== null && (configureAdditional === false || true)
      case "name":
        return !!campaignName.trim()
      default:
        return true
    }
  }

  // Use fixed total steps so progress is one scale (10 steps). Cap at 100% so we never show >100% before the real last step.
  const progressPercent = Math.min(100, ((stepIndex + 1) / TOTAL_STEPS) * 100)

  function handleGoBack() {
    closeCreateCampaign()
    resetForm()
  }
  const hasPriorChannelSelection = objective === "channels" && selectedItems.length > 0

  const congratsOverlay =
    typeof document === "undefined" || !showCongratsOverlay
      ? null
      : createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
            <div className="relative w-full h-full max-h-screen flex items-center justify-center overflow-hidden">
              <ConfettiLayer />
              <div className="relative z-10 flex flex-col items-center gap-6 text-center px-4">
                <div className="w-56 h-56 sm:w-72 sm:h-72 bg-transparent">
                  <canvas
                    ref={completedCanvasRef}
                    className="w-full h-full"
                    aria-label="Congratulations animation"
                  />
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-white">
                  Congratulations on your new Campaign! 🎉
                </p>
                <p className="text-sm sm:text-base text-white/70 max-w-md mx-auto">
                  You&apos;re all set. Sit back and watch your campaign perform.
                </p>
                <Button
                  type="button"
                  onClick={handleCongratsClose}
                  className="mt-2 rounded-full bg-white text-[#0a0a0a] hover:bg-[#f0f0f0] px-6 py-2.5 text-sm font-medium"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )

  return (
    <>
      {!showCongratsOverlay && (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogContent
        hideClose
        className="sm:max-w-4xl h-[80vh] absolute top-[47vh] overflow-hidden rounded-2xl border-0 bg-transparent shadow-none flex flex-col p-0 gap-0"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Top info bar */}
        <div className="mx-8 rounded-t-xl">
        <div className="shrink-0 flex items-center justify-center gap-3 w-full py-2 px-3 bg-[#1a1a1a] text-white text-sm rounded-xl">
          <div className="flex items-center justify-center w-6 h-6 rounded-full shrink-0">
            <Info className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="flex-1 text-center text-xs">
            Creating a new Campaign? Keep in mind info can&apos;t be transferred across Campaigns.
          </span>
          <button
            type="button"
            onClick={handleGoBack}
            className="shrink-0 rounded-full px-4 py-2 text-xs font-medium bg-[#2a2a2a] text-white hover:bg-[#333] transition-colors"
          >
            Go back
          </button>
        </div>
        </div>

        <DialogHeader
          className="shrink-0 flex-row items-center justify-between space-y-0 py-4 px-6 rounded-t-xl mt-6 bg-[#0a0a0a] border border-[#0a0a0a]"
        >
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="ADStorm" width={120} height={32} className="h-8 w-auto" />
            <DialogTitle className="sr-only">Create Campaign</DialogTitle>
          </div>
          <span className="text-sm font-medium text-white">Welcome, Tn!</span>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col justify-center overflow-y-auto bg-[#0a0a0a] px-6 py-8 border border-[#0a0a0a]">
          {phase === "form" && (
          <div className="pr-4 space-y-8">
            {/* Step 1: Objective */}
            {currentStepId === "objective" && (
              <div className="space-y-8 pl-16">
                <p className="text-2xl font-semibold text-white">
                  What is your objective for creating a campaign?
                </p>
                <div className="flex flex-wrap gap-3">
                  {OBJECTIVE_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const selected = objective === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                        setObjective(opt.id)
                        handleNext()
                      }}
                        className={cn(
                          "flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all",
                          selected
                            ? "bg-white text-[#0a0a0a] shadow-lg"
                            : "bg-[#2a2a2a] text-white hover:bg-[#333]"
                        )}
                      >
                        {/* <Icon className="h-4 w-4 shrink-0" /> */}
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Selection (brands/sites/channels) – card grid with images */}
            {currentStepId === "selection" && (
              <div className="space-y-6 pl-12">
                <div className="space-y-2 pl-4">
                  <p className="text-2xl font-semibold text-white">
                    Which {objective === "brands" ? "brands" : objective === "sites" ? "sites & locations" : objective === "channels" ? "channels" : "options"} would you like to use?
                  </p>
                  <p className="text-sm text-white/60">
                    Select one or more. You can change this later.
                  </p>
                </div>
                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pl-4">
                    <span className="text-xs font-medium text-white/70">
                      {selectedItems.length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedItems([])}
                      className="text-xs font-medium text-white/70 hover:text-white underline underline-offset-2"
                    >
                      Clear all
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[320px] overflow-y-auto pr-2 pl-4 pt-1 pb-6">
                  {selectionList.map((item, index) => {
                    const isSelected = selectedItems.includes(item.id)
                    const initial = item.name.charAt(0).toUpperCase()
                    const showImage = item.image && !failedImages.has(item.name)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSelection(item.id, selectedItems, setSelectedItems)}
                        className={cn(
                          "group relative rounded-xl overflow-hidden border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
                          isSelected
                            ? "border-white shadow-lg shadow-white/20 scale-[1.02]"
                            : "border-[#333] hover:border-[#555] hover:shadow-md"
                        )}
                      >
                        {/* Image area – use item image or gradient fallback */}
                        <div className="aspect-[16/10] w-full relative bg-[#1a1a1a]">
                          {showImage ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 33vw"
                              onError={() => setFailedImages((prev) => new Set([...prev, item.name]))}
                            />
                          ) : (
                            <div
                              className="absolute inset-0 flex items-center justify-center text-white/90"
                              style={{ background: getCardGradient(item.name, index) }}
                            >
                              <span className="text-2xl font-bold drop-shadow-sm">{initial}</span>
                            </div>
                          )}
                        </div>
                        {/* Label */}
                        <div className={cn(
                          "px-3 py-2.5 bg-[#1a1a1a] border-t border-[#2a2a2a]",
                          isSelected && "bg-[#252525] border-white/10"
                        )}>
                          <span className="text-sm font-medium text-white line-clamp-2">{item.name}</span>
                        </div>
                        {/* Selected badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0a0a0a]">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Publish type */}
            {currentStepId === "publishType" && (
              <div className="space-y-8 pl-16">
                <p className="text-2xl font-semibold text-white">
                  How would you like to publish it?
                </p>
                <div className="flex flex-wrap gap-3">
                  {(["auto", "direct"] as const).map((value) => {
                    const selected = publishType === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          shouldAdvanceAfterPublishType.current = true
                          setPublishType(value)
                        }}
                        className={cn(
                          "flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all",
                          selected ? "bg-white text-[#0a0a0a] shadow-lg" : "bg-[#2a2a2a] text-white hover:bg-[#333]"
                        )}
                      >
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 4a: Channels (Direct) – card grid with images, same style as selection step */}
            {currentStepId === "channels" && (
              <div className="space-y-8 pl-12">
                <div className="space-y-2 pl-4">
                  <p className="text-2xl font-semibold text-white">
                    {hasPriorChannelSelection
                      ? "Please check selected channels again."
                      : "Which channels would you like to use?"}
                  </p>
                  <p className="text-sm text-white/60">
                    {hasPriorChannelSelection
                      ? "We’ve preselected the channels you chose earlier. You can unselect any that you don’t want to include."
                      : "Select one or more. You can change this later."}
                  </p>
                </div>
                {selectedChannels.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pl-4">
                    <span className="text-xs font-medium text-white/70">
                      {selectedChannels.length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedChannels([])}
                      className="text-xs font-medium text-white/70 hover:text-white underline underline-offset-2"
                    >
                      Clear all
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[320px] overflow-y-auto pr-2 pb-6 pl-4 pt-1">
                  {availableChannelsForStep.map((ch, index) => {
                    const isSelected = selectedChannels.includes(ch.id)
                    const showImage = ch.image && !failedImages.has(ch.name)
                    const initial = ch.name.charAt(0).toUpperCase()
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => toggleSelection(ch.id, selectedChannels, setSelectedChannels)}
                        className={cn(
                          "group relative rounded-xl overflow-hidden border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
                          isSelected
                            ? "border-white shadow-lg shadow-white/20 scale-[1.02]"
                            : "border-[#333] hover:border-[#555] hover:shadow-md"
                        )}
                      >
                        <div className="aspect-[16/10] w-full relative bg-[#1a1a1a]">
                          {showImage ? (
                            <Image
                              src={ch.image}
                              alt={ch.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 33vw"
                              onError={() => setFailedImages((prev) => new Set([...prev, ch.name]))}
                            />
                          ) : (
                            <div
                              className="absolute inset-0 flex items-center justify-center text-white/90"
                              style={{ background: getCardGradient(ch.name, index) }}
                            >
                              <span className="text-2xl font-bold drop-shadow-sm">{initial}</span>
                            </div>
                          )}
                        </div>
                        <div className={cn(
                          "px-3 py-2.5 bg-[#1a1a1a] border-t border-[#2a2a2a]",
                          isSelected && "bg-[#252525] border-white/10"
                        )}>
                          <span className="text-sm font-medium text-white line-clamp-2">{ch.name}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0a0a0a]">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 4b: Genres (Auto) – multi-select pill grid with icon + label + selection indicator */}
            {currentStepId === "genres" && (
              <div className="space-y-8 pl-16">
                <p className="text-2xl font-semibold text-white">
                  Which genres would you like to use?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-2">
                  {GENRE_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const selected = selectedGenres.includes(opt.id)
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleSelection(opt.id, selectedGenres, setSelectedGenres)}
                        className={cn(
                          "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all text-left border bg-[#0a0a0a]",
                          selected
                            ? "border-white/30 text-white shadow-inner"
                            : "border-[#404040] text-white/90 hover:bg-[#333] hover:border-[#555]"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-inherit opacity-90" />
                        <span className="flex-1 min-w-0 truncate">{opt.label}</span>
                        <span
                          className={cn(
                            "flex shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                            selected
                              ? "bg-white border-white text-[#0a0a0a]"
                              : "border-white/50 bg-transparent"
                          )}
                        >
                          {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 4c: Regions (Auto) – multi-select pill grid with icon + label + selection indicator */}
            {currentStepId === "regions" && (
              <div className="space-y-8 pl-16">
                <p className="text-2xl font-semibold text-white">
                  Which regions would you like to target?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-2">
                  {US_STATES.map((state) => {
                    const selected = selectedRegions.includes(state)
                    return (
                      <button
                        key={state}
                        type="button"
                        onClick={() => toggleSelection(state, selectedRegions, setSelectedRegions)}
                        className={cn(
                          "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all text-left border bg-[#0a0a0a]",
                          selected
                            ? "border-white/30 text-white shadow-inner"
                            : "border-[#404040] text-white/90 hover:bg-[#333] hover:border-[#555]"
                        )}
                      >
                        <span className="flex shrink-0 w-8 h-8 flex items-center justify-center rounded overflow-hidden">
                          <img
                            src={getStateMapSvgUrl(state, selected)}
                            alt=""
                            className="w-6 h-6 object-contain"
                            width={24}
                            height={24}
                          />
                        </span>
                        <span className="flex-1 min-w-0 truncate">{state}</span>
                        <span
                          className={cn(
                            "flex shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                            selected
                              ? "bg-white border-white text-[#0a0a0a]"
                              : "border-white/50 bg-transparent"
                          )}
                        >
                          {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 5a: Pricing (Direct) */}
            {currentStepId === "pricing" && (
              <div className="space-y-8 pl-16">
                <div className="space-y-2">
                  <p className="text-2xl font-semibold text-white">
                    Please configure pricing and delivery restrictions.
                  </p>
                  <p className="text-sm text-white/60">
                    Set max price per play, quantity, and delivery caps.
                  </p>
                </div>
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label className="text-white/90">Max Price Per Play ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={maxPricePerPlay}
                      onChange={(e) => setMaxPricePerPlay(e.target.value)}
                      className="rounded-full h-12 px-6 py-3.5 text-sm font-medium bg-[#0a0a0a] border-[#333] text-white placeholder:text-white/50 hover:bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90">Quantity (impressions)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="rounded-full h-12 px-6 py-3.5 text-sm font-medium bg-[#0a0a0a] border-[#333] text-white placeholder:text-white/50 hover:bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90">Max Per Hour</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={maxPerHour}
                      onChange={(e) => setMaxPerHour(e.target.value)}
                      className="rounded-full h-12 px-6 py-3.5 text-sm font-medium bg-[#0a0a0a] border-[#333] text-white placeholder:text-white/50 hover:bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90">Max Per Day</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={maxPerDay}
                      onChange={(e) => setMaxPerDay(e.target.value)}
                      className="rounded-full h-12 px-6 py-3.5 text-sm font-medium bg-[#0a0a0a] border-[#333] text-white placeholder:text-white/50 hover:bg-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5b: CPM (Auto) */}
            {currentStepId === "cpm" && (
              <div className="space-y-8 pl-16">
                <p className="text-2xl font-semibold text-white">
                  How much does it cost per 1,000 impressions?
                </p>
                <div className="flex flex-col gap-6">
                  <div className="relative max-w-[400px]">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                    <Input
                      type="number"
                      placeholder="Custom"
                      value={cpm}
                      onChange={(e) => setCpm(e.target.value)}
                      className="rounded-full h-12 w-full pl-10 pr-16 py-3.5 text-sm font-medium bg-[#0a0a0a] border-[#333] text-white placeholder:text-white/50 hover:bg-transparent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/50 pointer-events-none">
                      USD/1K
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                  {POPULAR_CPM_VALUES.map((val) => {
                    const selected = cpm === String(val)
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCpm(String(val))}
                        className={cn(
                          "rounded-full px-6 py-3.5 text-sm font-medium transition-all",
                          selected ? "bg-white text-[#0a0a0a] shadow-lg" : "bg-[#2a2a2a] text-white hover:bg-[#333]"
                        )}
                      >
                        ${val}
                      </button>
                    )
                  })}
                  </div>
                  
                </div>
              </div>
            )}

            {/* Step 6: Ad duration */}
            {currentStepId === "duration" && (
              <div className="space-y-8 pl-16">
                <p className="text-2xl font-semibold text-white">
                  How long should the AD duration be?
                </p>
                <div className="flex flex-wrap gap-3">
                  {AD_DURATIONS.map((d) => {
                    const selected = adDuration === d
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                        setAdDuration(d)
                        handleNext()
                      }}
                        className={cn(
                          "rounded-full px-6 py-3.5 text-sm font-medium transition-all",
                          selected ? "bg-white text-[#0a0a0a] shadow-lg" : "bg-[#2a2a2a] text-white hover:bg-[#333]"
                        )}
                      >
                        {d}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 7: Select AD – card grid with image, name, duration */}
            {currentStepId === "ad" && (
              <div className="space-y-6 pl-12">
                <div className="space-y-2 pl-4">
                  <p className="text-2xl font-semibold text-white">
                    Which AD would you like to use?
                  </p>
                  <p className="text-sm text-white/60">
                    Select one or more ads for this campaign.
                  </p>
                </div>
                {selectedAdIds.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pl-4">
                    <span className="text-xs font-medium text-white/70">
                      {selectedAdIds.length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedAdIds([])}
                      className="text-xs font-medium text-white/70 hover:text-white underline underline-offset-2"
                    >
                      Clear all
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[320px] overflow-y-auto pr-2 pl-4 pt-1 pb-6">
                  {MOCK_ADS.map((ad, index) => {
                    const isSelected = selectedAdIds.includes(ad.id)
                    const initial = ad.name.charAt(0).toUpperCase()
                    const showImage = ad.image && !failedAdImages.has(ad.id)
                    return (
                      <button
                        key={ad.id}
                        type="button"
                        onClick={() => toggleSelection(ad.id, selectedAdIds, setSelectedAdIds)}
                        className={cn(
                          "group relative rounded-xl overflow-hidden border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
                          isSelected
                            ? "border-white shadow-lg shadow-white/20 scale-[1.02]"
                            : "border-[#333] hover:border-[#555] hover:shadow-md"
                        )}
                      >
                        <div className="aspect-[16/10] w-full relative bg-[#1a1a1a]">
                          {showImage ? (
                            <Image
                              src={ad.image}
                              alt={ad.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 33vw"
                              onError={() => setFailedAdImages((prev) => new Set([...prev, ad.id]))}
                            />
                          ) : (
                            <div
                              className="absolute inset-0 flex items-center justify-center text-white/90"
                              style={{ background: getCardGradient(ad.name, index) }}
                            >
                              <span className="text-2xl font-bold drop-shadow-sm">{initial}</span>
                            </div>
                          )}
                        </div>
                        <div className={cn(
                          "px-3 py-2.5 bg-[#1a1a1a] border-t border-[#2a2a2a]",
                          isSelected && "bg-[#252525] border-white/10"
                        )}>
                          <span className="text-sm font-medium text-white line-clamp-2 block">{ad.name}</span>
                          <span className="text-xs text-white/60">{ad.duration}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0a0a0a]">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 8: Additional settings */}
            {currentStepId === "additionalSettings" && (
              <div className="space-y-8 pl-16">
                <p className="text-2xl font-semibold text-white">
                  Would you like to configure additional settings for schedule, timezone, and time windows?
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ].map(({ value, label }) => {
                    const selected = configureAdditional === value
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setConfigureAdditional(value)
                          if (value === false) handleNext()
                        }}
                        className={cn(
                          "flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all",
                          selected
                            ? "bg-white text-[#0a0a0a] shadow-lg"
                            : "bg-[#2a2a2a] text-white hover:bg-[#333]"
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
                {configureAdditional === true && (
                  <div className="grid gap-4 pt-6 border-t border-[#333]">
                    <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/70">Schedule start</Label>
                      <Popover open={openStartCalendar} onOpenChange={setOpenStartCalendar}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "w-full flex items-center justify-between gap-2 rounded-xl border border-[#333] bg-[#2a2a2a] px-3 py-2.5 text-sm text-left text-white hover:bg-[#333] transition-colors",
                              !scheduleStart && "text-white/50"
                            )}
                          >
                            <span>{scheduleStart ? format(parseISO(scheduleStart.length > 10 ? scheduleStart : scheduleStart + "T00:00:00"), "MMM d, yyyy") : "Pick a date"}</span>
                            <CalendarIcon className="h-4 w-4 shrink-0 opacity-70" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="z-[120] w-auto p-0 border-[#333] bg-[#1a1a1a]" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduleStart && isValid(parseISO(scheduleStart + "T00:00:00")) ? parseISO(scheduleStart + "T00:00:00") : undefined}
                            onSelect={(date) => {
                              setScheduleStart(date ? format(date, "yyyy-MM-dd") : "")
                              setOpenStartCalendar(false)
                            }}
                            defaultMonth={scheduleStart && isValid(parseISO(scheduleStart + "T00:00:00")) ? parseISO(scheduleStart + "T00:00:00") : new Date()}
                            classNames={{
                              months: "space-y-4",
                              month: "space-y-4",
                              caption: "flex justify-center pt-1 relative items-center",
                              caption_label: "text-sm font-medium text-white",
                              nav: "space-x-1 flex items-center",
                              nav_button: "flex h-8 w-8 items-center justify-center rounded-md bg-[#2a2a2a] border border-[#333] text-white hover:bg-[#333] p-0",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell: "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "h-9 w-9 text-center text-sm p-0 relative",
                              day: "h-9 w-9 p-0 font-normal text-white rounded-md hover:bg-[#2a2a2a] aria-selected:opacity-100",
                              day_selected: "!text-[#0a0a0a] bg-white hover:bg-white hover:!text-[#0a0a0a] focus:bg-white focus:!text-[#0a0a0a]",
                              day_today: "bg-[#2a2a2a] text-white",
                              day_outside: "text-white/40",
                              day_disabled: "text-white/30 opacity-50",
                              day_hidden: "invisible",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70">Schedule end</Label>
                      <Popover open={openEndCalendar} onOpenChange={setOpenEndCalendar}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "w-full flex items-center justify-between gap-2 rounded-xl border border-[#333] bg-[#2a2a2a] px-3 py-2.5 text-sm text-left text-white hover:bg-[#333] transition-colors",
                              !scheduleEnd && "text-white/50"
                            )}
                          >
                            <span>{scheduleEnd ? format(parseISO(scheduleEnd.length > 10 ? scheduleEnd : scheduleEnd + "T00:00:00"), "MMM d, yyyy") : "Pick a date"}</span>
                            <CalendarIcon className="h-4 w-4 shrink-0 opacity-70" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="z-[120] w-auto p-0 border-[#333] bg-[#1a1a1a]" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduleEnd && isValid(parseISO(scheduleEnd + "T00:00:00")) ? parseISO(scheduleEnd + "T00:00:00") : undefined}
                            onSelect={(date) => {
                              setScheduleEnd(date ? format(date, "yyyy-MM-dd") : "")
                              setOpenEndCalendar(false)
                            }}
                            defaultMonth={scheduleEnd && isValid(parseISO(scheduleEnd + "T00:00:00")) ? parseISO(scheduleEnd + "T00:00:00") : new Date()}
                            classNames={{
                              months: "space-y-4",
                              month: "space-y-4",
                              caption: "flex justify-center pt-1 relative items-center",
                              caption_label: "text-sm font-medium text-white",
                              nav: "space-x-1 flex items-center",
                              nav_button: "flex h-7 w-7 items-center justify-center rounded-md bg-[#2a2a2a] border border-[#333] text-white hover:bg-[#333] p-0",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell: "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "h-9 w-9 text-center text-sm p-0 relative",
                              day: "h-9 w-9 p-0 font-normal text-white rounded-md hover:bg-[#2a2a2a] aria-selected:opacity-100",
                              day_selected: "!text-[#0a0a0a] bg-white hover:bg-white hover:!text-[#0a0a0a] focus:bg-white focus:!text-[#0a0a0a]",
                              day_today: "bg-[#2a2a2a] text-white",
                              day_outside: "text-white/40",
                              day_disabled: "text-white/30 opacity-50",
                              day_hidden: "invisible",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70">Timezone</Label>
                      <Select value={timezone || undefined} onValueChange={setTimezone}>
                        <SelectTrigger className="rounded-xl bg-[#2a2a2a] border-[#333] text-white data-[placeholder]:text-white/50">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="z-[120] border-[#333] bg-[#1a1a1a] text-white">
                          {TIMEZONE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="focus:bg-[#2a2a2a] focus:text-white">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70">Days of week</Label>
                      <p className="text-xs text-white/50 mb-1.5">Select which days your ads can run (leave empty for all days)</p>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map((day) => {
                          const selected = selectedDaysOfWeek.includes(day.value)
                          return (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => {
                                setSelectedDaysOfWeek((prev) =>
                                  selected ? prev.filter((d) => d !== day.value) : [...prev, day.value].sort((a, b) => a - b)
                                )
                              }}
                              className={cn(
                                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                                selected
                                  ? "bg-white text-[#0a0a0a] shadow-lg"
                                  : "bg-[#2a2a2a] text-white hover:bg-[#333]"
                              )}
                            >
                              {day.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white/70">Time windows</Label>
                      <p className="text-xs text-white/50">Add one or more windows. Each has start time, end time, and count. Minimum 1 window.</p>
                      <div className="space-y-4">
                        {timeWindows.map((tw, index) => (
                          <div key={index} className="flex flex-wrap items-center gap-3">
                            {timeWindows.length > 1 && (
                              <span className="text-xs text-white/40 w-14 shrink-0">Window {index + 1}</span>
                            )}
                            <TimeSelector
                              value={tw.startTime}
                              onChange={(v) => {
                                const next = [...timeWindows]
                                next[index] = { ...next[index], startTime: v }
                                setTimeWindows(next)
                              }}
                            />
                            <TimeSelector
                              value={tw.endTime}
                              onChange={(v) => {
                                const next = [...timeWindows]
                                next[index] = { ...next[index], endTime: v }
                                setTimeWindows(next)
                              }}
                            />
                            <Input
                              type="number"
                              min={1}
                              placeholder="Count"
                              value={tw.counts}
                              onChange={(e) => {
                                const next = [...timeWindows]
                                next[index] = { ...next[index], counts: e.target.value }
                                setTimeWindows(next)
                              }}
                              className="rounded-xl h11 w-24 bg-[#2a2a2a] border border-[#333] text-white placeholder:text-white/40 text-center tabular-nums"
                            />
                            {timeWindows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setTimeWindows((prev) => prev.filter((_, i) => i !== index))}
                                className="shrink-0 rounded-lg p-2 text-white/50 hover:text-white hover:bg-[#333] transition-colors"
                                aria-label="Remove time window"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setTimeWindows((prev) => [...prev, { ...DEFAULT_TIME_WINDOW }])}
                          className="flex items-center gap-2 rounded-xl border border-dashed border-[#444] bg-[#1a1a1a] px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:border-white/30 hover:bg-[#222] transition-colors w-full sm:w-auto"
                        >
                          <Plus className="h-4 w-4 shrink-0" />
                          Add another window
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 9: Campaign name */}
            {currentStepId === "name" && (
              <div className="space-y-8 pl-16">
                <p className="text-2xl font-semibold text-white">
                  Lastly, what would you like to name your Campaign?
                </p>
                <div>
                  <Input
                    placeholder="My Campaign Name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="rounded-full h-12 max-w-md w-full bg-[#0a0a0a] border-[#333] text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            )}
          </div>
          )}

          {phase === "processing" && (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="w-56 h-56 sm:w-64 sm:h-64 bg-transparent">
                <canvas
                  ref={processingCanvasRef}
                  className="w-full h-full"
                  aria-label="Processing animation"
                />
              </div>
              <p className="text-lg sm:text-xl font-semibold text-white">
                Creating campaign...
              </p>
            </div>
          )}

          {phase === "completed" && (
            <div className="relative flex flex-col items-center justify-center h-full gap-6 text-center">
              <ConfettiLayer />
              <div className="w-56 h-56 sm:w-72 sm:h-72 bg-transparent relative z-10">
                <canvas
                  ref={completedCanvasRef}
                  className="w-full h-full"
                  aria-label="Congratulations animation"
                />
              </div>
              <div className="space-y-2 relative z-10">
                <p className="text-xl sm:text-2xl font-semibold text-white">
                  Congratulations on your new Campaign! 🎉
                </p>
                <p className="text-sm sm:text-base text-white/70 max-w-md mx-auto">
                  You&apos;re all set. Sit back and watch your campaign perform.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col items-center justify-between gap-4 py-4 px-6 bg-[#0a0a0a]">
          <div className="w-full">
            <div className="h-1 w-full rounded-full bg-[#2a2a2a] overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {phase === "form" && (
            <div className={cn("flex items-center justify-between w-full gap-2 shrink-0", isFirstStep ? "justify-end" : "justify-between")}>
              {!isFirstStep && (
              <Button
                type="button"
                  onClick={handleBack}
                className="rounded-full bg-white text-[#0a0a0a] hover:bg-[#f0f0f0] disabled:opacity-50 disabled:pointer-events-none px-6 py-2.5 text-sm font-medium"
                >
                  <ChevronLeft className="h-4 w-4 inline-block" />
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="rounded-full bg-white text-[#0a0a0a] hover:bg-[#f0f0f0] disabled:opacity-50 disabled:pointer-events-none px-6 py-2.5 text-sm font-medium"
              >
                {isLastStep ? "Finish" : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1 inline-block" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
          </DialogContent>
        </Dialog>
      )}
      {congratsOverlay}
    </>
  )
}