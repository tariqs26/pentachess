"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import pentachess from "/public/board/pentachess.png"
import { useSidebar } from "@/components/ui/sidebar"

export default function HomePage() {
  // Use the shared sidebar state from context
  const { expanded } = useSidebar()

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div
        className={`pointer-events-none fixed inset-0 transition-all duration-300 ${expanded ? "ml-[180px]" : ""}`}
      >
        <Image
          src={pentachess}
          alt="Pentachess board"
          fill
          priority
          className="object-contain opacity-50"
        />
      </div>
      <div className="pointer-events-none fixed inset-0 bg-radial-gradient opacity-30"></div>
      <div className="container relative z-10 mx-auto mt-[40px] flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="mb-15 max-w-2xl animate-reveal-up rounded-xl border border-primary/10 bg-card/70 p-8 text-center opacity-0 shadow-xl backdrop-blur-md">
          <div className="mb-10 animate-reveal-down text-center opacity-0">
            <h1 className="mb-2 text-6xl font-bold tracking-tight text-primary drop-shadow-glow">
              PentaChess
            </h1>
            <div className="mx-auto mb-6 h-1 w-40 rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
          </div>
          <p className="mb-6 text-xl leading-relaxed text-card-foreground">
            Enter Pentachess—where chess transforms into a mesmerizing polygonal
            adventure.
          </p>
          <p className="text-xl leading-relaxed text-card-foreground">
            Challenge friends online, play against opponents, or enjoy a local
            game on the same device.
          </p>
        </div>
        <div className="mt-6 flex animate-reveal-scale flex-col gap-6 opacity-0 sm:flex-row">
          <Button
            asChild
            className="px-8 py-6 text-lg shadow-glow-primary transition-transform hover:scale-105"
          >
            <Link href="/game">Create/Join Game</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="px-8 py-6 text-lg shadow-md transition-transform hover:scale-105"
          >
            <Link href="/game/local">Local Game</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
