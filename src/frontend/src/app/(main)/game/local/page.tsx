"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { CreateGameForm } from "@/features/game/components/CreateGameForm"
import { useLocalGame } from "@/features/game/useLocalGame"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"
import type { Piece } from "@/features/piece/types"
import { useEffect, useState } from "react"

const calcTimeRemaing = (timeInSeconds: number) => {
  if (timeInSeconds <= 0) {
    return "00:00"
  }

  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

const CapturedPieces = ({ pieces }: { pieces: Piece[] }) => (
  <div className="flex h-[48px] items-center bg-[#27B559] rounded-lg p-2 shadow-md shadow-white border border-black">
    {pieces.map((piece, i) => (
      <Image key={i} src={piece.image} alt={piece.type} className="size-10" />
    ))}
  </div>
)

export default function LocalGamePage() {
  const { state, dispatch } = useLocalGame()
  const [timeRemaining, setTimeRemaining] = useState(() => (
    { w: calcTimeRemaing(state.timer?.w || 0), b: calcTimeRemaing(state.timer?.b || 0)}
  ))

  useEffect(() => {
    const interval = setInterval(() => {
      if (state && state.timer) {
        dispatch({ type: "DECREMENT_TIMER", payload: state.turn })
      }
    }, 1000)

    setTimeRemaining(
      { w: calcTimeRemaing(state.timer?.w || 0), b: calcTimeRemaing(state.timer?.b || 0) }
    )

    return () => clearInterval(interval)
  }, [dispatch, state])

  return (
    <div className="mx-auto grid min-h-screen max-w-2xl place-items-center p-6">
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
        <div className="relative flex w-full space-x-4" style={{ marginLeft: "-500px" }}>
          <Card className="flex-shrink-0 w-[230px] max-h-min">
            <CardHeader>
              <CardTitle className="text-xl">Game Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div>Current Turn: {state.turn == "w" ? "You" : "Opponent"}</div>
              <div className="mb-2 text-lg">Timer:</div>
              <div className="flex items-center justify-center bg-secondary rounded-lg p-2 shadow-md shadow-white border border-black">
                <span className="text-lg font-bold">{ timeRemaining[state.turn] }</span>
              </div>
            </CardContent>
          </Card>
          <div className="flex-1">
            <CapturedPieces pieces={state.capturedPieces.w} />
            <div className="relative">
              <div className="absolute top-7 left-0 transform -translate-y-full mb-2 text-lg font-bold">Opponent</div>
              <Board />
              <div className="absolute left-0 transform -translate-y-full mb-2 text-lg font-bold">You</div>
            </div>
            <CapturedPieces pieces={state.capturedPieces.b} />
            {state.status === "promoting" && <PawnPromotionModal />}
          </div>
          <Card className="flex-shrink-0 w-[300px] max-h-min">
            <CardHeader>
                <CardTitle className="text-xl text-center">Previous Moves</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center mt-[-20px]">
                <div className="flex justify-between w-full mb-2">
                    <div className="text-sm font-bold text-center w-1/2 ml-[-15px]">You</div>
                    <div className="text-sm font-bold text-center w-1/2 mr-[-5px]">Opponent</div>
                </div>
                <div className="flex space-x-1">
                    <div className="max-h-[610px] overflow-y-auto bg-white rounded-lg p-2 shadow-md shadow-white border border-black w-[140px]">
                      <ul className="text-black text-xs">
                        {state.previousMoves
                          .filter((move) => move.player === "w")
                          .map((move, i) => (
                            <li key={i} className={move.pieceCaptured ? "text-red-500" : "text-green-500"}>
                              {move.notation}
                            </li>
                          ))}
                      </ul>
                  </div>
                    <div className="max-h-[610px] overflow-y-auto bg-white rounded-lg p-2 shadow-md shadow-white border border-black w-[140px]">
                    <ul className="text-black text-xs">
                      {state.previousMoves
                        .filter((move) => move.player === "b")
                        .map((move, i) => (
                          <li key={i} className={move.pieceCaptured ? "text-red-500" : "text-green-500"}>
                            {move.notation}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
