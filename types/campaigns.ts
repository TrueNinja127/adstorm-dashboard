/**
 * Domain types for Campaigns feature
 */

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "ended"

export interface Campaign {
  id: string
  name: string
  status: CampaignStatus
  objective: string
  budget: number
  spent: number
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  channelsCount: number
  createdAt: string
  /** Optional preview/thumbnail image for the campaign. */
  image?: string
  /** Total quantity (e.g. impressions or deliveries) allocated for the campaign. */
  totalQty: number
  /** Quantity already used/delivered; remaining = totalQty - usedQty. */
  usedQty: number
  /** Optional channel names for display (e.g. TV, Radio, Display). */
  channelNames?: string[]
}
