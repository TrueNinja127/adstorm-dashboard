"use client"

import { useState, useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, Receipt, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FilterPeriod } from "@/types"
import { generateDailyRevenueData } from "@/services"

const allData = generateDailyRevenueData()

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-xl">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-[12px] text-muted-foreground capitalize">
              {entry.dataKey}:
            </span>
            <span className="text-[12px] font-bold text-foreground">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  const [filter, setFilter] = useState<FilterPeriod>("year")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { chartData, summary, previousPeriodBalance } = useMemo(() => {
    const today = new Date()
    let filtered: typeof allData = []
    let chartData: Array<{ label: string; revenue: number; spend: number }> = []

    if (filter === "28days") {
      const cutoffDate = new Date(today)
      cutoffDate.setDate(cutoffDate.getDate() - 28)
      filtered = allData.filter((d) => d.date >= cutoffDate)
      chartData = filtered.map((d) => ({
        label: `${d.month} ${d.day}`,
        revenue: d.revenue,
        spend: d.spend,
      }))
    } else if (filter === "month") {
      const cutoffDate = new Date(today.getFullYear(), today.getMonth(), 1)
      filtered = allData.filter((d) => d.date >= cutoffDate)
      chartData = filtered.map((d) => ({
        label: `${d.month} ${d.day}`,
        revenue: d.revenue,
        spend: d.spend,
      }))
    } else {
      filtered = allData
      const monthlyData: Record<string, { revenue: number; spend: number }> = {}
      filtered.forEach((d) => {
        if (!monthlyData[d.month]) {
          monthlyData[d.month] = { revenue: 0, spend: 0 }
        }
        monthlyData[d.month].revenue += d.revenue
        monthlyData[d.month].spend += d.spend
      })
      chartData = Object.entries(monthlyData).map(([month, values]) => ({
        label: month,
        revenue: values.revenue,
        spend: values.spend,
      }))
    }

    const totalRevenue = filtered.reduce((sum, d) => sum + d.revenue, 0)
    const totalSpend = filtered.reduce((sum, d) => sum + d.spend, 0)
    const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0

    let previousPeriodData: typeof allData = []
    if (filter === "28days") {
      const cutoffDate = new Date(today)
      cutoffDate.setDate(cutoffDate.getDate() - 56)
      const periodEndDate = new Date(today)
      periodEndDate.setDate(periodEndDate.getDate() - 28)
      previousPeriodData = allData.filter((d) => d.date >= cutoffDate && d.date < periodEndDate)
    } else if (filter === "month") {
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1)
      previousPeriodData = allData.filter((d) => d.date >= lastMonthStart && d.date < lastMonthEnd)
    } else {
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1)
      const lastYearEnd = new Date(today.getFullYear(), 0, 1)
      previousPeriodData = allData.filter((d) => d.date >= lastYearStart && d.date < lastYearEnd)
    }

    const previousRevenue = previousPeriodData.reduce((sum, d) => sum + d.revenue, 0)
    const previousSpend = previousPeriodData.reduce((sum, d) => sum + d.spend, 0)
    const previousPeriodBalance = previousRevenue - previousSpend

    return {
      chartData,
      summary: { totalRevenue, totalSpend, roi },
      previousPeriodBalance,
    }
  }, [filter])

  return (
    <div className="rounded-2xl bg-card p-5 animate-fade-in-up delay-400">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <h3 className="font-display text-xl font-bold text-foreground">
              Revenue Trends
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(30, 93%, 54%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(30, 93%, 54%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(197, 71%, 60%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(197, 71%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 8%, 14%)" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(228, 6%, 44%)", fontSize: 11 }}
                  dy={8}
                  interval={filter === "year" ? 0 : "preserveStartEnd"}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(228, 6%, 44%)", fontSize: 11 }}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  dx={-4}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "hsl(228, 8%, 20%)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(30, 93%, 54%)"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "hsl(30, 93%, 54%)", stroke: "hsl(228, 12%, 7%)", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="hsl(197, 71%, 60%)"
                  strokeWidth={2}
                  fill="url(#spendGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "hsl(197, 71%, 60%)", stroke: "hsl(228, 12%, 7%)", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-[280px] flex-shrink-0 flex flex-col gap-4">
          <div className="relative mb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-display text-xl font-bold text-foreground">
                  ${((summary.totalRevenue - summary.totalSpend) / 1000).toFixed(2)}k
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filter === "28days" && "Last 28 days balance "}
                  {filter === "month" && "Last month balance "}
                  {filter === "year" && "Last year balance "}
                  ${(previousPeriodBalance / 1000).toFixed(2)}k
                </p>
              </div>
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => { setFilter("28days"); setIsDropdownOpen(false) }} className={filter === "28days" ? "bg-accent" : ""}>Last 28 Days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setFilter("month"); setIsDropdownOpen(false) }} className={filter === "month" ? "bg-accent" : ""}>Last Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setFilter("year"); setIsDropdownOpen(false) }} className={filter === "year" ? "bg-accent" : ""}>Last Year</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Revenue</p>
              <p className="font-display text-xl font-bold text-foreground truncate">${summary.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
              <Receipt className="h-5 w-5 text-sky-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Spend</p>
              <p className="font-display text-xl font-bold text-foreground truncate">${summary.totalSpend.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">ROI</p>
              <p className="font-display text-xl font-bold text-emerald-400 truncate">{summary.roi.toFixed(1)}%</p>
            </div>
          </div>
          <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 mt-auto">View Report</button>
        </div>
      </div>
    </div>
  )
}
