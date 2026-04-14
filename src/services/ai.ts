import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import * as z from "zod"

import { AI_CONFIG } from "@/config/services"
import logger from "@/lib/logger"

import type { GrammarPoint, Vocabulary } from "@/types"

interface Usage {
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
}

interface SongInfoResult {
  result: {
    title: string
    artist: string
    funFact: string
  }
  totalUsage: Usage
}

interface TranslateLinesResponse {
  result: {
    translation: string
    romanization: string
  }[]
  totalUsage: Usage
}

interface GenerateLessonResponse {
  result: {
    vocabulary: Vocabulary[]
    grammarPoints: GrammarPoint[]
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  }
  totalUsage: Usage
}

const getSongInfo = async (
  title: string,
  channel: string
): Promise<SongInfoResult> => {
  const prompt = `Extract the actual song name (title field) and artist (artist field) from this YouTube video metadata, and generate a fun fact (funFact field) about the song and/or artist.

Video Title: "${title}"
Channel Name: "${channel}"

Instructions:
1. Ignore common YouTube clutter in the title like:
  - "(Official Video)", "(Official Music Video)", "(Lyrics)", "(Audio)", "(Live)"
  - "|", "[]", "()", "【】", "-" separators and their contents
  - "HD", "4K", "Remastered", "Cover", "Reaction", "Review"
  - "ft.", "feat.", "x", "&" (these indicate features, not the main artist)

2. If the channel name matches an artist name, use that as a strong signal

3. For the artist field:
  - Return the primary artist/band name
  - For collaborations, return the main artist (first one listed)

4. For the title field:
  - Return the clean song name without descriptors

5. For the funFact field:
  - Generate an interesting fact about the song (release, meaning, production, chart performance) or the artist (career, curiosities, awards)
  - Avoid generic or obvious fact — prioritize surprising or lesser-known information
  - Write the fact in Spanish

Return ONLY the JSON object. No additional text.`

  try {
    const { text, totalUsage, finishReason } = await generateText({
      model: google(AI_CONFIG.model),
      prompt,
      maxOutputTokens: AI_CONFIG.maxOutputTokens.songInfo,
    })

    if (finishReason !== "stop") {
      logger.warn(
        { finishReason, totalUsage },
        "[GetSongInfo] AI generation did not finish normally"
      )
    }

    const cleaned = text.replace(/```json|```/g, "").trim()
    const parsed = z
      .object({
        title: z.string(),
        artist: z.string(),
        funFact: z.string(),
      })
      .parse(JSON.parse(cleaned))

    const { inputTokens, outputTokens, totalTokens } = totalUsage
    return {
      result: parsed,
      totalUsage: { inputTokens, outputTokens, totalTokens },
    }
  } catch (error) {
    throw new Error("[GetSongInfo] AI Service Error: " + String(error))
  }
}

const translateLines = async (
  lyrics: string[],
  language: string
): Promise<TranslateLinesResponse> => {
  const prompt = `You are a professional music translator and lyric interpreter.

You will receive an array of song lyrics. The primary language of the song is ${language}, but some lines may appear in other languages. Translate every line into Spanish, regardless of which language it is in.

Translation guidelines:
- Prioritize natural, poetic language over literal translation
- Preserve the emotional tone and mood of each line
- Maintain the rhythm and flow when possible, so the translation feels singable
- Consider idiomatic expressions — translate the feeling, not just the words
- Keep slang, colloquialisms, or cultural references meaningful in the target language
- Preserve intentional repetition, wordplay, or emphasis from the original

Context awareness:
- Read all lines as a whole before translating — understand the story the song tells
- Maintain consistency in how you refer to people, places, and emotions throughout
- If a line is ambiguous, choose the interpretation that best fits the surrounding lines

Output rules:
- Return ONLY a valid JSON array — no markdown, no explanations
- Each element must be an object with two fields - these two fields are mandatory for every object:
  - "translation": the translated line in spanish
  - "romanization": the romanized version of the ORIGINAL line (e.g. Romaji for Japanese, Pinyin for Chinese, Latin transliteration for Russian/Arabic/etc). If the original line uses a Latin-based alphabet, set this to an empty string ""
- The array must have the exact same number of elements as the input, ${lyrics.length} - this is mandatory.
- Empty strings in the input must return { "translation": "", "romanization": "" }
- Maintain the original order

Input: ${lyrics}`

  try {
    const { text, totalUsage, finishReason } = await generateText({
      model: google(AI_CONFIG.model),
      prompt,
      maxOutputTokens: AI_CONFIG.maxOutputTokens.translation,
    })

    if (finishReason !== "stop") {
      logger.warn(
        { finishReason, totalUsage },
        "[TranslateLyrics] AI generation did not finish normally"
      )
    }

    const cleaned = text.replace(/```json|```/g, "").trim()
    const parsed = z
      .array(z.object({ translation: z.string(), romanization: z.string() }))
      .length(lyrics.length)
      .parse(JSON.parse(cleaned))

    const { inputTokens, outputTokens, totalTokens } = totalUsage
    return {
      result: parsed,
      totalUsage: { inputTokens, outputTokens, totalTokens },
    }
  } catch (error) {
    throw new Error("[TranslateLyrics] AI Service Error: " + String(error))
  }
}

