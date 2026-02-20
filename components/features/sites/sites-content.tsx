"use client"

import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import {
  Search,
  MapPin,
  Globe,
  ArrowRight,
  LayoutGrid,
  List,
  MapPinned,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Radio,
  Building2,
  Wifi,
  ShoppingCart,
  MoreVertical,
  Eye,
  Tv,
  Music2,
} from "lucide-react"
import type { ChannelOrGenreType } from "@/types"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { UsStatesMap } from "./us-states-map"
import { cn } from "@/lib/utils"
import type { SiteOrLocationType, SiteOrLocation } from "@/types"
import { mockSitesAndLocations, US_STATES, mockBrands, mockChannelsAndGenres } from "@/services"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const mockItems = mockSitesAndLocations

interface SitesContentProps {
  showHeaderAndFeatured?: boolean
  scrollContainer?: boolean
}

type ViewMode = "card" | "list"

const PAGE_SIZE = 8

function getBrandName(brandId: string): string {
  const brand = mockBrands.find((b) => b.id === brandId)
  return brand?.title || "Unknown Brand"
}

function getChannelsBySiteId(siteId: string) {
  return mockChannelsAndGenres.filter((channel) => channel.siteId === siteId)
}

function getTypeIcon(type: ChannelOrGenreType) {
  return type === "channel" ? Tv : Music2
}

