"use server"

import logger from "@/lib/logger"
import { elapsed } from "@/lib/utils"
import { aiService } from "@/services/ai"
import { dbService } from "@/services/db"
import { ytService } from "@/services/youtube"

import type { ProcessVideoData } from "@/types"

interface ExistingSong {
  success: true
  new: false
}

interface ProcessVideoSuccess {
  success: true
  new: true
  data: ProcessVideoData
}

interface ProcessVideoError {
  success: false
  errorMessage: string
}

type ProcessVideoResult = ExistingSong | ProcessVideoSuccess | ProcessVideoError

export const processVideoAction = async (
  youtubeId: string
): Promise<ProcessVideoResult> => {
  try {
    // - Check if the video is registered as excluded or valid in DB
    const excluded = await dbService.getExcluded(youtubeId)
    if (excluded) throw new Error("Excluded: " + excluded.reason)

    const existingSong = await dbService.existsByYoutubeId(youtubeId)
    if (existingSong) return { success: true, new: false }

    // - Start processing new video
    // - Get video data from YouTube API and run checks
    const start = Date.now()
    logger.info({ youtubeId }, "Processing new video")

    const ytData = await ytService.getVideoData(youtubeId)
    const { title, channelTitle, thumbnailUrl } = ytData
    logger.info({ youtubeId, elapsed: elapsed(start) }, "YouTube data fetched")

    const exclusionResult = ytService.checkExclusion(ytData)
    if (exclusionResult.excluded) {
      const { reason } = exclusionResult
      await dbService.addExcludedVideo(youtubeId, title, thumbnailUrl, reason)
      throw new Error("Excluded: " + reason)
    }

    // - Use AI to get song info and fun fact
    const { result, totalUsage } = await aiService.getSongInfo(
      title,
      channelTitle
    )
    logger.info(
      { youtubeId, title, aiTokens: totalUsage, elapsed: elapsed(start) },
      "Video passed checks and was processed by AI"
    )

    const { title: cleanedTitle, artist, funFact } = result

    return {
      success: true,
      new: true,
      data: {
        title: cleanedTitle,
        artist,
        funFact,
        ytData,
      },
    }
  } catch (error) {
    logger.error({ youtubeId, err: error }, "Error processing video")

    let errorMessage = "Ocurrió un error al procesar el video."

    if (error instanceof Error) {
      if (error.message.startsWith("Excluded: ")) {
        errorMessage = error.message.replace("Excluded: ", "")
      }
      if (error.message.includes("not found")) {
        errorMessage =
          "No se encontró el video. Verifica que el enlace sea correcto."
      }
    }
    return { success: false, errorMessage }
  }
}
