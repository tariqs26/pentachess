"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { CreateGameForm } from "@/features/game/components/CreateGameForm"
import { useLocalGame } from "@/features/game/useLocalGame"
import type { Piece } from "@/features/piece/types"

const CapturedPieces = ({ pieces }: { pieces: Piece[] }) => (
  <div className="flex h-[48px] items-center bg-secondary">
    {pieces.map((piece, i) => (
      <Image key={i} src={piece.image} alt={piece.type} className="size-10" />
    ))}
  </div>
)

export default function LocalGamePage() {
  const { state, dispatch } = useLocalGame()

  return (
    <div className="mx-auto grid min-h-screen max-w-5xl place-items-center p-6">
      {state.status === "waiting" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create Local Game</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateGameForm
              isOnline={false}
              startHandler={(duration) =>
                dispatch({ type: "START_GAME", payload: duration })
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="w-full bg-secondary/50">
          <CapturedPieces pieces={state.capturedPieces.w} />
          <Board />
          <CapturedPieces pieces={state.capturedPieces.b} />
        </div>
      )}
    </div>
  )
}
