/**
 * Shared dashboard / revenue types
 */

export type FilterPeriod = "28days" | "month" | "year"

export interface RevenueDataPoint {
  date: Date
  month: string
  day: string
  revenue: number
  spend: number
}
