/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Prisma } from "@generated/prisma/client"
import { BookOpen, Lightbulb } from "lucide-react"

import { LevelBadge } from "@/components/song/level-badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Example } from "@/types"

type GrammarPoint = Prisma.GrammarPointGetPayload<{}>

export function GrammarTab({
  grammarPoints,
}: {
  grammarPoints: GrammarPoint[]
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Puntos gramaticales importantes encontrados en la letra de la canción.
      </p>

      {grammarPoints.map((topic) => (
        <Card
          key={topic.id}
          className="overflow-hidden rounded-xl border border-border bg-secondary/50 py-0"
        >
          <CardHeader className="flex items-center gap-3 border-b border-border py-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
              <BookOpen className="size-4 text-primary" />
            </div>
            <CardTitle className="font-semibold">{topic.title}</CardTitle>
            <LevelBadge level={topic.level} className="ml-auto" />
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            <p className="text-sm text-muted-foreground">{topic.explanation}</p>

            <div className="rounded-lg bg-background/50 p-3">
              <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Ejemplo en la canción
              </p>
              <p className="text-sm text-primary">{topic.contextSentence}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Otros ejemplos
              </p>
              <div className="space-y-2">
                {topic.examples &&
                  (topic.examples as unknown as Example[]).map(
                    (example, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-background/50 p-3"
                      >
                        <p className="text-sm font-medium text-primary">
                          {example.originalLanguage}
                        </p>
                        {example.romanization && (
                          <p className="text-sm font-medium text-muted-foreground">
                            {example.romanization}
                          </p>
                        )}
                        <p className="text-sm font-medium text-muted-foreground">
                          {example.translation}
                        </p>
                      </div>
                    )
                  )}
              </div>
            </div>

            {topic.comment && (
              <CardFooter className="flex gap-3 rounded-lg bg-primary/10 p-3">
                <Lightbulb className="size-4 shrink-0 text-primary" />
                <p className="text-sm">{topic.comment}</p>
              </CardFooter>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
