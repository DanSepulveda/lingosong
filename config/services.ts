import { env } from "./env"

export const LYRICS_API_CONFIG = {
  baseUrl: "https://lrclib.net/api/get",
} as const

export const YOUTUBE_CONFIG = {
  apiKey: env.YOUTUBE_API_KEY ?? "",
  baseUrl: "https://www.googleapis.com/youtube/v3",
  parts: "snippet,contentDetails,status",
  musicId: "10",
} as const
