"use client"

import Image from "next/image"
import { Board } from "@/features/board/components/Board"
import { useLocalGame } from "@/features/game/useLocalGame"
import { Piece } from "@/features/piece/types"

const CapturedPieces = ({ pieces }: { pieces: Piece[] }) => (
  <div className="flex h-[60px] bg-gray-700">
    {pieces.map((piece, i) => (
      <Image
        key={i}
        src={piece.image}
        width={50}
        height={50}
        alt={piece.type}
      />
    ))}
  </div>
)

export default function LocalGamePage() {
  const { state } = useLocalGame()

  return (
    <main className="grid min-h-screen place-items-center">
      <div className="container bg-gray-800">
        <CapturedPieces pieces={state.capturedPieces["w"]} />
        <Board />
        <CapturedPieces pieces={state.capturedPieces["b"]} />
      </div>
    </main>
  )
}
