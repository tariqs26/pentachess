import { TestGame } from "@/features/game/components/TestGame"
import { GameProvider } from "@/features/game/components/GameProvider"

export default function LocalGamePage() {
  return (
    <GameProvider>
      <TestGame />
    </GameProvider>
  )
}
