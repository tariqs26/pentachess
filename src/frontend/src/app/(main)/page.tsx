import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import pentachess from "/public/board/pentachess.png"

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="fixed inset-0 pointer-events-none">
        <Image 
          src={pentachess}
          alt="Pentachess board" 
          fill
          priority
          className="object-contain opacity-30"
        />
      </div>
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none opacity-30"></div>
      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
        <div className="mb-10 text-center opacity-0 animate-reveal-down">
          <h1 className="text-6xl font-bold text-primary mb-2 tracking-tight drop-shadow-glow">
            PentaChess
          </h1>
          <div className="h-1 w-40 bg-gradient-to-r from-primary/50 via-primary to-primary/50 mx-auto mb-6 rounded-full"></div>
        </div>
        <div className="max-w-2xl text-center mb-14 bg-card/70 p-8 rounded-xl backdrop-blur-md border border-primary/10 shadow-xl opacity-0 animate-reveal-up">
          <p className="text-xl text-card-foreground mb-6 leading-relaxed">
            Enter Pentachess—where chess transforms into a mesmerizing polygonal adventure.
          </p>
          <p className="text-xl text-card-foreground leading-relaxed">
            Challenge friends online, play against opponents, or enjoy a local game on the same device.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 mt-6 opacity-0 animate-reveal-scale">
          <Button asChild className="text-lg px-8 py-6 shadow-glow-primary transition-transform hover:scale-105">
            <Link href="/game">Create/Join Game</Link>
          </Button>
          <Button asChild variant="secondary" className="text-lg px-8 py-6 shadow-md transition-transform hover:scale-105">
            <Link href="/game/local">Local Game</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
