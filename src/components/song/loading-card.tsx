"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import { CheckIcon, CircleIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

const LOADING_STEPS = [
  { label: "Obteniendo letra original...", duration: 1000 },
  { label: "Traduciendo versos...", duration: 3500 },
  { label: "Analizando gramática...", duration: 5000 },
  { label: "Preparando lección...", duration: 7000 },
]

export function LoadingCard({
  thumbnailUrl,
  fact,
  artist,
  title,
}: {
  thumbnailUrl: string
  fact: string
  artist: string
  title: string
}) {
  const [currentStep, setCurrentStep] = useState(0)

  const startSimulation = () => {
    let time = 0
    let step = 0

    const interval = setInterval(() => {
      time += 500
      if (LOADING_STEPS[step].duration === time) {
        if (step < LOADING_STEPS.length - 1) {
          step++
          setCurrentStep(step)
        } else {
          clearInterval(interval)
        }
      }
    }, 500)

    return interval
  }

  useEffect(() => {
    startSimulation()
  }, [])

  return (
    <div className="fixed top-0 left-0 z-50 flex min-h-screen w-full animate-in items-center justify-center bg-black/40 px-4 backdrop-blur-sm duration-500 fade-in">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center">
          <h3 className="mb-2 font-heading text-xl font-bold text-primary">
            {title} - {artist}
          </h3>
          <Image
            src={thumbnailUrl}
            alt={`${title} - ${artist}`}
            width="384"
            height="216"
            className="mb-6 aspect-video rounded-lg border border-border"
          />
          <div className="max-w-sm">
            <h3 className="font-heading font-semibold">Dato interesante</h3>
            <p className="text-muted-foreground">{fact}</p>
          </div>

          <div className="mt-8 space-y-3">
            {LOADING_STEPS.map((step, index) => {
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep

              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 transition-opacity duration-500 ${isCompleted || isCurrent ? "opacity-100" : "opacity-30"}`}
                >
                  {isCompleted ? (
                    <CheckIcon className="size-4 text-primary" />
                  ) : isCurrent ? (
                    <Spinner />
                  ) : (
                    <CircleIcon className="size-4 text-muted-foreground" />
                  )}
                  <span
                    className={
                      isCurrent
                        ? "font-medium text-foreground"
                        : "font-medium text-muted-foreground"
                    }
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
