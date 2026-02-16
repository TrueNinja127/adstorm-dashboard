"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  TrendingUp,
  Eye,
  MousePointerClick,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { RevenueChart } from "./revenue-chart"

const stats = [
  {
    label: "Active Campaigns",
    value: "12",
    change: "+3",
    changeLabel: "this week",
    icon: TrendingUp,
    positive: true,
    sparkData: [4, 6, 5, 8, 7, 9, 12],
  },
  {
    label: "Total Impressions",
    value: "284K",
    change: "+12.5%",
    changeLabel: "vs last month",
    icon: Eye,
    positive: true,
    sparkData: [180, 200, 220, 210, 250, 260, 284],
  },
  {
    label: "Click Rate",
    value: "3.2%",
    change: "-0.4%",
    changeLabel: "vs last month",
    icon: MousePointerClick,
    positive: false,
    sparkData: [3.8, 3.6, 3.5, 3.4, 3.6, 3.3, 3.2],
  },
  {
    label: "Spend Today",
    value: "$42.80",
    change: "42.8%",
    changeLabel: "of $100 daily",
    icon: DollarSign,
    positive: true,
    sparkData: [10, 18, 24, 30, 35, 38, 42.8],
  },
]

const categories = [
  {
    title: "Brands",
    description:
      "Access brand-safe ad inventory across verified brand networks and premium placements.",
    image: "/images/card-brands.jpg",
    count: 48,
    available: 32,
    tag: "Popular",
  },
  {
    title: "Sites & Locations",
    description:
      "Target specific sites and physical locations for precise geo-based audience reach.",
    image: "/images/card-locations.jpg",
    count: 126,
    available: 98,
    tag: "Trending",
  },
  {
    title: "Channels & Genres",
    description:
      "Select channels and content genres that match your target audience interests.",
    image: "/images/card-channels.jpg",
    count: 89,
    available: 74,
    tag: "New",
  },
  {
    title: "AI Assistant",
    description:
      "Let AI optimize your campaigns automatically with smart bidding and predictive analytics.",
    image: "/images/card-ai.jpg",
    count: null,
    available: null,
    tag: "Beta",
  },
]

const staggerDelays = ["delay-100", "delay-150", "delay-200", "delay-250"]
const cardDelays = ["delay-300", "delay-400", "delay-500", "delay-600"]

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 64
  const height = 28
  const padding = 2

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((v - min) / range) * (height - padding * 2)
    return { x, y }
  })

  // Build smooth path using cubic Bezier with tension (Catmull-Rom style)
  const tension = 0.3
  const smoothPathD = (() => {
    if (points.length < 2) return ""
    const d: string[] = [`M ${points[0].x} ${points[0].y}`]
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[Math.min(points.length - 1, i + 2)]
      const cp1x = p1.x + (p2.x - p0.x) * tension
      const cp1y = p1.y + (p2.y - p0.y) * tension
      const cp2x = p2.x - (p3.x - p1.x) * tension
      const cp2y = p2.y - (p3.y - p1.y) * tension
      d.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`)
    }
    return d.join(" ")
  })()

  const color = positive ? "hsl(160, 60%, 45%)" : "hsl(0, 65%, 55%)"

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <path
        d={smoothPathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CategoryCards() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
            Welcome back, John
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {"Here's what's happening with your campaigns today."}
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`animate-fade-in-up ${staggerDelays[i]} group relative overflow-hidden rounded-2xl bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20`}
            >
              {/* Top row: icon + sparkline */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/80">
                  <stat.icon className="h-[18px] w-[18px] text-muted-foreground transition-colors group-hover:text-[hsl(var(--primary))]" />
                </div>
                <MiniSparkline data={stat.sparkData} positive={stat.positive} />
              </div>

              {/* Value */}
              <p className="font-display text-[28px] font-extrabold leading-none text-foreground">
                {stat.value}
              </p>

              {/* Label */}
              <p className="mt-1.5 text-[12px] font-medium text-muted-foreground">
                {stat.label}
              </p>

              {/* Change indicator */}
              <div className="mt-3 flex items-center gap-1.5">
                <div
                  className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                    stat.positive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {stat.changeLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="mb-8">
          <RevenueChart />
        </div>

        {/* Marketplace Heading */}
        <div className="mb-5 flex items-center justify-between animate-fade-in-up delay-500">
          <div>
            <h2 className="font-display text-[15px] font-bold text-foreground">
              Marketplace
            </h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Explore ad inventory and tools to build your campaigns.
            </p>
          </div>
          <button className="btn-gelatine flex items-center gap-1.5 text-[12px] font-semibold text-[hsl(var(--primary))] transition-colors hover:text-[hsl(var(--primary)/.8)]">
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Marketplace Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
          {categories.map((category, i) => {
            const cardClass = `animate-fade-in-up ${cardDelays[i]} group relative overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 block`
            const content = (
              <>
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-[hsl(var(--card)/.5)] to-transparent" />

                  {/* Tag */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-lg bg-[hsl(var(--primary))] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]">
                      {category.tag}
                    </span>
                  </div>

                  {/* Availability */}
                  {category.count !== null ? (
                    <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_hsl(160,60%,45%,.5)]" />
                      <span className="text-[11px] font-medium text-foreground/90">
                        {category.available} of {category.count} available
                      </span>
                    </div>
                  ) : (
                    <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_6px_hsl(30,93%,54%,.5)]" />
                      <span className="text-[11px] font-medium text-foreground/90">
                        AI-Powered
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-[15px] font-bold text-foreground">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <span className="btn-gelatine mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-[12px] font-semibold text-foreground transition-all duration-200 group-hover:bg-[hsl(var(--primary))] group-hover:text-[#0a0a0a]">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </>
            )
            const href =
              category.title === "Brands"
                ? "/brands"
                : category.title === "Sites & Locations"
                  ? "/sites"
                  : null
            return href ? (
              <Link key={category.title} href={href} className={cardClass}>
                {content}
              </Link>
            ) : (
              <div key={category.title} className={cardClass}>
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
