/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Prisma } from "@generated/prisma/client"

import { ExerciseCard } from "../exercise"

type Exercise = Prisma.ExerciseGetPayload<{}>

export function ExercisesTab({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="space-y-6">
      <p className="mb-4 text-sm text-muted-foreground">
        Ejercicios para practicar vocabulario
      </p>

      {exercises.map((item) => (
        <ExerciseCard
          key={item.id}
          question={item.question}
          correct={item.answer}
        />
      ))}
    </div>
  )
}
