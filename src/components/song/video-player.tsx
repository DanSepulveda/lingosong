/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState } from "react"
import Youtube, { YouTubeEvent } from "react-youtube"

import Image from "next/image"

import { Prisma } from "@generated/prisma/client"

import { cn } from "@/lib/utils"

import { LyricLine } from "@/types"

type Lyrics = Prisma.LyricGetPayload<{}>

export function Player({
  alt,
  lyrics: songLyrics,
  thumbnailUrl,
  youtubeId,
}: {
  alt: string
  lyrics: Lyrics | null
  thumbnailUrl: string
  youtubeId: string
}) {
  const lyrics = songLyrics!.content as unknown as LyricLine[]
  const [active, setActive] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const playerRef = useRef<any>(null)
  const [activeLine, setActiveLine] = useState(0)
  const activeLineRef = useRef<HTMLDivElement>(null)
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true)

  const handleUserScroll = () => {
    if (isAutoScrollEnabled) {
      setIsAutoScrollEnabled(false)
      setTimeout(() => setIsAutoScrollEnabled(true), 3000)
    }
  }

  const handleLyricClick = (time: number | null) => {
    if (!playerRef.current) return
    playerRef.current.seekTo(time)
  }

  const stopSync = () => {
    if (!songLyrics?.isSynced) return
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const startSync = () => {
    if (!songLyrics?.isSynced) return

    stopSync()
    intervalRef.current = setInterval(() => {
      const time = playerRef.current?.getCurrentTime() ?? 0
      let active = 0
      for (let i = 0; i < lyrics.length; i++) {
        if (time >= lyrics[i].time!) active = i
      }
      setActiveLine(active)
    }, 200)
  }

  const onPlay = (e: YouTubeEvent) => {
    if (!songLyrics?.isSynced) return
    playerRef.current = e.target
    startSync()
  }

  useEffect(() => {
    if (isAutoScrollEnabled && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [activeLine, isAutoScrollEnabled])

  return (
    <section className="">
      <div className="mx-auto mb-6 h-54 w-96">
        {active ? (
          <Youtube
            videoId={youtubeId}
            opts={{
              width: "384",
              height: "216",
              playerVars: {
                autoplay: 1,
                fs: 0,
                hl: "es",
                iv_load_policy: 3,
                rel: 0,
              },
            }}
            onPlay={onPlay}
            onPause={stopSync}
            onEnd={stopSync}
          />
        ) : (
          <button
            onClick={() => setActive(true)}
            aria-label="Reproducir video"
            className="relative flex h-54 w-96 cursor-pointer items-center overflow-hidden"
          >
            <Image
              src={thumbnailUrl}
              alt={alt}
              width={480}
              height={360}
              className="border border-border object-cover"
            />
            <div className="absolute inset-0 flex size-full items-center justify-center">
              <svg
                preserveAspectRatio="xMidYMid"
                viewBox="0 0 256 180"
                className="w-16"
              >
                <path
                  fill="red"
                  d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
                />
                <path
                  fill="#FFF"
                  d="m102.421 128.06 66.328-38.418-66.328-38.418z"
                />
              </svg>
            </div>
          </button>
        )}
      </div>
      <div className="flex h-90 w-full flex-col overflow-y-scroll px-4 text-sm lg:h-[55vh]">
        {lyrics.map((l, index) => (
          <div
            key={l.time}
            className={cn(
              "flex cursor-pointer flex-col rounded-md border border-transparent px-4 py-2 transition-colors select-none hover:bg-foreground/10",
              {
                "border border-primary/50 bg-primary/10": activeLine === index,
              }
            )}
            ref={index === activeLine ? activeLineRef : null}
            onClick={() => handleLyricClick(l.time)}
            onWheel={handleUserScroll}
            onTouchMove={handleUserScroll}
          >
            <span className="font-semibold">{l.text}</span>
            <span className="text-muted-foreground">{l.translation}</span>
            <span>{l.romanization}</span>
          </div>
        ))}
      </div>
    </section>
  )

  // return (
  //   <button
  //     onClick={() => setActive(true)}
  //     aria-label="Reproducir video"
  //     className="relative flex h-66 w-120 cursor-pointer items-center overflow-hidden"
  //   >
  //     <Image
  //       src={thumbnailUrl}
  //       alt={alt}
  //       width={480}
  //       height={360}
  //       className="border border-border object-cover"
  //     />
  //     <div className="absolute inset-0 flex size-full items-center justify-center">
  //       <svg
  //         preserveAspectRatio="xMidYMid"
  //         viewBox="0 0 256 180"
  //         className="w-16"
  //       >
  //         <path
  //           fill="red"
  //           d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
  //         />
  //         <path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
  //       </svg>
  //     </div>
  //   </button>
  // )
}
