/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"

import { Lightbulb } from "lucide-react"

import { Prisma } from "@/lib/generated/prisma/client"

import { LevelBadge } from "@/components/song/level-badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import type { Example } from "@/types"

type Vocabulary = Prisma.VocabularyGetPayload<{}>

export function VocabularyTab({ vocabulary }: { vocabulary: Vocabulary[] }) {
  return (
    <div className="space-y-6">
      <p className="mb-4 text-sm text-muted-foreground">
        Vocabulario clave extraído de la canción con ejemplos de uso.
      </p>

      {vocabulary.map((item, index) => (
        <Card
          key={index}
          className="overflow-hidden rounded-xl border border-border bg-secondary/50 py-0"
        >
          <CardHeader className="flex items-center gap-3 border-b border-border py-6">
            <div>
              <span className="font-semibold text-primary">{item.word}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                {item.pronunciation}
              </span>
              <span className="ml-2 rounded-md bg-primary/20 px-2 py-1 text-xs text-primary">
                {item.type}
              </span>
            </div>
            <LevelBadge level={item.level} className="ml-auto" />
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <p className="text-sm text-muted-foreground">{item.meaning}</p>

            <div className="rounded-lg bg-background/50 p-3">
              <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Ejemplo en la canción
              </p>
              <p className="text-sm text-primary">{item.contextSentence}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Otros ejemplos
              </p>
              <div className="space-y-2">
                {item.examples &&
                  (item.examples as unknown as Example[]).map(
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

            {item.comment && (
              <CardFooter className="flex gap-3 rounded-lg bg-primary/10 p-3">
                <Lightbulb className="size-4 shrink-0 text-primary" />
                <p className="text-sm">{item.comment}</p>
              </CardFooter>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
