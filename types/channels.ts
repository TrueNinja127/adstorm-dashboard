/**
 * Domain types for Channels/Genres feature
 */

export type ChannelOrGenreType = "channel" | "genre"

export interface ChannelOrGenre {
  id: string
  type: ChannelOrGenreType
  name: string
  description: string
  category: string
  image: string
  sitesCount: number
  secondaryCount: number
  available: boolean
}
