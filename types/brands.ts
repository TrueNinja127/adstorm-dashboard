/**
 * Domain types for Brands feature
 */

export interface Brand {
  id: string
  title: string
  description: string
  image: string
  category: string
  sitesCount: number
  channelsCount: number
}

export interface ChildSite {
  id: string
  name: string
  image: string
  type: string
  location: string
  audience: string
  gender: string
  age: string
  income: string
}
