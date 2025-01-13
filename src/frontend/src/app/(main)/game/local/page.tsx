"use client"

import Image from "next/image"
import { Board } from "@/features/board/components/Board"
import { useLocalGame } from "@/features/game/useLocalGame"
import type { Piece } from "@/features/piece/types"

const CapturedPieces = ({ pieces }: { pieces: Piece[] }) => (
  <div className="flex h-[40px] bg-gray-700">
    {pieces.map((piece, i) => (
      <Image key={i} src={piece.image} alt={piece.type} className="size-10" />
    ))}
  </div>
)

export default function LocalGamePage() {
  const { state } = useLocalGame()

  return (
    <main className="grid min-h-screen place-items-center">
      <div className="w-full max-w-4xl bg-gray-800">
        <CapturedPieces pieces={state.capturedPieces.w} />
        <Board />
        <CapturedPieces pieces={state.capturedPieces.b} />
      </div>
    </main>
  )
}
