import type { Brand, ChildSite } from "@/types"

export const mockBrands: Brand[] = [
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

export const mockChildSitesByBrand: Record<string, ChildSite[]> = {
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
