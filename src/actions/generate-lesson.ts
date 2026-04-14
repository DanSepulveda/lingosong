"use server"

import logger from "@/lib/logger"
import { elapsed } from "@/lib/utils"
import { aiService } from "@/services/ai"
import { dbService } from "@/services/db"
import { exerciseService } from "@/services/exercise"
import { lyricService } from "@/services/lyrics"

import type { ProcessVideoData } from "@/types"

interface Props {
  youtubeId: string
  data: ProcessVideoData
}

export async function generateLessonAction({ youtubeId, data }: Props) {
  const { artist, title, ytData } = data
  const { duration, thumbnailUrl, language } = ytData

  try {
    // - Start generating new lesson
    // - Get lyrics using lyricsService
    const start = Date.now()
    logger.info({ youtubeId, title }, "Generating lesson for video")

    const { lyrics, type } = await lyricService.getSongLyric(
      artist,
      title,
      duration
    )
    logger.info({ youtubeId, title, elapsed: elapsed(start) }, "Lyrics fetched")

    if (!lyrics) {
      const reason =
        type === "instrumental"
          ? "Este video corresponde a una canción instrumental."
          : "No se pudieron encontrar las letras de esta canción."

      await dbService.addExcludedVideo(youtubeId, title, thumbnailUrl, reason)
      throw new Error("Excluded: " + reason)
    }

    const parsedLyrics = lyricService.parseLyrics(lyrics, type)
    const lines = parsedLyrics.map((line) => line.text)

    // - Generate lyrics translation and lesson content using AI
    const [translationData, lessonData] = await Promise.all([
      aiService.translateLines(lines, language),
      aiService.generateLesson(lines, language),
    ])

    logger.info(
      {
        youtubeId,
        title,
        translationTokens: translationData.totalUsage,
        lessonTokens: lessonData.totalUsage,
        elapsed: elapsed(start),
      },
      "Lesson generated successfully"
    )

    const { grammarPoints, vocabulary, level } = lessonData.result

    const translated = parsedLyrics.map((line, i) => ({
      ...line,
      translation: translationData.result[i].translation,
      romanization: translationData.result[i].romanization,
    }))

    // - Generate lesson exercises and save data to DB
    const exercises = exerciseService.generateFillInTheBlank(
      parsedLyrics,
      vocabulary
    )

    await dbService.saveSong({
      song: {
        artist,
        title,
        youtubeId,
        duration,
        language,
        thumbnailUrl,
        level,
      },
      lyric: {
        content: translated,
        source: "lrclib",
        isSynced: type === "synced",
      },
      vocabulary,
      grammarPoints,
      exercises,
    })

    logger.info(
      { youtubeId, title, elapsed: elapsed(start) },
      "Song saved in DB"
    )

    return {
      success: true,
      songId: youtubeId,
      lyrics: translated,
      lesson: lessonData.result,
    }
  } catch (error) {
    logger.error({ youtubeId, err: error }, "Error generating lesson")

    let errorMessage = "Ocurrió un error al generar la lección."

    if (error instanceof Error) {
      if (error.message.startsWith("Excluded: ")) {
        errorMessage = error.message.replace("Excluded: ", "")
      }
      if (error.message.includes("not found")) {
        errorMessage = "No se encontró la letra de la canción."
      }
    }
    return { success: false, errorMessage }
  }
}
