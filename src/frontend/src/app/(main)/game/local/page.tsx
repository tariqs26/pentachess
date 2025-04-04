import type { Metadata } from "next"
import { LocalGame } from "@/features/game/components/LocalGame"
import { GameProvider } from "@/features/game/components/GameProvider"

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
