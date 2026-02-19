import type { RevenueDataPoint } from "@/types"

const monthlyTotals = [
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

/** Generate daily revenue/spend data for the last 365 days (for charts). */
export function generateDailyRevenueData(): RevenueDataPoint[] {
  const data: RevenueDataPoint[] = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const monthIndex = date.getMonth()
    const monthData = monthlyTotals[monthIndex]
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

    const baseDailyRevenue = monthData.revenue / daysInMonth
    const baseDailySpend = monthData.spend / daysInMonth
    const variation = 0.7 + Math.random() * 0.6

    data.push({
      date,
      month: monthData.month,
      day: date.getDate().toString(),
      revenue: Math.round(baseDailyRevenue * variation),
      spend: Math.round(baseDailySpend * variation),
    })
  }

  return data
}
