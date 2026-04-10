import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"

const existsByYoutubeId = async (youtubeId: string) => {
  const song = await prisma.song.findUnique({
    where: { youtubeId },
    select: { id: true },
  })
  return song !== null
}

const getByYoutubeId = async (youtubeId: string) => {
  return await prisma.song.findUnique({
    where: { youtubeId },
    include: {
      lyrics: true,
      vocabulary: true,
      grammarPoints: true,
      exercises: true,
    },
  })
}

const saveSong = async (data: {
  song: Prisma.SongCreateInput
  lyric: Omit<Prisma.LyricCreateInput, "song">
  vocabulary: Omit<Prisma.VocabularyCreateInput, "song">[]
  grammarPoints: Omit<Prisma.GrammarPointCreateInput, "song">[]
  exercises: Omit<Prisma.ExerciseCreateInput, "song">[]
}) => {
  const { song, lyric, vocabulary, grammarPoints, exercises } = data

  return await prisma.$transaction(async (tx) => {
    const newSong = await tx.song.create({
      data: song,
    })

    await Promise.all([
      tx.lyric.create({
        data: { ...lyric, songId: newSong.id },
      }),
      tx.vocabulary.createMany({
        data: vocabulary.map((v) => ({ ...v, songId: newSong.id })),
      }),
      tx.grammarPoint.createMany({
        data: grammarPoints.map((g) => ({ ...g, songId: newSong.id })),
      }),
      tx.exercise.createMany({
        data: exercises.map((e) => ({ ...e, songId: newSong.id })),
      }),
    ])

    return newSong
  })
}

const getExcluded = async (youtubeId: string) => {
  const excluded = await prisma.excludedVideo.findUnique({
    where: { youtubeId },
  })
  return excluded
}

const addExcludedVideo = async (
  youtubeId: string,
  title: string,
  thumbnailUrl: string,
  reason: string
) => {
  return await prisma.excludedVideo.create({
    data: { youtubeId, title, thumbnailUrl, reason },
  })
}

const getRecentSongs = async () => {
  return await prisma.song.findMany({
    take: 9,
    orderBy: { createdAt: "desc" },
  })
}

export const dbService = {
  addExcludedVideo,
  existsByYoutubeId,
  getByYoutubeId,
  getExcluded,
  getRecentSongs,
  saveSong,
}
