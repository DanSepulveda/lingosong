import Image from "next/image"
import Link from "next/link"

import { Play } from "lucide-react"

import { getLanguageName } from "@/lib/utils"
import { dbService } from "@/services/db"

import { LevelBadge } from "@/components/song/level-badge"

export async function RecentSongs() {
  const recentSongs = await dbService.getRecentSongs()

  return (
    <section className="py-10">
      <div className="section">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Canciones generadas recientemente
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Comienza rápidamente con una de estas canciones
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recentSongs.map((song) => (
            <Link
              prefetch={false}
              key={song.id}
              href={`/cancion/${song.youtubeId}`}
              className="group relative block overflow-hidden rounded-xl border border-border bg-card text-left transition-all duration-300 hover:border-primary/50"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={song.thumbnailUrl}
                  alt={`${song.title} - ${song.artist}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={500}
                  height={200}
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/40 to-black"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                    <Play className="ml-1 h-6 w-6 fill-current text-primary-foreground" />
                  </div>
                </div>
                <div className="leading-nonte absolute top-3 left-3 rounded-md bg-background/60 px-2 py-1 font-heading text-sm font-medium backdrop-blur-sm">
                  {getLanguageName(song.language)}
                </div>
                <LevelBadge
                  level={song.level}
                  className="absolute top-3 right-3"
                />
                <h3 className="absolute bottom-3 left-3 font-semibold text-zinc-50 transition-colors duration-300 group-hover:text-primary">
                  {song.title} - {song.artist}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
