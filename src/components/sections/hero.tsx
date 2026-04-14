"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { Music2, Sparkles, Zap } from "lucide-react"
import { toast } from "sonner"
import * as z from "zod"

import { generateLessonAction } from "@/actions/generate-lesson"
import { processVideoAction } from "@/actions/process-video"

import { LoadingCard } from "@/components/song/loading-card"
import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

import type { ProcessVideoData } from "@/types"

const youtubeUrlSchema = z
  .url("Debe ingresar un enlace válido")
  .refine(
    (url) =>
      new URL(url).host.includes("youtube.com") ||
      new URL(url).host.includes("youtu.be"),
    "Ingrese un enlace de YouTube"
  )
  .refine(
    (url) =>
      new URL(url).searchParams.get("v") !== null ||
      new URL(url).pathname !== null,
    "El enlace no contiene un video válido"
  )
  .transform(
    (url) =>
      (new URL(url).searchParams.get("v") as string) ??
      (new URL(url).pathname.replace("/", "") as string)
  )

export function HeroSection() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadingData, setLoadingData] = useState<ProcessVideoData | null>(null)
  const router = useRouter()

  const processVideo = async (videoId: string) => {
    try {
      const res = await processVideoAction(videoId)

      if (!res.success) throw new Error(res.errorMessage)

      if (!res.new) {
        router.push(`/cancion/${videoId}`)
        return
      }

      const { title, artist, funFact, ytData } = res.data
      setLoadingData({
        title,
        artist,
        funFact,
        ytData,
      })

      const lessonRes = await generateLessonAction({
        youtubeId: videoId,
        data: res.data,
      })

      if (!lessonRes.success) throw new Error(lessonRes.errorMessage)

      router.push(`/cancion/${videoId}`)
      toast.success("Lección generada exitosamente!")
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = youtubeUrlSchema.safeParse(youtubeUrl)
      if (!result.success) {
        setError(z.treeifyError(result.error).errors[0])
        return
      }

      await processVideo(result.data)
    } catch {
      setError("Debe ingresar un enlace válido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center px-6 py-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 size-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {loadingData && (
        <LoadingCard
          title={loadingData.title}
          artist={loadingData.artist}
          thumbnailUrl={loadingData.ytData.thumbnailUrl}
          fact={loadingData.funFact}
        />
      )}

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
