import { YOUTUBE_CONFIG } from "@/config/services"
import { durationToSeconds } from "@/lib/utils"

import type { YoutubeVideoData } from "@/types"

type ExclusionResult = { excluded: true; reason: string } | { excluded: false }

const getVideoData = async (youtubeId: string): Promise<YoutubeVideoData> => {
  const params = new URLSearchParams({
    id: youtubeId,
    part: YOUTUBE_CONFIG.parts,
    key: YOUTUBE_CONFIG.apiKey,
  })
  const url = `${YOUTUBE_CONFIG.baseUrl}/videos?${params}`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch YouTube data")

    const data = await res.json()
    const video = data.items[0]
    if (!video) throw new Error("Video not found")

    const duration = durationToSeconds(video.contentDetails.duration)
    const {
      categoryId,
      channelTitle,
      defaultAudioLanguage,
      thumbnails,
      title,
    } = video.snippet

    const { embeddable } = video.status

    return {
      title,
      channelTitle,
      language: defaultAudioLanguage,
      duration,
      thumbnailUrl: thumbnails.maxres.url,
      categoryId,
      embeddable,
    }
  } catch (error) {
    throw new Error("Youtube Service Error: " + String(error))
  }
}

const checkExclusion = (data: YoutubeVideoData): ExclusionResult => {
  let reason: string | null = null

  if (data.categoryId !== YOUTUBE_CONFIG.musicId) {
    reason = "Este video no pertenece a una categoría musical."
  }

  if (!data.embeddable) {
    reason = "No se puede mostrar este video por políticas de YouTube."
  }

  if (reason) return { excluded: true, reason }
  return { excluded: false }
}

export const ytService = {
  getVideoData,
  checkExclusion,
}
