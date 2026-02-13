"use client"

import Image from "next/image"
import { useState, useMemo } from "react"
import { Search, Building2, ArrowRight, Filter, LayoutGrid, List, Globe, Radio } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface Brand {
  id: string
  title: string
  description: string
  image: string
  category: string
  sitesCount: number
  channelsCount: number
  available: boolean
}

const mockBrands: Brand[] = [
  { id: "1", title: "TechFlow Media", description: "Premium tech and innovation ad inventory across leading tech publications and apps.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop", category: "Technology", sitesCount: 14, channelsCount: 8, available: true },
  { id: "2", title: "Lifestyle Network", description: "Curated lifestyle and wellness placements for health, fashion, and home audiences.", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop", category: "Lifestyle", sitesCount: 22, channelsCount: 12, available: true },
  { id: "3", title: "Sports Arena", description: "Live sports and athletic content network with high-engagement fan bases.", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop", category: "Sports", sitesCount: 18, channelsCount: 15, available: false },
  { id: "4", title: "News Daily", description: "Trusted news and current affairs inventory from top publishers worldwide.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop", category: "News", sitesCount: 9, channelsCount: 6, available: true },
  { id: "5", title: "Entertainment Plus", description: "Streaming, movies, and entertainment content across multiple platforms.", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=200&fit=crop", category: "Entertainment", sitesCount: 31, channelsCount: 14, available: true },
  { id: "6", title: "Finance Hub", description: "Financial news, markets, and investing content for professional audiences.", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop", category: "Finance", sitesCount: 11, channelsCount: 7, available: true },
  { id: "7", title: "Health & Wellness", description: "Healthcare, fitness, and wellness publishers reaching health-conscious users.", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop", category: "Health", sitesCount: 16, channelsCount: 9, available: false },
  { id: "8", title: "Auto World", description: "Automotive reviews, comparisons, and car culture destinations.", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=200&fit=crop", category: "Automotive", sitesCount: 6, channelsCount: 4, available: true },
  { id: "9", title: "Travel Channel", description: "Travel guides, destinations, and booking platforms for travel advertisers.", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop", category: "Travel", sitesCount: 12, channelsCount: 8, available: true },
  { id: "10", title: "Fashion Forward", description: "Fashion, beauty, and style content from top editorial and influencer sites.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", category: "Fashion", sitesCount: 13, channelsCount: 10, available: true },
  { id: "11", title: "Food & Drink", description: "Recipe sites, food media, and beverage content for F&B advertisers.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop", category: "Food", sitesCount: 8, channelsCount: 5, available: false },
]

interface BrandsContentProps {
  showHeaderAndFeatured?: boolean
  scrollContainer?: boolean
}

type ViewMode = "card" | "list"

export function BrandsContent({ showHeaderAndFeatured = true, scrollContainer = true }: BrandsContentProps) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("card")

  const categories = useMemo(() => {
    const set = new Set(mockBrands.map((b) => b.category))
    return Array.from(set).sort()
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
        categoryFilter === "all" || brand.category === categoryFilter
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && brand.available) ||
        (availabilityFilter === "unavailable" && !brand.available)
      return matchesSearch && matchesCategory && matchesAvailability
    })
  }, [search, categoryFilter, availabilityFilter])

  const availableCount = mockBrands.filter((b) => b.available).length

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
                        <Image src={brand.image} alt={brand.title} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display font-semibold text-foreground truncate">
                          {brand.title}
                        </p>
                        <div className="mt-0.5">
                          <Badge variant="secondary" className="text-[10px] font-medium">
                            {brand.category}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[11px] font-medium",
                              brand.available
                                ? "text-emerald-400"
                                : "text-amber-400"
                            )}
                          >
                            {brand.available ? "Available" : "Unavailable"}
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

        {/* Stats bar */}
        <div className={`mb-6 flex flex-wrap items-center gap-4 animate-fade-in-up ${showHeaderAndFeatured ? "delay-100" : ""}`}>
          <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {mockBrands.length} brands
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_hsl(160,60%,45%,.5)]" />
            <span className="text-sm font-medium text-foreground">
              {availableCount} available
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className={`mb-6 flex flex-wrap items-center gap-3 animate-fade-in-up ${showHeaderAndFeatured ? "delay-150" : ""}`}>
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 rounded-xl bg-card border-border"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 w-[160px] rounded-xl bg-card border-border">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="h-10 w-[160px] rounded-xl bg-card border-border">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                viewMode === "card"
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              aria-label="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                viewMode === "list"
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card view */}
        {viewMode === "card" && (
          <div className={`animate-fade-in-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${showHeaderAndFeatured ? "delay-200" : ""}`}>
            {filteredBrands.length === 0 ? (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground text-sm">
                No brands match your filters.
              </div>
            ) : (
              filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="group rounded-2xl bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image src={brand.image} alt={brand.title} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold text-foreground truncate">
                        {brand.title}
                      </p>
                      <div className="mt-0.5">
                        <Badge variant="secondary" className="text-[10px] font-medium">
                          {brand.category}
                        </Badge>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {brand.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "text-[11px] font-medium",
                            brand.available ? "text-emerald-400" : "text-amber-400"
                          )}
                        >
                          {brand.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>

                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        {brand.sitesCount} sites
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Radio className="h-3.5 w-3.5" />
                        {brand.channelsCount} channels
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
              ))
            )}
          </div>
        )}

        {/* List view (table) */}
        {viewMode === "list" && (
        <div className={`animate-fade-in-up rounded-2xl border border-border bg-card overflow-hidden ${showHeaderAndFeatured ? "delay-200" : ""}`}>
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
                <TableHead className="h-12 px-6 font-display font-semibold text-muted-foreground">
                  Status
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
                    colSpan={7}
                    className="h-32 px-6 text-center text-muted-foreground"
                  >
                    No brands match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => (
                  <TableRow
                    key={brand.id}
                    className="border-border transition-colors hover:bg-accent/50"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          <Image src={brand.image} alt={brand.title} fill className="object-cover" sizes="48px" />
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
                      <Badge variant="secondary" className="text-xs font-medium">
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
                    <TableCell className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",
                          brand.available
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            brand.available ? "bg-emerald-400" : "bg-amber-400"
                          )}
                        />
                        {brand.available ? "Available" : "Unavailable"}
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
  )

  if (scrollContainer) {
    return <div className="flex-1 min-h-0 overflow-y-auto">{inner}</div>
  }
  return <>{inner}</>
}
