"use client"

import Image from "next/image"
import { useState, useMemo } from "react"
import {
  Search,
  Tv,
  ArrowRight,
  LayoutGrid,
  List,
  Globe,
  Radio,
  Music2,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type ItemType = "channel" | "genre"

interface ChannelOrGenre {
  id: string
  type: ItemType
  name: string
  description: string
  /** Channel type (e.g. CTV, Radio) or genre category (e.g. News, Sports) */
  category: string
  image: string
  sitesCount: number
  /** For channels: number of genres; for genres: number of channels */
  secondaryCount: number
  available: boolean
}

const mockItems: ChannelOrGenre[] = [
  {
    id: "1",
    type: "channel",
    name: "Connected TV (CTV)",
    description: "Streaming and smart TV ad inventory with premium viewability and full-screen reach.",
    category: "CTV",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop",
    sitesCount: 48,
    secondaryCount: 12,
    available: true,
  },
  {
    id: "2",
    type: "channel",
    name: "OTT & Streaming",
    description: "Over-the-top video across apps and streaming platforms for cord-cutters and mobile viewers.",
    category: "OTT",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&h=200&fit=crop",
    sitesCount: 62,
    secondaryCount: 18,
    available: true,
  },
  {
    id: "3",
    type: "channel",
    name: "Radio",
    description: "Terrestrial and digital radio inventory for local and national audio campaigns.",
    category: "Radio",
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=200&h=200&fit=crop",
    sitesCount: 120,
    secondaryCount: 24,
    available: true,
  },
  {
    id: "4",
    type: "channel",
    name: "Podcast",
    description: "Host-read and programmatic podcast ads with engaged, loyal audiences.",
    category: "Podcast",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop",
    sitesCount: 85,
    secondaryCount: 14,
    available: true,
  },
  {
    id: "5",
    type: "channel",
    name: "Display",
    description: "Banner, native, and rich media across premium publisher sites.",
    category: "Display",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
    sitesCount: 200,
    secondaryCount: 22,
    available: true,
  },
  {
    id: "6",
    type: "channel",
    name: "Video",
    description: "In-stream and outstream video across web and in-app placements.",
    category: "Video",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop",
    sitesCount: 95,
    secondaryCount: 16,
    available: false,
  },
  {
    id: "7",
    type: "genre",
    name: "News",
    description: "Trusted news and current affairs from top publishers and broadcasters.",
    category: "News",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop",
    sitesCount: 44,
    secondaryCount: 8,
    available: true,
  },
  {
    id: "8",
    type: "genre",
    name: "Sports",
    description: "Live sports, highlights, and athletic content with high-engagement audiences.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop",
    sitesCount: 38,
    secondaryCount: 10,
    available: true,
  },
  {
    id: "9",
    type: "genre",
    name: "Entertainment",
    description: "Streaming, movies, TV, and entertainment content across platforms.",
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=200&fit=crop",
    sitesCount: 72,
    secondaryCount: 12,
    available: true,
  },
  {
    id: "10",
    type: "genre",
    name: "Technology",
    description: "Tech reviews, innovation, and gadget content for tech-savvy audiences.",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
    sitesCount: 56,
    secondaryCount: 9,
    available: true,
  },
  {
    id: "11",
    type: "genre",
    name: "Lifestyle",
    description: "Health, wellness, fashion, and home content for lifestyle advertisers.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop",
    sitesCount: 64,
    secondaryCount: 11,
    available: true,
  },
  {
    id: "12",
    type: "genre",
    name: "Finance",
    description: "Financial news, markets, and investing for professional and retail audiences.",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop",
    sitesCount: 28,
    secondaryCount: 6,
    available: false,
  },
]

interface ChannelsContentProps {
  showHeaderAndFeatured?: boolean
  scrollContainer?: boolean
}

type ViewMode = "card" | "list"

function getTypeIcon(type: ItemType): LucideIcon {
  return type === "channel" ? Tv : Music2
}

export function ChannelsContent({
  showHeaderAndFeatured = true,
  scrollContainer = true,
}: ChannelsContentProps) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("card")

  const categories = useMemo(() => {
    const set = new Set(mockItems.map((i) => i.category))
    return Array.from(set).sort()
  }, [])

  const typeCounts = useMemo(
    () => ({
      channel: mockItems.filter((i) => i.type === "channel").length,
      genre: mockItems.filter((i) => i.type === "genre").length,
    }),
    []
  )

  const categoryCounts = useMemo(() => {
    const acc: Record<string, number> = {}
    mockItems.forEach((i) => {
      acc[i.category] = (acc[i.category] ?? 0) + 1
    })
    return acc
  }, [])

  const availableCount = mockItems.filter((i) => i.available).length
  const unavailableCount = mockItems.filter((i) => !i.available).length

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      const matchesType =
        typeFilter.length === 0 || typeFilter.includes(item.type)
      const matchesCategory =
        categoryFilter.length === 0 || categoryFilter.includes(item.category)
      const matchesAvailability =
        availabilityFilter.length === 0 ||
        (availabilityFilter.includes("available") && item.available) ||
        (availabilityFilter.includes("unavailable") && !item.available)
      return matchesSearch && matchesType && matchesCategory && matchesAvailability
    })
  }, [search, typeFilter, categoryFilter, availabilityFilter])

  function resetAllFilters() {
    setTypeFilter([])
    setCategoryFilter([])
    setAvailabilityFilter([])
  }

  function toggleType(value: ItemType) {
    setTypeFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  function toggleCategory(value: string) {
    setCategoryFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  function toggleAvailability(value: "available" | "unavailable") {
    setAvailabilityFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  const inner = (
    <div className="px-8 py-8">
      {showHeaderAndFeatured && (
        <>
          <div className="mb-8 animate-fade-in-up">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
              Channels & Genres
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Browse ad channels and content genres to target the right audiences
              across CTV, radio, podcast, display, and more.
            </p>
          </div>

          <div className="mb-8 animate-fade-in-up delay-75">
            <h2 className="font-display text-[15px] font-bold text-foreground mb-4">
              Featured
            </h2>
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {mockItems.slice(0, 8).map((item) => {
                  const TypeIcon = getTypeIcon(item.type)
                  return (
                    <CarouselItem
                      key={item.id}
                      className="pl-2 md:pl-4 basis-full sm:basis-[85%] md:basis-[45%] lg:basis-[32%]"
                    >
                      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20">
                        <div className="flex h-40 items-center gap-4 p-5">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display font-semibold text-foreground truncate">
                              {item.name}
                            </p>
                            <div className="mt-0.5">
                              <Badge variant="secondary" className="text-[10px] font-medium">
                                {item.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="ml-1 text-[10px] font-medium border-border"
                              >
                                {item.type === "channel" ? "Channel" : "Genre"}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-[11px] font-medium",
                                  item.available ? "text-emerald-400" : "text-amber-400"
                                )}
                              >
                                {item.available ? "Available" : "Unavailable"}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="-left-2 h-9 w-9 rounded-full border-border bg-card text-foreground hover:bg-accent md:-left-4" />
              <CarouselNext className="-right-2 h-9 w-9 rounded-full border-border bg-card text-foreground hover:bg-accent md:-right-4" />
            </Carousel>
          </div>
        </>
      )}

      {!showHeaderAndFeatured && (
        <div className="mb-6 animate-fade-in-up">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
            Browse channels & genres
          </h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Search and filter by type, category, and availability.
          </p>
        </div>
      )}

      {/* Top bar: search (left) + view toggles (right) */}
      <div
        className={cn(
          "mb-4 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up",
          showHeaderAndFeatured ? "delay-100" : ""
        )}
      >
        <div className="relative min-w-[200px] max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search channels & genres..."
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
              "flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
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
              "flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
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

      {/* Main layout: content (left) + filters sidebar (right) */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Left: stats + content */}
        <div className="min-w-0 flex-1 order-2 lg:order-1">
          <div
            className={cn(
              "mb-6 flex flex-wrap items-center gap-4 animate-fade-in-up",
              showHeaderAndFeatured ? "delay-100" : ""
            )}
          >
            <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5">
              <Tv className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {mockItems.length} total
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_hsl(160,60%,45%,.5)]" />
              <span className="text-sm font-medium text-foreground">
                {availableCount} available
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
          {filteredItems.length === 0 ? (
            <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground text-sm">
              No channels or genres match your filters.
            </div>
          ) : (
            filteredItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type)
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold text-foreground truncate">
                        {item.name}
                      </p>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-[10px] font-medium">
                          {item.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-medium border-border">
                          {item.type === "channel" ? "Channel" : "Genre"}
                        </Badge>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "text-[11px] font-medium",
                            item.available ? "text-emerald-400" : "text-amber-400"
                          )}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        {item.sitesCount} sites
                      </span>
                      <span className="flex items-center gap-1.5">
                        {item.type === "channel" ? (
                          <Music2 className="h-3.5 w-3.5" />
                        ) : (
                          <Radio className="h-3.5 w-3.5" />
                        )}
                        {item.secondaryCount}{" "}
                        {item.type === "channel" ? "genres" : "channels"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))] shrink-0"
                    >
                      Explore
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
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
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Type
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Description
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Sites
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="h-12 px-6 text-right font-display font-semibold text-muted-foreground">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 px-6 text-center text-muted-foreground"
                  >
                    No channels or genres match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-border transition-colors hover:bg-accent/50"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <p className="font-display font-medium text-foreground">
                          {item.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className="text-xs font-medium border-border">
                        {item.type === "channel" ? "Channel" : "Genre"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[280px] px-6 py-4 text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {item.sitesCount}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",
                          item.available
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            item.available ? "bg-emerald-400" : "bg-amber-400"
                          )}
                        />
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]"
                      >
                        Explore
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
        </div>

        {/* Right: Filters sidebar */}
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
                  Type
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground hidden group-data-[state=open]:inline-block" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pb-3">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                      <Checkbox
                        checked={typeFilter.includes("channel")}
                        onCheckedChange={() => toggleType("channel")}
                      />
                      Channel ({typeCounts.channel})
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                      <Checkbox
                        checked={typeFilter.includes("genre")}
                        onCheckedChange={() => toggleType("genre")}
                      />
                      Genre ({typeCounts.genre})
                    </label>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="group flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-foreground hover:text-foreground">
                  Category
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground hidden group-data-[state=open]:inline-block" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pb-3 max-h-[240px] overflow-y-auto">
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Checkbox
                          checked={categoryFilter.includes(cat)}
                          onCheckedChange={() => toggleCategory(cat)}
                        />
                        {cat} ({categoryCounts[cat] ?? 0})
                      </label>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="group flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-foreground hover:text-foreground">
                  Availability
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground hidden group-data-[state=open]:inline-block" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pb-3">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                      <Checkbox
                        checked={availabilityFilter.includes("available")}
                        onCheckedChange={() => toggleAvailability("available")}
                      />
                      Available ({availableCount})
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                      <Checkbox
                        checked={availabilityFilter.includes("unavailable")}
                        onCheckedChange={() => toggleAvailability("unavailable")}
                      />
                      Unavailable ({unavailableCount})
                    </label>
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
    return <div className="flex-1 min-h-0 overflow-y-auto">{inner}</div>
  }
  return <>{inner}</>
}
