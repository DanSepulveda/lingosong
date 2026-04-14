import Image from "next/image"
import Link from "next/link"

import { buttonVariants } from "../ui/button"

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="section flex h-full items-center justify-between">
        <Link prefetch={false} href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo LingoSong"
            className="aspect-square"
            width={25}
            height={25}
          />
          <span className="font-heading text-xl font-bold select-none">
            LingoSong
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            prefetch={false}
            href="/login"
            className={buttonVariants({ variant: "outline" })}
          >
            Ingresar
          </Link>
          <Link
            prefetch={false}
            href="/sign"
            className={buttonVariants({ variant: "default" })}
          >
            Unirse
          </Link>
        </div>
      </div>
    </header>
  )
}