export function SitesContent({
  showHeaderAndFeatured = true,
  scrollContainer = true,
}: SitesContentProps) {
  const { addItem, isInCart } = useCart()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [regionFilter, setRegionFilter] = useState<string[]>(() => {
    const set = new Set(mockItems.map((i) => i.region))
    return Array.from(set).sort()
  })
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [selectedSite, setSelectedSite] = useState<SiteOrLocation | null>(null)
  const [page, setPage] = useState(1)

  const categories = useMemo(() => {
    const set = new Set(mockItems.map((i) => i.category))
    return Array.from(set).sort()
  }, [])

  const regionCounts = useMemo(() => {
    const acc: Record<string, number> = {}
    mockItems.forEach((i) => {
      acc[i.region] = (acc[i.region] ?? 0) + 1
    })
    return acc
  }, [])

  /** Only states that have at least one site/location (exclude 0 count) */
  const regions = useMemo(
    () => Object.keys(regionCounts).sort(),
    [regionCounts]
  )

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(searchLower) ||
        item.subtitle.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.region.toLowerCase().includes(searchLower)
      const matchesType =
        typeFilter.length === 0 || typeFilter.includes(item.type)
      const matchesCategory =
        categoryFilter.length === 0 || categoryFilter.includes(item.category)
      const matchesRegion =
        regionFilter.length === 0 || regionFilter.includes(item.region)
      const matchesAvailability =
        availabilityFilter.length === 0 ||
        (availabilityFilter.includes("available") && item.available) ||
        (availabilityFilter.includes("unavailable") && !item.available)
      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesRegion &&
        matchesAvailability
      )
    })
  }, [
    search,
    typeFilter,
    categoryFilter,
    regionFilter,
    availabilityFilter,
  ])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredItems.slice(start, start + PAGE_SIZE)
  }, [filteredItems, page])

  useEffect(() => {
    setPage(1)
  }, [search, typeFilter, categoryFilter, regionFilter, availabilityFilter])

  function resetAllFilters() {
    setTypeFilter([])
    setCategoryFilter([])
    setRegionFilter([])
    setAvailabilityFilter([])
  }

  function toggleType(value: SiteOrLocationType) {
    setTypeFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  function toggleCategory(value: string) {
    setCategoryFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  function toggleRegion(value: string) {
    setRegionFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  function toggleAvailability(value: "available" | "unavailable") {
    setAvailabilityFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  function handleAddToCart(item: (typeof mockItems)[0]) {
    if (isInCart(item.id)) {
      toast({
        title: "Already in cart",
        description: `${item.name} is already in your cart.`,
        variant: "default",
      })
      return
    }
    addItem(item)
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      variant: "success",
    })
  }

  const sitesCount = mockItems.filter((i) => i.type === "site").length
  const locationsCount = mockItems.filter((i) => i.type === "location").length
  const availableCount = mockItems.filter((i) => i.available).length
  const unavailableCount = mockItems.filter((i) => !i.available).length

  const typeCounts = useMemo(() => ({
    site: mockItems.filter((i) => i.type === "site").length,
    location: mockItems.filter((i) => i.type === "location").length,
  }), [])

  const categoryCounts = useMemo(() => {
    const acc: Record<string, number> = {}
    mockItems.forEach((i) => {
      acc[i.category] = (acc[i.category] ?? 0) + 1
    })
    return acc
  }, [])

  const featuredItems = mockItems.filter((i) => i.available).slice(0, 8)

  const inner = (
    <div className="px-8 py-8">
      {showHeaderAndFeatured && (
        <>
          <div className="mb-8 animate-fade-in-up">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
              Sites &amp; Locations
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Target specific publisher sites and physical locations for
              precise geo-based audience reach.
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
                {featuredItems.map((item) => (
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
                              {item.type === "site" ? "Site" : "Location"}
                            </Badge>
                          </div>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            Brand: {getBrandName(item.brandId)}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {item.cityName}, {item.stateName}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {item.channelsCount} channels · {item.citiesCount} cities
                          </p>
                          <div className="mt-1.5">
                            <span className="text-[11px] font-medium text-emerald-400">
                              Available
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 h-9 w-9 rounded-full border-border bg-card text-foreground hover:bg-accent md:-left-4" />
              <CarouselNext className="-right-2 h-9 w-9 rounded-full border-border bg-card text-foreground hover:bg-accent md:-right-4" />
            </Carousel>
          </div>
        </>
      )}

      {!showHeaderAndFeatured && (
        <div className="mb-4 animate-fade-in-up">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
            Browse all sites &amp; locations
          </h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Search and filter publisher sites and geographic locations below.
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
            placeholder="Search for sites or locations..."
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
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {filteredItems.length === 0
                  ? "0 items"
                  : totalPages === 1
                    ? `${filteredItems.length} items`
                    : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filteredItems.length)} of ${filteredItems.length} items`}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5">
              <MapPinned className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {locationsCount} locations
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
          className={`animate-fade-in-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${showHeaderAndFeatured ? "delay-200" : ""}`}
        >
          {filteredItems.length === 0 ? (
            <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground text-sm">
              No sites or locations match your filters.
            </div>
          ) : (
            paginatedItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
              >
                {/* Top: full-width image with overlay badges */}
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-secondary">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-lg bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                      {item.type === "site" ? "Site" : "Location"}
                    </span>
                  </div>
                </div>
                {/* Middle: name, verified, location */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display text-base font-bold tracking-tight text-foreground truncate">
                    {item.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    Brand: {getBrandName(item.brandId)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {item.cityName}, {item.stateName}
                  </p>
                  {/* Bottom: features (icons + text), metric, CTA */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Radio className="h-3.5 w-3.5" />
                      {item.channelsCount} Channels
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <Building2 className="h-3.5 w-3.5" />
                      {item.citiesCount} Cities
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <Wifi className="h-3.5 w-3.5" />
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{item.metric}</p>
                      <p className="text-sm font-bold tabular-nums text-foreground">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 btn-gelatine border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                      {isInCart(item.id) ? "In cart" : "Add to cart"}
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
          className={`animate-fade-in-up rounded-2xl border border-border bg-card overflow-hidden ${showHeaderAndFeatured ? "delay-200" : ""}`}
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Brand
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Type
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  State / City
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Channels
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Cities
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Metric
                </TableHead>
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Price
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
                    colSpan={10}
                    className="h-32 px-6 text-center text-muted-foreground"
                  >
                    No sites or locations match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item) => (
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
                        <div>
                          <p className="font-display font-medium text-foreground">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {getBrandName(item.brandId)}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {item.type === "site" ? "Site" : "Location"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {item.stateName}
                      <span className="text-muted-foreground/80"> · </span>
                      {item.cityName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium text-foreground">
                      {item.channelsCount}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium text-foreground">
                      {item.citiesCount}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className="text-xs font-medium">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {item.metric}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-semibold tabular-nums text-foreground">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedSite(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddToCart(item)} className="text-primary">
                            <ShoppingCart className="mr-2 h-4 w-4 text-primary" />
                            {isInCart(item.id) ? "In cart" : "Add to cart"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <p className="text-sm text-muted-foreground order-2 sm:order-1 whitespace-nowrap">Page {page} of {totalPages}</p>
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                    ))}
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        size="default"
                        className="gap-1 pr-2.5 h-9"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

        {/* Right: Filters sidebar */}
        <aside className="w-full flex-shrink-0 animate-fade-in-up order-1 lg:order-2 lg:w-[280px]">
          <UsStatesMap
              selectedStateNames={regionFilter}
              onStateClick={toggleRegion}
              className="w-full"
          />
          <div className="sticky top-8 rounded-2xl bg-card p-5 mt-4">
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
                        checked={typeFilter.includes("site")}
                        onCheckedChange={() => toggleType("site")}
                        className="btn-gelatine"
                      />
                      Site ({typeCounts.site})
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
                      <Checkbox
                        checked={typeFilter.includes("location")}
                        onCheckedChange={() => toggleType("location")}
                        className="btn-gelatine"
                      />
                      Location ({typeCounts.location})
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
                  <div className="space-y-2 pb-3">
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Checkbox
                          checked={categoryFilter.includes(cat)}
                          onCheckedChange={() => toggleCategory(cat)}
                          className="btn-gelatine"
                        />
                        {cat} ({categoryCounts[cat] ?? 0})
                      </label>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="group flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-foreground hover:text-foreground">
                  State
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground hidden group-data-[state=open]:inline-block" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pb-3 max-h-[240px] overflow-y-auto">
                    {regions.map((r) => (
                      <label
                        key={r}
                        className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Checkbox
                          checked={regionFilter.includes(r)}
                          onCheckedChange={() => toggleRegion(r)}
                        className="btn-gelatine"
                        />
                        {r} ({regionCounts[r] ?? 0})
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
                        className="btn-gelatine"
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

      {/* Site/Location details drawer (from right) */}
      <Sheet open={!!selectedSite} onOpenChange={(open) => !open && setSelectedSite(null)}>
        <SheetContent
          side="right"
          className="!w-[min(32rem,90vw)] !max-w-none h-full overflow-hidden flex flex-col border-l border-border/50 bg-gradient-to-b from-background to-muted/20 p-0 shadow-xl"
        >
          {selectedSite && (() => {
            const channels = getChannelsBySiteId(selectedSite.id)
            
            return (
              <>
                <SheetHeader className="shrink-0 space-y-0 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent px-6 pt-6 pb-5 text-left animate-fade-in-up [animation-delay:80ms] [animation-fill-mode:forwards] opacity-0">
                  <div className="flex gap-4 pr-8">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-black/5">
                      <Image src={selectedSite.image} alt={selectedSite.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <SheetTitle className="text-xl font-display font-bold tracking-tight text-foreground">
                        {selectedSite.name}
                      </SheetTitle>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {selectedSite.subtitle}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-2.5 py-0 text-[10px] font-medium">
                          {selectedSite.type === "site" ? "Site" : "Location"}
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-2.5 py-0 text-[10px] font-medium">
                          {selectedSite.category}
                        </Badge>
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" />
                          Brand: {getBrandName(selectedSite.brandId)}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Radio className="h-3.5 w-3.5" />
                          {selectedSite.channelsCount} channels
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {selectedSite.cityName}, {selectedSite.stateName}
                        </span>
                      </div>
                    </div>
                  </div>
                </SheetHeader>
                <div className="min-h-0 flex-1 overflow-y-auto p-6">
                  <div className="mb-5 flex items-baseline justify-between gap-2 animate-fade-in-up [animation-delay:160ms] [animation-fill-mode:forwards] opacity-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Channels & Genres
                    </span>
                    {channels.length > 0 && (
                      <span className="text-xs text-muted-foreground">{channels.length} channels</span>
                    )}
                  </div>
                  {channels.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 py-12 text-center animate-fade-in-up delay-200">
                      <p className="text-sm text-muted-foreground">No channels or genres for this site/location.</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {channels.map((channel, index) => {
                        const Icon = getTypeIcon(channel.type)
                        return (
                          <li
                            key={channel.id}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 shadow-[0_1px_2px_rgba(0,0,0,.04)] ring-1 ring-border/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.06] hover:ring-border/60 animate-drawer-item-in opacity-0"
                            style={{ animationDelay: `${220 + index * 55}ms`, animationFillMode: "forwards" }}
                          >
                            <div className="flex gap-4 p-4 sm:p-5">
                              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-muted shadow-inner ring-1 ring-black/5">
                                <Image src={channel.image} alt={channel.name} fill className="object-cover" sizes="72px" />
                              </div>
                              <div className="min-w-0 flex-1 space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-display font-semibold tracking-tight text-foreground">
                                      {channel.name}
                                    </h4>
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                      <Badge variant="secondary" className="text-[10px] font-medium">
                                        {channel.category}
                                      </Badge>
                                      <Badge variant="outline" className="text-[10px] font-medium">
                                        {channel.type === "channel" ? "Channel" : "Genre"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className={cn(
                                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-sm",
                                    channel.available ? "bg-emerald-500/10" : "bg-amber-500/10"
                                  )}>
                                    <span className={cn(
                                      "h-2 w-2 rounded-full",
                                      channel.available ? "bg-emerald-400" : "bg-amber-400"
                                    )} />
                                    <span className={cn(
                                      "text-xs font-semibold",
                                      channel.available ? "text-emerald-400" : "text-amber-400"
                                    )}>
                                      {channel.available ? "Available" : "Unavailable"}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {channel.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1.5">
                                    <Icon className="h-3 w-3 shrink-0 opacity-70" />
                                    {channel.type === "channel" ? "Channel" : "Genre"}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Globe className="h-3 w-3 shrink-0 opacity-70" />
                                    {channel.sitesCount} sites
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>
    </div>
  )

  if (scrollContainer) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto">{inner}</div>
    )
  }
  return <>{inner}</>
}
