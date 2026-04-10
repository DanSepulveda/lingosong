import { env } from "./env"

export const AI_CONFIG = {
  model: env.GOOGLE_GENERATIVE_AI_MODEL_ID,
  maxOutputTokens: {
    songInfo: 3000,
    translation: 5000,
    lesson: 10000,
  },
  maxRetries: 3,
} as const

export const LYRICS_API_CONFIG = {
  baseUrl: "https://lrclib.net/api/get",
} as const

export const YOUTUBE_CONFIG = {
  apiKey: env.YOUTUBE_API_KEY ?? "",
  baseUrl: "https://www.googleapis.com/youtube/v3",
  parts: "snippet,contentDetails,status",
  musicId: "10",
} as const
