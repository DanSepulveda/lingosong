import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function durationToSeconds(duration: string) {
  const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/)

  const minutes = parseInt(match?.[1] || "0")
  const seconds = parseInt(match?.[2] || "0")

  return minutes * 60 + seconds
}

export function elapsed(start: number) {
  return `${Date.now() - start}ms`
}

export function formatQuery(query: string) {
  return query.toLowerCase().trim().replace(/\s+/g, "+")
}

export function timeStringToSeconds(time: string) {
  const [minutes, seconds] = time.split(":").map(Number)
  return minutes * 60 + seconds
}

export function getLanguageName(code: string, locale = "es") {
  const rawName =
    new Intl.DisplayNames([locale], {
      type: "language",
    }).of(code) || "-"

  const langName =
    rawName !== "-"
      ? (rawName.charAt(0).toUpperCase() + rawName.slice(1)).split(" ")[0]
      : "-"
  return langName
}
