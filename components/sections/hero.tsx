"use client"

import { useState } from "react"

import { Music2, Sparkles, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

export function HeroSection() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      alert(youtubeUrl)
    } catch {
      setError("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center px-6 py-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 size-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Badge
          variant="secondary"
          className="mb-6 h-8 border border-border px-4 py-2 text-sm text-muted-foreground"
        >
          <Sparkles className="size-4 text-primary" />
          Aprende mientras escuchas
        </Badge>

        <h1 className="tracking-tigh mb-6 font-heading text-4xl font-bold text-balance md:text-6xl lg:text-7xl">
          Aprende idiomas con
          <br />
          <span className="text-primary text-shadow-background text-shadow-lg">
            tus canciones favoritas
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-balance text-muted-foreground md:text-xl">
          Vocabulario, gramática y pronunciación, todo a través de la música.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
          <div className="mb-4 h-3 text-sm text-destructive">{error}</div>
          <InputGroup className="h-12 rounded-full bg-secondary sm:h-14">
            <InputGroupAddon align="inline-start" className="hiddena sm:inline">
              <Music2 className="mx-2 size-4 shrink-0 text-muted-foreground sm:mx-3 sm:size-5" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Pega el enlace de YouTube aquí..."
              className="py-3 sm:ml-0 md:text-base"
              disabled={loading}
            />
            <InputGroupAddon align="inline-end" className="ml-4">
              <InputGroupButton
                variant="default"
                className="h-9 w-10 px-4 font-semibold sm:h-10 sm:w-44"
                type="submit"
                disabled={loading}
              >
                <span className="hidden sm:inline">
                  {loading ? "Generando" : "Generar lección"}
                </span>
                {loading ? (
                  <Spinner className="sm:ml-2" />
                ) : (
                  <Zap className="size-4 fill-current sm:ml-2" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>

        <p className="mt-4 text-xs text-balance text-muted-foreground">
          * Para mejores resultados, usa el enlace de la versión oficial de la
          canción.
        </p>
      </div>
    </section>
  )
}
