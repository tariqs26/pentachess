import { LocalGame } from "@/features/game/components/LocalGame"
import { GameProvider } from "@/features/game/components/GameProvider"

export default function LocalGamePage() {
  return (
    <GameProvider>
      <LocalGame />
    </GameProvider>
  )
}
