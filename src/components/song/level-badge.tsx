import { cn } from "@/lib/utils"

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

const levelColors = {
  A1: "bg-emerald-100/80 text-emerald-800",
  A2: "bg-emerald-400/80 text-emerald-950",
  B1: "bg-amber-200/80 text-amber-700",
  B2: "bg-amber-400/80 text-amber-950",
  C1: "bg-red-200/80 text-red-800",
  C2: "bg-red-400/80 text-red-950",
} as const

export function LevelBadge({
  level,
  className,
}: {
  level: Level
  className?: string
}) {
  return (
    <div
      className={cn(
        className,
        "rounded-md p-1.5 font-heading text-sm leading-none font-bold backdrop-blur-sm",
        levelColors[level]
      )}
    >
      {level}
    </div>
  )
}
