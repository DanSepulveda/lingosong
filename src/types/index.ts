import type {
  Exercise as PrismaExercise,
  GrammarPoint as PrismaGrammarPoint,
  Vocabulary as PrismaVocabulary,
} from "@generated/prisma/client"

export interface YoutubeVideoData {
  title: string
  channelTitle: string
  language: string
  duration: number
  thumbnailUrl: string
  categoryId: string
  embeddable: boolean
}

export interface BaseLyricLine {
  time: number | null
  text: string
  translation: string
}

export interface LyricLine extends BaseLyricLine {
  romanization: string
}

export interface Example {
  originalLanguage: string
  translation: string
  romanization: string
}

export interface ProcessVideoData {
  title: string
  artist: string
  funFact: string
  ytData: YoutubeVideoData
}

export interface Vocabulary extends Omit<
  PrismaVocabulary,
  "id" | "songId" | "createdAt" | "updatedAt" | "comment"
> {
  examples: {
    originalLanguage: string
    translation: string
    romanization: string
  }[]
  comment?: string
}

export interface GrammarPoint extends Omit<
  PrismaGrammarPoint,
  "id" | "songId" | "createdAt" | "updatedAt" | "comment"
> {
  examples: {
    originalLanguage: string
    translation: string
    romanization: string
  }[]
  comment?: string
}

export type Exercise = Omit<
  PrismaExercise,
  "id" | "songId" | "createdAt" | "updatedAt"
>
