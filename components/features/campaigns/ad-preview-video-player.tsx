"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  SkipBack,
  SkipForward,
  Megaphone,
  Share2,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }
  return `${m}:${s.toString().padStart(2, "0")}`
}

export interface AdPreviewVideoPlayerProps {
  src: string
  title?: string
  className?: string
  autoPlay?: boolean
  onClose?: () => void
}

export function AdPreviewVideoPlayer({
  src,
  title,
  className,
  autoPlay = true,
}: AdPreviewVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasEnded, setHasEnded] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlsHover, setControlsHover] = useState(false)
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (hasEnded) {
      video.currentTime = 0
      setHasEnded(false)
      setCurrentTime(0)
      video.play()
      setIsPlaying(true)
      return
    }
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, hasEnded])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
    }
  }, [])

  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setHasEnded(true)
    setCurrentTime(duration)
  }, [duration])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current
      if (!video || duration <= 0) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pct = Math.max(0, Math.min(1, x / rect.width))
      const newTime = pct * duration
      video.currentTime = newTime
      setCurrentTime(newTime)
      if (hasEnded) {
        setHasEnded(false)
        setIsPlaying(true)
        video.play()
      }
    },
    [duration, hasEnded]
  )

  const handleVolumeChange = useCallback((value: number[]) => {
    const v = value[0] ?? 0
    setVolume(v)
    setIsMuted(v === 0)
    if (videoRef.current) videoRef.current.volume = v
  }, [])

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(1)
      setIsMuted(false)
      if (videoRef.current) videoRef.current.volume = 1
    } else {
      setVolume(0)
      setIsMuted(true)
      if (videoRef.current) videoRef.current.volume = 0
    }
  }, [isMuted])

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }, [])

  const skipBack = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, video.currentTime - 10)
    setCurrentTime(video.currentTime)
    if (hasEnded) {
      setHasEnded(false)
      video.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [hasEnded])

  const skipForward = useCallback(() => {
    const video = videoRef.current
    if (!video || duration <= 0) return
    const newTime = Math.min(duration, video.currentTime + 10)
    video.currentTime = newTime
    setCurrentTime(newTime)
    if (hasEnded) {
      setHasEnded(false)
      video.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [duration, hasEnded])

  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current)
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !controlsHover) setShowControls(false)
    }, 2500)
  }, [isPlaying, controlsHover])

  const cancelHideControls = useCallback(() => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
      hideControlsTimeoutRef.current = null
    }
    setShowControls(true)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = volume
  }, [volume])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return
    if (autoPlay) {
      video.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [src, autoPlay])

  useEffect(() => {
    if (isPlaying) scheduleHideControls()
    else cancelHideControls()
    return () => {
      if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current)
    }
  }, [isPlaying, scheduleHideControls, cancelHideControls])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault()
        togglePlay()
      }
      if (e.key === "f" || e.key === "F") {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault()
          toggleFullscreen()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [togglePlay, toggleFullscreen])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0
  const controlsVisible = showControls || !isPlaying || hasEnded

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-slate-900",
        className
      )}
      onMouseEnter={cancelHideControls}
      onMouseMove={cancelHideControls}
      onMouseLeave={() => {
        setControlsHover(false)
        if (isPlaying && !hasEnded) scheduleHideControls()
      }}
    >
      {/* Video area — fills entire 16:9 container */}
      <div className="absolute inset-0 bg-black">
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-fill"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onClick={togglePlay}
        />

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-full border-2 border-[hsl(var(--primary))]/25 border-t-[hsl(var(--primary))] animate-spin" />
            <p className="text-sm font-medium text-white/90">Loading video...</p>
          </div>
        )}

        {/* Center: translucent white play circle (reference style) */}
        {!isLoading && (!isPlaying || hasEnded) && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
            aria-label={hasEnded ? "Replay" : "Play"}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/50 shadow-xl transition-transform hover:scale-105 active:scale-95">
              {hasEnded ? (
                <RotateCcw className="h-10 w-10 text-white" />
              ) : (
                <Play className="h-10 w-10 ml-1 text-white" fill="currentColor" />
              )}
            </div>
          </button>
        )}
      </div>

      {/* Bottom control bar — overlaid on video with gradient */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 flex flex-col bg-[#040A17]/80 transition-opacity duration-300",
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onMouseEnter={() => setControlsHover(true)}
        onMouseLeave={() => setControlsHover(false)}
      >
        {/* Row 1: Progress bar with times — current (white) left, orange bar, duration (white) right */}
        <div className="flex flex-col w-full gap-3">
          <div
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            className="group/progress flex flex-1 cursor-pointer touch-none items-center"
            onClick={handleSeek}
          >
            <div className="h-1.5 w-full bg-[#040A17] transition-colors group-hover/progress:bg-[#040A17]">
              <div
                className="relative h-full bg-[hsl(var(--primary))] transition-[width]"
                style={{ width: `${progressPct}%` }}
              >
                <div className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-primary bg-[#040A17] shadow-md transition-opacity group-hover/progress:opacity-100 group-hover/progress:scale-100" />
              </div>
            </div>
          </div>
          <div className="flex items-center w-full justify-between gap-2 px-3">
            <span className="text-right text-[10px] tabular-nums text-white">
              {formatTime(currentTime)}
            </span>
            <span className="text-left text-[10px] tabular-nums text-white">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Row 2: Left (icon + title + meta) | Center (prev, play, next) | Right (volume, fullscreen) */}
        <div className="flex items-center justify-between gap-4 px-3 pb-3">
          {/* Left: branding icon + title + share + genre line */}
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))]">
              <Megaphone className="h-5 w-5" />
            </div> */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-base font-bold text-white">
                  {title || "Ad preview"}
                </p>
                <button
                  type="button"
                  className="shrink-0 rounded p-1 text-primary transition-colors hover:bg-white/10"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">Video ad</p>
            </div>
          </div>

          {/* Center: rewind (white), big orange play, forward (white) */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={skipBack}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              aria-label="Rewind 10 seconds"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying && !hasEnded ? (
                <Pause className="h-6 w-6" fill="currentColor" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
              )}
            </button>
            <button
              type="button"
              onClick={skipForward}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              aria-label="Forward 10 seconds"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          {/* Right: volume (white) + slider (orange), captions A, settings, fullscreen — all white icons */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
            <div className="flex items-center gap-2 ">
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <div className="w-40">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.05}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                  thumbClassName="!h-2.5 !w-2.5 !bg-primary"
                  trackClassName="!h-1 !bg-[#040A17]"
                />
              </div>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
