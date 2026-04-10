import { Footer } from "@/components/sections/footer"
import { Header } from "@/components/sections/header"
import { HeroSection } from "@/components/sections/hero"
import { RecentSongs } from "@/components/sections/recent-songs"

export const dynamic = "force-dynamic"

export default async function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <HeroSection />
        <RecentSongs />
      </main>
      <Footer />
    </>
  )
}
