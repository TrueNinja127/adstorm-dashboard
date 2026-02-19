/**
 * Domain types for Sites & Locations feature
 */

export type SiteOrLocationType = "site" | "location"

export interface SiteOrLocation {
  id: string
  type: SiteOrLocationType
  name: string
  subtitle: string
  category: string
  region: string
  available: boolean
  image: string
  stateName: string
  cityName: string
  channelsCount: number
  citiesCount: number
  metric: string
}
