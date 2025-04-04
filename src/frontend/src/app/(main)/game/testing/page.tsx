import { GameProvider } from "@/features/game/components/GameProvider"
import { TestGame } from "@/features/game/components/TestGame"

export default function LocalGamePage() {
  return (
    <GameProvider>
      <TestGame />
    </GameProvider>
  )
}
