import { LYRICS_API_CONFIG } from "@/config/services"
import { formatQuery, timeStringToSeconds } from "@/lib/utils"

import type { BaseLyricLine } from "@/types"

type LyricType = "synced" | "plain" | "instrumental" | "none"

interface LyricsResult {
  type: LyricType
  lyrics: string | null
}

const getSongLyric = async (
  artist: string,
  title: string,
  duration: number
): Promise<LyricsResult> => {
  const params = new URLSearchParams({
    artist_name: formatQuery(artist),
    track_name: formatQuery(title),
    album_name: "",
    duration: String(duration),
  })

  try {
    const res = await fetch(`${LYRICS_API_CONFIG.baseUrl}?${params}`)
    if (!res.ok) throw new Error("Lyrics not found")

    const data = await res.json()
    const { instrumental, plainLyrics, syncedLyrics } = data

    if (instrumental) return { type: "instrumental", lyrics: null }
    if (syncedLyrics) return { type: "synced", lyrics: syncedLyrics }
    if (plainLyrics) return { type: "plain", lyrics: plainLyrics }

    return { type: "none", lyrics: null }
  } catch (error) {
    throw new Error("Lyrics Service Error: " + String(error))
  }
}

const parseSyncedLyrics = (input: string): BaseLyricLine[] => {
  const regex = /\[(\d{2}:\d{2}\.\d{2})\]\s*(.*)/
  const results: BaseLyricLine[] = []

  for (const line of input.split("\n")) {
    const match = line.match(regex)
    if (!match) continue

    const text = match[2].trim()
    if (!text) continue

    results.push({
      time: timeStringToSeconds(match[1]),
      text,
      translation: "",
    })
  }

  return results
}

const parsePlainLyrics = (input: string): BaseLyricLine[] => {
  return input
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => ({
      time: null,
      text: line.trim(),
      translation: "",
    }))
}

const parseLyrics = (input: string, type: LyricType) => {
  if (type === "synced") return parseSyncedLyrics(input)
  return parsePlainLyrics(input)
}

export const lyricService = {
  getSongLyric,
  parseLyrics,
  parsePlainLyrics,
  parseSyncedLyrics,
}
