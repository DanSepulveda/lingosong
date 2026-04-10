import { Metadata } from "next"
import { Inter, Oxanium } from "next/font/google"

import { cn } from "@/lib/utils"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
