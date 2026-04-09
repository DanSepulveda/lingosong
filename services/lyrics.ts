import { LYRICS_API_CONFIG } from "@/config/services"
import { formatQuery } from "@/lib/utils"

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

export const lyricService = {
  getSongLyric,
}
