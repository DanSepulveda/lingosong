import { Metadata } from "next"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { Inter, Oxanium } from "next/font/google"
import { notFound } from "next/navigation"

import { routing } from "@/i18n/routing"

import { cn } from "@/lib/utils"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "../globals.css"

const oxaniumHeading = Oxanium({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "LingoSong",
  description:
    "Aprende idiomas de manera divertida con LingoSong. Transforma tus canciones favoritas en lecciones para aprender vocabulario, gramática y más.",
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        oxaniumHeading.variable,
        inter.variable
      )}
    >
      <body className="flex min-h-screen flex-col bg-background">
        <ThemeProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
