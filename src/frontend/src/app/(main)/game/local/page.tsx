import type { Metadata } from "next"
import { GameProvider } from "@/features/game/components/GameProvider"
import { LocalGame } from "@/features/game/components/LocalGame"

export const metadata: Metadata = {
  title: "Local Game",
}

export default function LocalGamePage() {
  return (
    <GameProvider>
      <LocalGame />
    </GameProvider>
  )
}
