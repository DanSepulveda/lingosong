import type { BaseLyricLine, Exercise, Vocabulary } from "@/types"

const generateFillInTheBlank = (
  lines: BaseLyricLine[],
  vocabulary: Vocabulary[]
): Exercise[] => {
  const vocabWords = new Set(vocabulary.map((v) => v.word.toLowerCase()))

  return lines
    .filter((line) => line.text.split(" ").length >= 4)
    .map((line) => {
      const words = line.text.split(" ")

      const vocabIndexes = words
        .map((w, i) => ({ w: w.replace(/[.,!?()]/g, "").toLowerCase(), i }))
        .filter(({ w }) => vocabWords.has(w))
        .map(({ i }) => i)

      const targetIndex =
        vocabIndexes.length > 0
          ? vocabIndexes[Math.floor(Math.random() * vocabIndexes.length)]
          : Math.floor(Math.random() * words.length)

      const answer = words[targetIndex].replace(/[.,!?()]/g, "")
      const question = words
        .map((w, i) => (i === targetIndex ? "___" : w))
        .join(" ")

      return { question, answer }
    })
}

export const exerciseService = {
  generateFillInTheBlank,
}

// TODO: modify to remove short words and limit exercises qty