const generateLesson = async (
  lyrics: string[],
  language: string
): Promise<GenerateLessonResponse> => {
  const prompt = `You are a language learning content creator specialized in teaching through music.

You will receive the full lyrics of a song in ${language}. Your task is to extract vocabulary and grammar points that are valuable for Spanish-speaking learners.

---

VOCABULARY instructions:
- Select 8 to 12 words or short expressions that are relevant and useful to learn
- Prioritize words that are: frequently used in everyday speech, emotionally expressive, or characteristic of the song's register (formal, colloquial, poetic, etc.)
- Avoid extremely basic words (I, you, the, is) unless used in a particularly interesting way
- For each word provide:
  - "word": the word or short expression as it appears (or base/infinitive form if conjugated)
  - "type": grammatical category in English (verb, noun, adjective, adverb, expression, phrasal verb, etc.)
  - "level": CEFR level — one of: A1, A2, B1, B2, C1, C2
  - "pronunciation": IPA pronunciation (e.g. /ˈwɔːtər/)
  - "contextSentence": the exact line from the lyrics where the word appears
  - "meaning": clear explanation in Spanish of what the word means in this context
  - "examples": array of EXACTLY 2 to 3 objects — never less than 2, this is required, showing the word used in different sentences, each with:
    - "originalLanguage": example sentence in ${language}
    - "translation": translation of the sentence in Spanish
    - "romanization": romanized version of the sentence if ${language} uses a non-Latin alphabet, otherwise ""
  - "comment": an optional note in Spanish about register, regional usage, false friends, or anything a learner would find valuable — omit the field if there's nothing relevant to add

---

GRAMMAR instructions:
- Select 3 to 5 grammar points illustrated by the lyrics
- Prioritize structures that are: commonly used, potentially confusing for Spanish speakers, or characteristic of the language's style
- For each grammar point provide:
  - "title": short descriptive name of the grammar structure in Spanish (e.g. "Presente perfecto con 'since'", "Inversión en preguntas indirectas")
  - "level": CEFR level — one of: A1, A2, B1, B2, C1, C2
  - "contextSentence": the exact line from the lyrics that illustrates this grammar point
  - "explanation": clear explanation in Spanish of the grammar rule, why it works this way, and how it differs from Spanish if relevant
  - "examples": array of EXACTLY 2 to 3 objects — never less than 2, this is required — showing the grammar point in different sentences, each with:
    - "originalLanguage": example sentence in ${language}
    - "translation": translation in Spanish
    - "romanization": romanized version if applicable, otherwise ""
  - "comment": optional note in Spanish about exceptions, regional variations, or common mistakes — omit if not needed

---

LEVEL instructions:
- Return the general level of the song (one of "A1", "A2", "B1", "B2", "C1", "C2") where "A1" is for easy songs and "C2" is for hardest ones
- Take in consideration de difficulty level for spanish native speakers
- Those level are based on The Common European Framework of Reference for Languages

---

Output rules:
- Return ONLY a valid JSON object with 3 fields: "vocabulary", "grammarPoints" and "level"
- Each field contains contains the data following the structure above
- No markdown, no explanations, no extra text — just the raw JSON object
- All explanations, meanings, and comments must be written in Spanish

Input lyrics: ${lyrics}`

  try {
    const { text, totalUsage, finishReason } = await generateText({
      model: google(AI_CONFIG.model),
      prompt,
      maxOutputTokens: AI_CONFIG.maxOutputTokens.lesson,
    })

    if (finishReason !== "stop") {
      logger.warn(
        { finishReason, totalUsage },
        "[GenerateLesson] AI generation did not finish normally"
      )
    }

    const exampleSchema = z.object({
      originalLanguage: z.string(),
      translation: z.string(),
      romanization: z.string(),
    })

    const mcerLevel = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"])

    const learningContentSchema = z.object({
      vocabulary: z
        .array(
          z.object({
            word: z.string(),
            type: z.string(),
            level: mcerLevel,
            pronunciation: z.string(),
            contextSentence: z.string(),
            meaning: z.string(),
            examples: z.array(exampleSchema).min(1).max(3),
            comment: z.string().optional(),
          })
        )
        .min(8)
        .max(12),
      grammarPoints: z
        .array(
          z.object({
            title: z.string(),
            level: mcerLevel,
            contextSentence: z.string(),
            explanation: z.string(),
            examples: z.array(exampleSchema).min(1).max(3),
            comment: z.string().optional(),
          })
        )
        .min(3)
        .max(5),
      level: mcerLevel,
    })

    const cleaned = text.replace(/```json|```/g, "").trim()
    const parsed = learningContentSchema.parse(JSON.parse(cleaned))

    const { inputTokens, outputTokens, totalTokens } = totalUsage
    return {
      result: parsed,
      totalUsage: { inputTokens, outputTokens, totalTokens },
    }
  } catch (error) {
    throw new Error("[GenerateLesson] AI Service Error: " + String(error))
  }
}

export const aiService = {
  getSongInfo,
  translateLines,
  generateLesson,
}
