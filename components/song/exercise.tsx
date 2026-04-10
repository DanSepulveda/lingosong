"use client"

import { useState } from "react"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ExerciseCard({
  question,
  correct,
}: {
  question: string
  correct: string
}) {
  const [userResponse, setUserResponse] = useState("")

  const checkAnswer = (e: React.SubmitEvent) => {
    e.preventDefault()

    if (userResponse.trim().toLowerCase() === correct.toLowerCase()) {
      toast.success("Correcto!")
    } else {
      toast.error("Vuelve a intentarlo")
    }
  }

  return (
    <Card className="overflow-hidden rounded-xl border border-border bg-secondary/50 py-0">
      <CardContent className="space-y-4 p-4">
        <div>
          <p className="text-lg text-foreground">{question}</p>
        </div>
        <form onSubmit={checkAnswer}>
          <div className="flex gap-2">
            <Input
              type="text"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Tu respuesta"
            />
            <Button type="submit">Comprobar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
