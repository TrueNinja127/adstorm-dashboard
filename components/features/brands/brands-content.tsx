"use client"

import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Building2,
  ArrowRight,
  LayoutGrid,
  List,
  Globe,
  Radio,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  ShoppingCart,
  Calendar,
  DollarSign,
  VenusAndMars,
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
import { cn } from "@/lib/utils"
import type { Brand } from "@/types"
import { mockBrands, mockChildSitesByBrand } from "@/services"

interface BrandsContentProps {
  showHeaderAndFeatured?: boolean
  scrollContainer?: boolean
}

type ViewMode = "card" | "list"

const PAGE_SIZE = 8

export function BrandsContent({
  showHeaderAndFeatured = true,
  scrollContainer = true,
}: BrandsContentProps) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [page, setPage] = useState(1)

  const childSites = selectedBrand
    ? (mockChildSitesByBrand[selectedBrand.id] ?? [])
    : []

  const categories = useMemo(() => {
    const set = new Set(mockBrands.map((b) => b.category))
    return Array.from(set).sort()
  }, [])

  const categoryCounts = useMemo(() => {
    const acc: Record<string, number> = {}
    mockBrands.forEach((b) => {
      acc[b.category] = (acc[b.category] ?? 0) + 1
    })
    return acc
  }, [])

  const filteredBrands = useMemo(() => {
    return mockBrands.filter((brand) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        !search ||
        brand.title.toLowerCase().includes(searchLower) ||
        brand.description.toLowerCase().includes(searchLower) ||
        brand.category.toLowerCase().includes(searchLower)
      const matchesCategory =
        categoryFilter.length === 0 || categoryFilter.includes(brand.category)
      return matchesSearch && matchesCategory
    })
  }, [search, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / PAGE_SIZE))
  const paginatedBrands = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredBrands.slice(start, start + PAGE_SIZE)
  }, [filteredBrands, page])

  useEffect(() => {
    setPage(1)
  }, [search, categoryFilter])

  function resetAllFilters() {
    setCategoryFilter([])
  }

  function toggleCategory(value: string) {
    setCategoryFilter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  const inner = (
    <div className="px-8 py-8">
      {showHeaderAndFeatured && (
        <>
          {/* Page header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
              Brands
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Access brand-safe ad inventory across verified brand networks and
              premium placements.
            </p>
          </div>

          {/* Featured brands carousel */}
          <div className="mb-8 animate-fade-in-up delay-75">
            <h2 className="font-display text-[15px] font-bold text-foreground mb-4">
              Featured brands
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {mockBrands.slice(0, 8).map((brand) => (
                  <CarouselItem
                    key={brand.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-[85%] md:basis-[45%] lg:basis-[32%]"
                  >
                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20">
                      <div className="flex h-40 items-center gap-4 p-5">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                          <Image
                            src={brand.image}
                            alt={brand.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-semibold text-foreground truncate">
                            {brand.title}
                          </p>
                          <div className="mt-0.5">
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-medium"
                            >
                              {brand.category}
                            </Badge>
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
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 h-9 w-9 rounded-full border-border bg-card text-foreground hover:bg-accent md:-left-4" />
              <CarouselNext className="-right-2 h-9 w-9 rounded-full border-border bg-card text-foreground hover:bg-accent md:-right-4" />
            </Carousel>
          </div>
        </>
      )}

      {/* Section heading when below hero (no duplicate header) */}
      {!showHeaderAndFeatured && (
        <div className="mb-6 animate-fade-in-up">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
            Browse all brands
          </h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Search and filter brand networks below.
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
            placeholder="Search brands..."
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
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {filteredBrands.length === 0
                  ? "0 brands"
                  : totalPages === 1
                    ? `${filteredBrands.length} brands`
                    : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filteredBrands.length)} of ${filteredBrands.length} brands`}
              </span>
            </div>
          </div>

          {/* Card view */}
          {viewMode === "card" && (
            <div
              className={`animate-fade-in-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${showHeaderAndFeatured ? "delay-200" : ""}`}
            >
              {filteredBrands.length === 0 ? (
                <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground text-sm">
                  No brands match your filters.
                </div>
              ) : (
                paginatedBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
                  >
                    {/* Top: full-width image with overlay badge */}
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-secondary">
                      <Image
                        src={brand.image}
                        alt={brand.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      <div className="absolute left-3 top-3">
                        <span className="rounded-lg bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                          {brand.category}
                        </span>
                      </div>
                    </div>
                    {/* Middle: title, description */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-display text-base font-bold tracking-tight text-foreground truncate">
                        {brand.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {brand.description}
                      </p>
                      {/* Bottom: features (icons + text), CTA */}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1.5 text-xs">
                          <Globe className="h-3.5 w-3.5" />
                          {brand.sitesCount} Sites
                        </span>
                        <span className="flex items-center gap-1.5 text-xs">
                          <Radio className="h-3.5 w-3.5" />
                          {brand.channelsCount} Channels
                        </span>
                      </div>
                      <div className="mt-4 flex items-end justify-end border-t border-border pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 btn-gelatine border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]"
                          onClick={() => setSelectedBrand(brand)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* List view (table) */}
          {viewMode === "list" && (
            <div
              className={`animate-fade-in-up rounded-2xl border border-border bg-card overflow-hidden ${showHeaderAndFeatured ? "delay-200" : ""}`}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Title
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Description
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Sites
                    </TableHead>
                    <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                      Channels
                    </TableHead>
                    <TableHead className="h-12 px-6 text-right font-display font-semibold text-muted-foreground">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBrands.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 px-6 text-center text-muted-foreground"
                      >
                        No brands match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedBrands.map((brand) => (
                      <TableRow
                        key={brand.id}
                        className="border-border transition-colors hover:bg-accent/50"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
                              <Image
                                src={brand.image}
                                alt={brand.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <p className="font-display font-medium text-foreground">
                              {brand.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[280px] px-6 py-4 text-sm text-muted-foreground line-clamp-2">
                          {brand.description}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium"
                          >
                            {brand.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="flex items-center gap-2 font-medium text-foreground">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            {brand.sitesCount}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="flex items-center gap-2 font-medium text-foreground">
                            <Radio className="h-4 w-4 text-muted-foreground" />
                            {brand.channelsCount}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]"
                            onClick={() => setSelectedBrand(brand)}
                          >
                            View Details
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

          {/* Pagination */}
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
            </div>
          </div>
        </aside>
      </div>

      {/* Brand details drawer (from right) */}
      <Sheet
        open={!!selectedBrand}
        onOpenChange={(open) => !open && setSelectedBrand(null)}
      >
        <SheetContent
          side="right"
          className="!w-[min(32rem,90vw)] !max-w-none h-full overflow-hidden flex flex-col border-l border-border/50 bg-gradient-to-b from-background to-muted/20 p-0 shadow-xl"
        >
          {selectedBrand && (
            <>
              <SheetHeader className="shrink-0 space-y-0 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent px-6 pt-6 pb-5 text-left animate-fade-in-up [animation-delay:80ms] [animation-fill-mode:forwards] opacity-0">
                <div className="flex gap-4 pr-8">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-black/5">
                    <Image
                      src={selectedBrand.image}
                      alt={selectedBrand.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <SheetTitle className="text-xl font-display font-bold tracking-tight text-foreground">
                      {selectedBrand.title}
                    </SheetTitle>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {selectedBrand.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2.5 py-0 text-[10px] font-medium"
                      >
                        {selectedBrand.category}
                      </Badge>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                        {selectedBrand.sitesCount} sites
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Radio className="h-3.5 w-3.5" />
                        {selectedBrand.channelsCount} channels
                      </span>
                    </div>
                  </div>
                </div>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-6">
                <div className="mb-5 flex items-baseline justify-between gap-2 animate-fade-in-up [animation-delay:160ms] [animation-fill-mode:forwards] opacity-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sites
                  </span>
                  {childSites.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {childSites.length} sites
                    </span>
                  )}
                </div>
                {childSites.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 py-12 text-center animate-fade-in-up delay-200">
                    <p className="text-sm text-muted-foreground">
                      No child sites for this brand.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {childSites.map((site, index) => (
                      <li
                        key={site.id}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 shadow-[0_1px_2px_rgba(0,0,0,.04)] ring-1 ring-border/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.06] hover:ring-border/60 animate-drawer-item-in opacity-0"
                        style={{
                          animationDelay: `${220 + index * 55}ms`,
                          animationFillMode: "forwards",
                        }}
                      >
                        <div className="flex gap-4 p-4 sm:p-5">
                          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-muted shadow-inner ring-1 ring-black/5">
                            <Image
                              src={site.image}
                              alt={site.name}
                              fill
                              className="object-cover"
                              sizes="72px"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h4 className="font-display font-semibold tracking-tight text-foreground">
                                  {site.name}
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className="mt-1.5 text-[10px] font-medium"
                                >
                                  {site.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 backdrop-blur-sm">
                                <Users className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                                <span className="text-xs font-bold tabular-nums text-[hsl(var(--primary))]">
                                  {site.audience}
                                </span>
                              </div>
                            </div>
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
                              {site.location}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <VenusAndMars className="h-3 w-3 shrink-0 opacity-70" />
                                {site.gender}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 shrink-0 opacity-70" />
                                {site.age}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <DollarSign className="h-3 w-3 shrink-0 opacity-70" />
                                {site.income}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="mt-1 w-full rounded-full btn-gelatine bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium shadow-sm hover:opacity-95 sm:w-auto sm:px-5"
                              onClick={() => {
                                /* TODO: navigate or open buy ads flow */
                              }}
                            >
                              <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                              Buy ads
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )

  if (scrollContainer) {
    return <div className="flex-1 min-h-0 overflow-y-auto">{inner}</div>
  }
  return <>{inner}</>
}
