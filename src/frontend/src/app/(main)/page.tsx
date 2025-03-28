import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import pentachess from "/public/board/pentachess.png"

export default function HomePage() {
  return (
    <div className="relative grid min-h-screen place-items-center">
      <Image
        src={pentachess}
        alt="Pentachess board"
        className="pointer-events-none fixed scale-90 object-contain brightness-90"
        fill
        priority
      />
      <div className="pointer-events-none fixed bg-radial-gradient opacity-30" />
      <div className="mt-12 flex flex-col items-center justify-center px-4 py-16">
        <div className="mb-6 max-w-lg animate-reveal-up rounded-xl border bg-card/95 p-8 text-center opacity-0 shadow-xl backdrop-blur-sm md:max-w-xl">
          <div className="mb-10 animate-reveal-down text-center opacity-0">
            <h1 className="mb-2 text-5xl font-bold tracking-tight text-primary drop-shadow-glow md:text-6xl">
              PentaChess
            </h1>
            <div className="mx-auto mb-6 h-1 w-40 rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
          </div>
          <p className="mb-6 animate-reveal-down text-lg leading-relaxed text-card-foreground opacity-0 md:text-xl">
            Enter Pentachess—where chess transforms into a mesmerizing polygonal
            adventure.
          </p>
          <p className="animate-reveal-down text-lg leading-relaxed text-card-foreground opacity-0 md:text-xl">
            Challenge friends online, play against opponents, or enjoy a local
            game on the same device.
          </p>
        </div>
        <div className="flex animate-reveal-scale flex-wrap gap-6 opacity-0">
          <Button
            asChild
            className="px-6 py-5 text-lg shadow-glow-primary transition-transform hover:scale-105 md:px-8 md:py-6"
          >
            <Link href="/game">Play Online</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="px-6 py-5 text-lg shadow-md transition-transform hover:scale-105 md:px-8 md:py-6"
          >
            <Link href="/game/local">Play Local</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
