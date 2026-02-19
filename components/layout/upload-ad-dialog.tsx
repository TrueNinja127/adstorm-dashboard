"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, X, Video, Loader2, CheckCircle2, Sparkles, Film, Play, Pause } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface UploadAdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function UploadAdDialog({ open, onOpenChange }: UploadAdDialogProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [adName, setAdName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  function handlePlayPause() {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  function handleVideoEnded() {
    setIsPlaying(false)
  }

  function handleVideoPlay() {
    setIsPlaying(true)
    setShowControls(true)
  }

  function handleVideoPause() {
    setIsPlaying(false)
  }

  function handleTimeUpdate() {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  function handleProgressChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value)
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!videoRef.current || !videoDuration) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * videoDuration
    
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  function validateAndSetFile(file: File) {
    if (!file.type.startsWith("video/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a video file only (MP4, MOV, AVI, etc.).",
      })
      return
    }

    setFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setVideoPreview(url)

    // Get video duration
    const video = document.createElement("video")
    video.preload = "metadata"
    video.src = url
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration)
    }
  }

  function handleFileSelect(file: File) {
    validateAndSetFile(file)
    setIsDragging(false)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isUploading) {
      setIsDragging(true)
    }
  }, [isUploading])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (isUploading) return

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [isUploading])

  function handleUpload() {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a video file to upload.",
      })
      return
    }

    if (!adName.trim()) {
      toast({
        variant: "destructive",
        title: "AD File Name required",
        description: "Please enter a name for your ad file.",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload with progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const increment = Math.random() * 15 + 5
        return Math.min(prev + increment, 100)
      })
    }, 150)

    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setTimeout(() => {
        setIsUploading(false)
        toast({
          variant: "success",
          title: "Upload successful",
          description: `"${adName}" has been uploaded successfully.`,
        })
        handleClose()
      }, 2000)
    }, 2000)
  }

  function handleCancelUpload() {
    setIsUploading(false)
    setUploadProgress(0)
  }

  function handleClose() {
    if (isUploading) {
      handleCancelUpload()
      return
    }
    cleanup()
    onOpenChange(false)
  }

  function cleanup() {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    setFile(null)
    setAdName("")
    setUploadProgress(0)
    setIsUploading(false)
    setIsDragging(false)
    setVideoPreview(null)
    setVideoDuration(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setShowControls(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  useEffect(() => {
    if (!open) {
      cleanup()
    }
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border-border/60 bg-gradient-to-b from-background via-background to-muted/30 shadow-2xl backdrop-blur-sm !grid-rows-[auto_1fr_auto]">
        <DialogHeader className="space-y-4 pb-4 border-b border-border/50 shrink-0">
          <div className="flex items-start gap-4">
            
            <div className="flex-1 space-y-1">
              <DialogTitle className="font-display text-2xl font-bold tracking-tight">
                Upload Video Ad
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto min-h-0">
          {/* Ad Name Input */}
          <div className="space-y-2.5 animate-fade-in">
            <Label htmlFor="ad-name" className="text-sm font-semibold text-foreground">
              AD File Name
            </Label>
            <Input
              id="ad-name"
              placeholder="e.g., Summer Sale 2024 Campaign"
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              disabled={isUploading}
              className="h-12 rounded-xl border-border bg-card/80 text-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>

          {/* Video Upload Zone */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">
              Video File
            </Label>
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
                isDragging
                  ? "border-primary bg-primary/10 scale-[1.01] shadow-lg shadow-primary/10"
                  : "border-border/60 bg-gradient-to-br from-muted/40 to-muted/20 hover:border-primary/50 hover:bg-muted/60",
                isUploading && "pointer-events-none opacity-60"
              )}
            >
              <input
                ref={fileInputRef}
                id="ad-file"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />

              {!file ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex w-full flex-col items-center justify-center gap-4 p-10 text-center transition-all"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-xl bg-muted/40" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:border-border group-hover:bg-card/80">
                      <svg 
                        className="h-7 w-7 text-muted-foreground transition-all group-hover:scale-110" 
                        viewBox="0 0 32 32" 
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m14.447 7.106c-.31-.155-.678-.139-.973.043-.295.183-.474.504-.474.851v6c0 .347.179.668.474.851.295.182.663.198.973.043l6-3c.339-.169.553-.515.553-.894s-.214-.725-.553-.894zm.553 2.512 2.764 1.382s-2.764 1.382-2.764 1.382z" />
                        <path d="m10 28v2c0 .552.448 1 1 1h10c.552 0 1-.448 1-1v-2c0-.552-.448-1-1-1s-1 .448-1 1v1h-8v-1c0-.552-.448-1-1-1s-1 .448-1 1z" />
                        <path d="m17 26v-7c0-.552-.448-1-1-1s-1 .448-1 1v7c0 .552.448 1 1 1s1-.448 1-1z" />
                        <path d="m14.707 20.707 1.293-1.293s1.293 1.293 1.293 1.293c.39.39 1.024.39 1.414 0s.39-1.024 0-1.414l-2-2c-.39-.391-1.024-.391-1.414 0l-2 2c-.39.39-.39 1.024 0 1.414s1.024.39 1.414 0z" />
                        <path d="m7.126 6.794c-2.861.321-5.126 2.907-5.126 6.086 0 2.12 1.012 3.984 2.529 5.077.695.651 1.61 1.043 2.607 1.043h3.864c.552 0 1-.448 1-1s-.448-1-1-1h-3.864c-.491 0-.936-.206-1.275-.535-.038-.038-.08-.072-.123-.102-1.053-.738-1.738-2.026-1.738-3.483 0-2.253 1.647-4.12 3.727-4.12.039 0 .077.001.115.002.476.016.897-.305 1.007-.768.416-1.751 1.86-3.074 3.606-3.074.66 0 1.28.191 1.815.523.454.281 1.05.156 1.352-.285.891-1.302 2.314-2.158 3.923-2.158 2.604 0 4.704 2.219 4.895 4.986.03.424.323.783.733.895 1.64.451 2.827 2.083 2.827 3.999 0 1.457-.685 2.745-1.738 3.483-.043.03-.085.064-.123.102-.339.329-.784.535-1.275.535h-3.864c-.552 0-1 .448-1 1s.448 1 1 1h3.864c.999 0 1.914-.393 2.615-1.05 1.51-1.088 2.521-2.951 2.521-5.07 0-2.602-1.522-4.811-3.639-5.7-.545-3.52-3.408-6.18-6.816-6.18-1.977 0-3.766.89-5.03 2.328-.64-.264-1.335-.408-2.06-.408-2.407 0-4.487 1.593-5.329 3.874z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground">
                      Drop your video here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Supported formats: MP4, MOV, AVI, WebM (Max 500MB)
                    </p>
                  </div>
                </button>
              ) : (
                <div className="p-5">
                  <div className="relative overflow-hidden rounded-xl border border-border bg-card/90 shadow-lg">
                    {videoPreview ? (
                      <div className="relative w-full bg-muted rounded-t-xl overflow-hidden group">
                        <div className="relative w-full flex items-center justify-center" style={{ height: '300px', maxHeight: '300px' }}>
                          <video
                            ref={videoRef}
                            src={videoPreview}
                            className="max-h-full max-w-full w-auto h-auto object-contain"
                            style={{ maxHeight: '300px', maxWidth: '100%' }}
                            muted
                            playsInline
                            onEnded={handleVideoEnded}
                            onPlay={handleVideoPlay}
                            onPause={handleVideoPause}
                            onTimeUpdate={handleTimeUpdate}
                            onClick={handlePlayPause}
                          />
                        </div>
                        
                        {/* Play Button Overlay - Hidden when playing */}
                        {!isPlaying && (
                          <button
                            type="button"
                            onClick={handlePlayPause}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity opacity-100"
                          >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-2 ring-white/30 hover:bg-white/30 transition-all hover:scale-110">
                              <Play className="h-6 w-6 text-white ml-1" fill="white" />
                            </div>
                          </button>
                        )}

                        {/* Video Controls Bar - Shown when playing */}
                        {isPlaying && showControls && (
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transition-opacity"
                            onMouseEnter={() => setShowControls(true)}
                            onMouseLeave={() => setShowControls(true)}
                          >
                            {/* Progress Bar */}
                            <div 
                              className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group/progress"
                              onClick={handleSeek}
                            >
                              <div 
                                className="h-full bg-primary rounded-full transition-all relative"
                                style={{ width: `${videoDuration ? (currentTime / videoDuration) * 100 : 0}%` }}
                              >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-primary opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={handlePlayPause}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                              >
                                <Pause className="h-4 w-4 text-white" fill="white" />
                              </button>
                              
                              <div className="flex-1 flex items-center gap-2 text-xs text-white tabular-nums">
                                <span>{formatDuration(currentTime)}</span>
                                <span>/</span>
                                <span>{videoDuration ? formatDuration(videoDuration) : '0:00'}</span>
                              </div>

                              {videoDuration && (
                                <div className="rounded-lg bg-black/50 px-2 py-1 backdrop-blur-sm">
                                  <span className="text-xs font-semibold text-white tabular-nums">
                                    {formatDuration(videoDuration)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center bg-muted rounded-t-xl" style={{ height: '300px' }}>
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 shrink-0 text-primary" />
                            <p className="truncate text-sm font-semibold text-foreground">
                              {file.name}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                            <span className="font-medium">{formatFileSize(file.size)}</span>
                            {videoDuration && (
                              <>
                                <span>•</span>
                                <span className="tabular-nums">{formatDuration(videoDuration)}</span>
                              </>
                            )}
                            <span>•</span>
                            <span className="uppercase">{file.type.split("/")[1] || "Video"}</span>
                            </div>
                            {isUploading && (
                              <>
                                <div className="flex items-center gap-2">
                                  {/* Small Circular Progress Chart */}
                                  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                                    <svg className="h-5 w-5 -rotate-90 transform" viewBox="0 0 36 36">
                                      {/* Background circle */}
                                      <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        className="text-secondary/30"
                                      />
                                      {/* Progress circle */}
                                      <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeDasharray={`${uploadProgress}, 100`}
                                        strokeLinecap="round"
                                        className={cn(
                                          "transition-all duration-300",
                                          uploadProgress === 100 ? "text-emerald-500" : "text-primary"
                                        )}
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      {uploadProgress === 100 ? (
                                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                      ) : (
                                        <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                                      )}
                                    </div>
                                  </div>
                                  <span className={cn(
                                    "font-bold tabular-nums",
                                    uploadProgress === 100 ? "text-emerald-500" : "text-primary"
                                  )}>
                                    {Math.round(uploadProgress)}%
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {isUploading ? (
                          <button
                            type="button"
                            onClick={handleCancelUpload}
                            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              cleanup()
                            }}
                            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-4 border-t border-border/50 shrink-0">
          <Button
            variant="outline"
            onClick={isUploading ? handleCancelUpload : handleClose}
            className="rounded-xl h-11 px-6 font-medium"
          >
            {isUploading ? "Cancel Upload" : "Cancel"}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !file || !adName.trim()}
            className="rounded-xl h-11 bg-primary px-6 font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:shadow-none disabled:scale-100"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Upload Video
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}
