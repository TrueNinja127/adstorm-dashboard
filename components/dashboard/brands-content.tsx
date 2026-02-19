"use client"

import Image from "next/image"
import { useState, useMemo } from "react"
import { Search, Building2, ArrowRight, LayoutGrid, List, Globe, Radio, ChevronDown, ChevronUp, MapPin, Users, ShoppingCart, Calendar, DollarSign, VenusAndMars } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface Brand {
  id: string
  title: string
  description: string
  image: string
  category: string
  sitesCount: number
  channelsCount: number
}

interface ChildSite {
  id: string
  name: string
  image: string
  type: string
  location: string
  audience: string
  gender: string
  age: string
  income: string
}

const mockBrands: Brand[] = [
  { id: "1", title: "TechFlow Media", description: "Premium tech and innovation ad inventory across leading tech publications and apps.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop", category: "Technology", sitesCount: 14, channelsCount: 8 },
  { id: "2", title: "Lifestyle Network", description: "Curated lifestyle and wellness placements for health, fashion, and home audiences.", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop", category: "Lifestyle", sitesCount: 22, channelsCount: 12 },
  { id: "3", title: "Sports Arena", description: "Live sports and athletic content network with high-engagement fan bases.", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop", category: "Sports", sitesCount: 18, channelsCount: 15 },
  { id: "4", title: "News Daily", description: "Trusted news and current affairs inventory from top publishers worldwide.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop", category: "News", sitesCount: 9, channelsCount: 6 },
  { id: "5", title: "Entertainment Plus", description: "Streaming, movies, and entertainment content across multiple platforms.", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=200&fit=crop", category: "Entertainment", sitesCount: 31, channelsCount: 14 },
  { id: "6", title: "Finance Hub", description: "Financial news, markets, and investing content for professional audiences.", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop", category: "Finance", sitesCount: 11, channelsCount: 7 },
  { id: "7", title: "Health & Wellness", description: "Healthcare, fitness, and wellness publishers reaching health-conscious users.", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop", category: "Health", sitesCount: 16, channelsCount: 9 },
  { id: "8", title: "Auto World", description: "Automotive reviews, comparisons, and car culture destinations.", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=200&fit=crop", category: "Automotive", sitesCount: 6, channelsCount: 4 },
  { id: "9", title: "Travel Channel", description: "Travel guides, destinations, and booking platforms for travel advertisers.", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop", category: "Travel", sitesCount: 12, channelsCount: 8 },
  { id: "10", title: "Fashion Forward", description: "Fashion, beauty, and style content from top editorial and influencer sites.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", category: "Fashion", sitesCount: 13, channelsCount: 10 },
  { id: "11", title: "Food & Drink", description: "Recipe sites, food media, and beverage content for F&B advertisers.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop", category: "Food", sitesCount: 8, channelsCount: 5 },
]

/** Mock child sites per brand (key = brand id). audience is numeric display e.g. "100K", "1.2M". */
const mockChildSitesByBrand: Record<string, ChildSite[]> = {
  "1": [
    { id: "s1-1", name: "TechFlow News", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop", type: "Technology", location: "San Francisco, CA", audience: "120K", gender: "All", age: "25-54", income: "$75k+" },
    { id: "s1-2", name: "TechFlow Reviews", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop", type: "Technology", location: "Austin, TX", audience: "85K", gender: "Male 72%", age: "22-45", income: "$90k+" },
    { id: "s1-3", name: "TechFlow Labs", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop", type: "Technology", location: "Seattle, WA", audience: "250K", gender: "All", age: "30-55", income: "$100k+" },
  ],
  "2": [
    { id: "s2-1", name: "Lifestyle Daily", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop", type: "Lifestyle", location: "Miami, FL", audience: "95K", gender: "Female 65%", age: "25-44", income: "$55k+" },
    { id: "s2-2", name: "Lifestyle Home", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop", type: "Lifestyle", location: "Denver, CO", audience: "180K", gender: "All", age: "28-55", income: "$65k+" },
  ],
  "3": [
    { id: "s3-1", name: "Sports Arena Live", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop", type: "Sports", location: "Chicago, IL", audience: "420K", gender: "Male 68%", age: "18-45", income: "$50k+" },
  ],
  "4": [
    { id: "s4-1", name: "News Daily US", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop", type: "News", location: "New York, NY", audience: "1.2M", gender: "All", age: "25-64", income: "$60k+" },
  ],
  "5": [
    { id: "s5-1", name: "Entertainment Stream", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&h=100&fit=crop", type: "Entertainment", location: "Los Angeles, CA", audience: "780K", gender: "All", age: "18-44", income: "$45k+" },
  ],
  "6": [
    { id: "s6-1", name: "Finance Hub Markets", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop", type: "Finance", location: "New York, NY", audience: "310K", gender: "Male 58%", age: "35-64", income: "$120k+" },
  ],
  "7": [
    { id: "s7-1", name: "Health & Wellness Plus", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100&h=100&fit=crop", type: "Health", location: "Boston, MA", audience: "156K", gender: "Female 62%", age: "28-55", income: "$70k+" },
  ],
  "8": [
    { id: "s8-1", name: "Auto World Reviews", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100&h=100&fit=crop", type: "Automotive", location: "Detroit, MI", audience: "88K", gender: "Male 70%", age: "30-60", income: "$80k+" },
  ],
  "9": [
    { id: "s9-1", name: "Travel Channel Destinations", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop", type: "Travel", location: "San Francisco, CA", audience: "220K", gender: "All", age: "28-55", income: "$85k+" },
  ],
  "10": [
    { id: "s10-1", name: "Fashion Forward Style", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop", type: "Fashion", location: "New York, NY", audience: "195K", gender: "Female 78%", age: "18-40", income: "$55k+" },
  ],
  "11": [
    { id: "s11-1", name: "Food & Drink Recipes", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop", type: "Food", location: "Portland, OR", audience: "72K", gender: "All", age: "25-54", income: "$60k+" },
  ],
}

interface BrandsContentProps {
  showHeaderAndFeatured?: boolean
  scrollContainer?: boolean
}

type ViewMode = "card" | "list"

export function BrandsContent({ showHeaderAndFeatured = true, scrollContainer = true }: BrandsContentProps) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  const childSites = selectedBrand ? (mockChildSitesByBrand[selectedBrand.id] ?? []) : []

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
                  {mockBrands.length} brands
                </span>
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
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
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
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]"
                        onClick={() => setSelectedBrand(brand)}
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
        <Sheet open={!!selectedBrand} onOpenChange={(open) => !open && setSelectedBrand(null)}>
          <SheetContent
            side="right"
            className="!w-[min(32rem,90vw)] !max-w-none h-full overflow-hidden flex flex-col border-l border-border/50 bg-gradient-to-b from-background to-muted/20 p-0 shadow-xl"
          >
            {selectedBrand && (
              <>
                <SheetHeader className="shrink-0 space-y-0 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent px-6 pt-6 pb-5 text-left animate-fade-in-up [animation-delay:80ms] [animation-fill-mode:forwards] opacity-0">
                  <div className="flex gap-4 pr-8">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-black/5">
                      <Image src={selectedBrand.image} alt={selectedBrand.title} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <SheetTitle className="text-xl font-display font-bold tracking-tight text-foreground">
                        {selectedBrand.title}
                      </SheetTitle>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {selectedBrand.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-2.5 py-0 text-[10px] font-medium">
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
                      <span className="text-xs text-muted-foreground">{childSites.length} sites</span>
                    )}
                  </div>
                  {childSites.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 py-12 text-center animate-fade-in-up delay-200">
                      <p className="text-sm text-muted-foreground">No child sites for this brand.</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {childSites.map((site, index) => (
                        <li
                          key={site.id}
                          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 shadow-[0_1px_2px_rgba(0,0,0,.04)] ring-1 ring-border/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.06] hover:ring-border/60 animate-drawer-item-in opacity-0"
                          style={{ animationDelay: `${220 + index * 55}ms`, animationFillMode: "forwards" }}
                        >
                          <div className="flex gap-4 p-4 sm:p-5">
                            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-muted shadow-inner ring-1 ring-black/5">
                              <Image src={site.image} alt={site.name} fill className="object-cover" sizes="72px" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-3">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-display font-semibold tracking-tight text-foreground">
                                    {site.name}
                                  </h4>
                                  <Badge variant="secondary" className="mt-1.5 text-[10px] font-medium">
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
                                onClick={() => {/* TODO: navigate or open buy ads flow */}}
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
