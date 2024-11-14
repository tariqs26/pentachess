"use client"

import { useLocalGame } from "@/features/game/useLocalGame"
import { Board } from "@/features/board/components/Board"

export default function LocalGamePage() {
  const { state } = useLocalGame()

  return (
    <main>
      <Board />
      <aside>
        {state.previousMoves.map((move, i) => (
          <div key={i}>{JSON.stringify(move)}</div>
        ))}
      </aside>
    </main>
  )
}
