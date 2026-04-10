import { notFound } from "next/navigation"

import { dbService } from "@/services/db"

import { Footer } from "@/components/sections/footer"
import { Header } from "@/components/sections/header"
import { ExercisesTab } from "@/components/song/tabs/exercises-tab"
import { GrammarTab } from "@/components/song/tabs/grammar-tab"
import { VocabularyTab } from "@/components/song/tabs/vocabulary-tab"
import { Player } from "@/components/song/video-player"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

function SongTitle({
  artist,
  title,
  className = "",
}: {
  artist: string
  title: string
  className?: string
}) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
      <span className="text-muted-foreground">{artist}</span>
    </div>
  )
}

export default async function SongPage({ params }: PageProps) {
  const { id: youtubeId } = await params

  const savedSong = await dbService.getByYoutubeId(youtubeId)
  if (!savedSong) notFound()

  const {
    title,
    artist,
    thumbnailUrl,
    exercises,
    grammarPoints,
    lyrics,
    vocabulary,
  } = savedSong

  return (
    <main className="section py-5 lg:w-full">
      <Header />

      <div className="pt-14">
        <SongTitle artist={artist} title={title} className="mb-6 lg:hidden" />

        <div className="mx-auto grid w-full max-w-lg grid-cols-1 gap-8 lg:max-w-full lg:grid-cols-2">
          <section>
            <Player
              alt={`${title} - ${artist}`}
              lyrics={lyrics}
              thumbnailUrl={thumbnailUrl}
              youtubeId={youtubeId}
            />
          </section>

          <section className="w-full lg:max-h-screen">
            <SongTitle
              artist={artist}
              title={title}
              className="mb-6 hidden lg:block"
            />
            <Tabs defaultValue="vocabulary">
              <TabsList className="w-full lg:mb-2">
                <TabsTrigger value="vocabulary">Vocabulario</TabsTrigger>
                <TabsTrigger value="grammar">Gramática</TabsTrigger>
                <TabsTrigger value="exercises">Ejercicios</TabsTrigger>
              </TabsList>

              <div className="w-full lg:h-[64vh] lg:overflow-y-scroll">
                <TabsContent value="vocabulary" className="m-0 p-4">
                  <VocabularyTab vocabulary={vocabulary} />
                </TabsContent>
                <TabsContent value="grammar" className="m-0 p-4">
                  <GrammarTab grammarPoints={grammarPoints} />
                </TabsContent>
                <TabsContent value="exercises" className="m-0 p-4">
                  <ExercisesTab exercises={exercises} />
                </TabsContent>
              </div>
            </Tabs>
          </section>
        </div>
      </div>

      <div className="lg:hidden">
        <Footer />
      </div>
    </main>
  )
}
