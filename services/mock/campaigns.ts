import type { Campaign } from "@/types/campaigns"

/** Account balance in USD (mock). */
export const MOCK_ACCOUNT_BALANCE = 12450

/** Mock ad creatives linked to campaigns. */
export interface MockAd {
  id: string
  name: string
  /** Primary campaign for backwards compatibility. */
  campaignId: string
  /** All campaigns this creative is used in. */
  campaignIds?: string[]
  status: "active" | "paused" | "pending"
  duration?: string
  image?: string
  video?: string
  uploadedAt?: string
}

const SAMPLE_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4"

export const mockAds: MockAd[] = [
  {
    id: "a1",
    name: "Summer 30s Spot",
    campaignId: "c1",
    campaignIds: ["c1", "c2", "c3", "c4"],
    status: "active",
    duration: "30s",
    uploadedAt: "2026-02-10",
    image: "/images/ads/ad-doctor.jpg",
    video: SAMPLE_VIDEO,
  },
  {
    id: "a2",
    name: "Brand Hero Video",
    campaignId: "c1",
    status: "active",
    duration: "15s",
    uploadedAt: "2026-02-12",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "a3",
    name: "Q3 Promo Banner",
    campaignId: "c2",
    status: "pending",
    duration: "—",
    uploadedAt: "2026-02-18",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop",
    video: SAMPLE_VIDEO,
  },
  {
    id: "a4",
    name: "Radio Jingle",
    campaignId: "c3",
    status: "paused",
    duration: "60s",
    uploadedAt: "2026-02-05",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop",
    video: SAMPLE_VIDEO,
  },
  {
    id: "a5",
    name: "Sports Highlight",
    campaignId: "c6",
    status: "active",
    duration: "20s",
    uploadedAt: "2026-02-20",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=200&fit=crop",
    video: SAMPLE_VIDEO,
  },
  {
    id: "a6",
    name: "Launch Teaser",
    campaignId: "c5",
    status: "pending",
    duration: "10s",
    uploadedAt: "2026-02-22",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop",
    video: SAMPLE_VIDEO,
  },
  {
    id: "a7",
    name: "Summer 15s Cutdown",
    campaignId: "c1",
    status: "active",
    duration: "15s",
    uploadedAt: "2026-02-24",
    // Reuse same creative file as a1 to simulate shared asset
    image: "/images/ads/ad-doctor.jpg",
    video: SAMPLE_VIDEO,
  },
  {
    id: "a8",
    name: "Retail Push Variant A",
    campaignId: "c2",
    status: "active",
    duration: "20s",
    uploadedAt: "2026-02-23",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop",
    video: SAMPLE_VIDEO,
  },
  {
    id: "a9",
    name: "Retail Push Variant B",
    campaignId: "c2",
    status: "paused",
    duration: "30s",
    uploadedAt: "2026-02-25",
    // Same creative file as Variant A, different campaign usage
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop",
    video: SAMPLE_VIDEO,
  },
  {
    id: "a10",
    name: "Holiday Reuse Spot",
    campaignId: "c4",
    status: "active",
    duration: "30s",
    uploadedAt: "2026-02-26",
    // Shares the doctor creative with summer campaign
    image: "/images/ads/ad-doctor.jpg",
    video: SAMPLE_VIDEO,
  },
]

/** Last 14 days balance history for sparkline (mock). */
export const MOCK_BALANCE_HISTORY = [
  11200, 11580, 11820, 12100, 11950, 12200, 12450,
]

export const mockCampaigns: Campaign[] = [
  {
    id: "c1",
    name: "Summer Brand Awareness",
    status: "active",
    objective: "Brand awareness",
    budget: 15000,
    spent: 8420,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    impressions: 1240000,
    clicks: 18200,
    channelsCount: 8,
    createdAt: "2025-05-15T10:00:00Z",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
    totalQty: 1000,
    usedQty: 370,
    channelNames: ["TV", "Display", "Social"],
  },
  {
    id: "c2",
    name: "Q3 Retail Push",
    status: "scheduled",
    objective: "Conversions",
    budget: 25000,
    spent: 0,
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    impressions: 0,
    clicks: 0,
    channelsCount: 12,
    createdAt: "2025-06-10T14:30:00Z",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop",
    totalQty: 2000,
    usedQty: 0,
    channelNames: ["TV", "Radio", "OOH", "Display"],
  },
  {
    id: "c3",
    name: "Local Radio Spots",
    status: "paused",
    objective: "Reach",
    budget: 5000,
    spent: 2100,
    startDate: "2025-05-01",
    endDate: "2025-06-30",
    impressions: 320000,
    clicks: 0,
    channelsCount: 3,
    createdAt: "2025-04-20T09:00:00Z",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop",
    totalQty: 500,
    usedQty: 420,
    channelNames: ["Radio"],
  },
  {
    id: "c4",
    name: "Holiday Campaign 2024",
    status: "ended",
    objective: "Conversions",
    budget: 40000,
    spent: 39850,
    startDate: "2024-11-15",
    endDate: "2024-12-31",
    impressions: 2100000,
    clicks: 45000,
    channelsCount: 15,
    createdAt: "2024-10-28T11:00:00Z",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop",
    totalQty: 3000,
    usedQty: 3000,
    channelNames: ["TV", "Radio", "Display", "Social", "OOH"],
  },
  {
    id: "c5",
    name: "New Product Launch",
    status: "draft",
    objective: "Brand awareness",
    budget: 20000,
    spent: 0,
    startDate: "2025-09-01",
    endDate: "2025-10-31",
    impressions: 0,
    clicks: 0,
    channelsCount: 0,
    createdAt: "2025-06-01T16:00:00Z",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=200&fit=crop",
    totalQty: 1500,
    usedQty: 0,
    channelNames: [],
  },
  {
    id: "c6",
    name: "Sports Season Promo",
    status: "active",
    objective: "Reach",
    budget: 12000,
    spent: 5600,
    startDate: "2025-06-15",
    endDate: "2025-07-31",
    impressions: 890000,
    clicks: 12400,
    channelsCount: 5,
    createdAt: "2025-06-01T08:00:00Z",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop",
    totalQty: 800,
    usedQty: 210,
    channelNames: ["TV", "Streaming", "Social"],
  },
]
