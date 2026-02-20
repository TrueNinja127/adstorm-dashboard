import type { SiteOrLocation } from "@/types"

export const LOCATION_PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&h=200&fit=crop"

export const mockSitesAndLocations: SiteOrLocation[] = [
  { id: "1", type: "site", name: "TechFlow Media", subtitle: "techflow.com", category: "Technology", region: "California", available: true, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop", stateName: "California", cityName: "San Francisco", channelsCount: 12, citiesCount: 4, metric: "2.4M impressions/mo", price: 249, brandId: "1" },
  { id: "2", type: "site", name: "Lifestyle Daily", subtitle: "lifestyledaily.com", category: "Lifestyle", region: "Florida", available: true, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop", stateName: "Florida", cityName: "Miami", channelsCount: 8, citiesCount: 3, metric: "1.8M impressions/mo", price: 189, brandId: "2" },
  { id: "3", type: "location", name: "California", subtitle: "State", category: "Geo", region: "California", available: true, image: LOCATION_PLACEHOLDER_IMAGE, stateName: "California", cityName: "State-wide", channelsCount: 24, citiesCount: 58, metric: "~39M reach", price: 1299, brandId: "1" },
  { id: "4", type: "site", name: "News Daily", subtitle: "newsdaily.com", category: "News", region: "New York", available: true, image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop", stateName: "New York", cityName: "New York City", channelsCount: 18, citiesCount: 6, metric: "3.1M impressions/mo", price: 319, brandId: "4" },
  { id: "5", type: "location", name: "Texas", subtitle: "State", category: "Geo", region: "Texas", available: true, image: LOCATION_PLACEHOLDER_IMAGE, stateName: "Texas", cityName: "State-wide", channelsCount: 32, citiesCount: 254, metric: "~29M reach", price: 999, brandId: "3" },
  { id: "6", type: "site", name: "Finance Hub", subtitle: "financehub.com", category: "Finance", region: "New York", available: true, image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop", stateName: "New York", cityName: "New York City", channelsCount: 6, citiesCount: 2, metric: "1.2M impressions/mo", price: 149, brandId: "6" },
  { id: "7", type: "location", name: "New York", subtitle: "State", category: "Geo", region: "New York", available: false, image: LOCATION_PLACEHOLDER_IMAGE, stateName: "New York", cityName: "State-wide", channelsCount: 28, citiesCount: 62, metric: "~20M reach", price: 899, brandId: "4" },
  { id: "8", type: "site", name: "Auto World", subtitle: "autoworld.com", category: "Automotive", region: "Michigan", available: true, image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=200&fit=crop", stateName: "Michigan", cityName: "Detroit", channelsCount: 5, citiesCount: 3, metric: "890K impressions/mo", price: 99, brandId: "8" },
  { id: "9", type: "location", name: "Florida", subtitle: "State", category: "Geo", region: "Florida", available: true, image: LOCATION_PLACEHOLDER_IMAGE, stateName: "Florida", cityName: "State-wide", channelsCount: 22, citiesCount: 67, metric: "~22M reach", price: 849, brandId: "2" },
  { id: "10", type: "site", name: "Travel Channel", subtitle: "travelchannel.com", category: "Travel", region: "Florida", available: true, image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop", stateName: "Florida", cityName: "Orlando", channelsCount: 14, citiesCount: 5, metric: "1.5M impressions/mo", price: 169, brandId: "9" },
  { id: "11", type: "location", name: "Washington", subtitle: "State", category: "Geo", region: "Washington", available: true, image: LOCATION_PLACEHOLDER_IMAGE, stateName: "Washington", cityName: "State-wide", channelsCount: 16, citiesCount: 39, metric: "~7.6M reach", price: 449, brandId: "1" },
  { id: "12", type: "site", name: "Fashion Forward", subtitle: "fashionforward.com", category: "Fashion", region: "California", available: false, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", stateName: "California", cityName: "Los Angeles", channelsCount: 9, citiesCount: 2, metric: "720K impressions/mo", price: 79, brandId: "10" },
  { id: "13", type: "location", name: "Illinois", subtitle: "State", category: "Geo", region: "Illinois", available: true, image: LOCATION_PLACEHOLDER_IMAGE, stateName: "Illinois", cityName: "State-wide", channelsCount: 20, citiesCount: 102, metric: "~12.6M reach", price: 599, brandId: "3" },
  { id: "14", type: "site", name: "Sports Arena", subtitle: "sportsarena.com", category: "Sports", region: "Texas", available: true, image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop", stateName: "Texas", cityName: "Houston", channelsCount: 7, citiesCount: 4, metric: "1.1M impressions/mo", price: 119, brandId: "3" },
]

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
] as const
