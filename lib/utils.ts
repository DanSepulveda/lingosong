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
