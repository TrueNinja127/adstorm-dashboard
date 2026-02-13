"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, ArrowUpRight } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 4200, spend: 2800 },
  { month: "Feb", revenue: 5100, spend: 3200 },
  { month: "Mar", revenue: 4800, spend: 2900 },
  { month: "Apr", revenue: 6200, spend: 3600 },
  { month: "May", revenue: 7400, spend: 4100 },
  { month: "Jun", revenue: 6900, spend: 3800 },
  { month: "Jul", revenue: 8100, spend: 4500 },
  { month: "Aug", revenue: 9200, spend: 4800 },
  { month: "Sep", revenue: 8700, spend: 4600 },
  { month: "Oct", revenue: 10400, spend: 5200 },
  { month: "Nov", revenue: 11200, spend: 5800 },
  { month: "Dec", revenue: 12800, spend: 6100 },
]

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
  return (
    <div className="rounded-2xl bg-card p-5 animate-fade-in-up delay-400">
      {/* Chart Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-[14px] font-bold text-foreground">
              Revenue Trends
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Revenue vs. ad spend over the past year
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[11px] text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span className="text-[11px] text-muted-foreground">Ad Spend</span>
            </div>
          </div>
          <button className="flex items-center gap-1 text-[12px] font-medium text-primary transition-colors hover:text-primary/80">
            Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-5 flex items-center gap-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Total Revenue
          </p>
          <p className="font-display text-2xl font-bold text-foreground">
            $95,100
          </p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Total Spend
          </p>
          <p className="font-display text-2xl font-bold text-foreground">
            $51,400
          </p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            ROI
          </p>
          <div className="flex items-baseline gap-1.5">
            <p className="font-display text-2xl font-bold text-emerald-400">
              85%
            </p>
            <span className="text-[11px] font-semibold text-emerald-400">
              +12.3%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueData}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(30, 93%, 54%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(30, 93%, 54%)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(197, 71%, 60%)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(197, 71%, 60%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(228, 8%, 14%)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(228, 6%, 44%)", fontSize: 11 }}
              dy={8}
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
              activeDot={{
                r: 5,
                fill: "hsl(30, 93%, 54%)",
                stroke: "hsl(228, 12%, 7%)",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="spend"
              stroke="hsl(197, 71%, 60%)"
              strokeWidth={2}
              fill="url(#spendGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "hsl(197, 71%, 60%)",
                stroke: "hsl(228, 12%, 7%)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
