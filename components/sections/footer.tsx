import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 font-heading text-sm text-muted-foreground">
      <div className="section flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo LingoSong"
            className="aspect-square"
            width={25}
            height={25}
          />
          <span className="font-semibold">LingoSong - 2026</span>
        </div>
        <span>
          Desarrollado por{" "}
          <Link
            href="https://dansepulveda.dev"
            target="_blank"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Daniel Sepúlveda
          </Link>
        </span>
      </div>
    </footer>
  )
}
