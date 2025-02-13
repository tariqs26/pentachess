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
      <Image key={i} src={piece.image} alt={piece.type} className="size-8 mr-[-1.2px]" />
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

        if (state.status == "playing" && (state.timer.w <= 0 || state.timer.b <= 0)) {
          dispatch({ type: "UPDATE_STATUS", payload: "time-expired" })
        }
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
        <div className="relative flex w-full space-x-4 ml-[-500px]">
          <Card className="flex-shrink-0 w-[260px] max-h-min ml-[-50px]">
            <CardHeader>
                <CardTitle className="text-xl text-center">Previous Moves</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center mt-[-20px]">
                <div className="flex justify-between w-full mb-2">
                    <div className="text-sm font-bold text-center w-1/2 ml-[-15px]">You</div>
                    <div className="text-sm font-bold text-center w-1/2 mr-[-5px]">Opponent</div>
                </div>
                <div className="flex space-x-1">
                    <div className="max-h-[610px] overflow-y-auto bg-white rounded-lg p-2 shadow-md shadow-white border border-black w-[120px]">
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
                    <div className="max-h-[610px] overflow-y-auto bg-white rounded-lg p-2 shadow-md shadow-white border border-black w-[120px]">
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
            <div className={`flex-1 ${state.status === "promoting" ? "relative" : ""}`}>
            {state.status === "promoting" && (
              <div className="absolute inset-0 bg-black/50 z-10"></div>
            )}
            <CapturedPieces pieces={state.capturedPieces.w} />
            <div className="relative">
              <div className="absolute items-center justify-center bg-secondary rounded-lg p-2 shadow-md shadow-white border border-black w-[80px] right-0">
                <div className="flex items-center justify-center">
                  <span className="text-lg font-bold">{ timeRemaining["b"] }</span>
                </div>
              </div>
              <div className="absolute top-7 left-0 transform -translate-y-full mb-2 text-lg font-bold">Opponent</div>
              <Board />
              <div className="absolute left-0 transform -translate-y-full mb-2 text-lg font-bold">You</div>
              <div className="absolute items-center justify-center bg-secondary rounded-lg p-2 shadow-md shadow-white border border-black w-[80px] right-0 bottom-0">
                <div className="flex items-center justify-center">
                  <span className="text-lg font-bold">{ timeRemaining["w"] }</span>
                </div>
              </div>
            </div>
            <CapturedPieces pieces={state.capturedPieces.b} />
            {state.status === "promoting" && <PawnPromotionModal />}
          </div>
          {state.status === "time-expired" && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
            <div className="p-6 rounded-lg shadow-lg text-center bg-[#27B559]">
              <h2 className="text-2xl font-bold mb-4">Game Over</h2>
              <p className="mb-4">Time has expired!</p>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => dispatch({ type: "UPDATE_STATUS", payload: "waiting" })}>
                Finish Game
              </button>
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  )
}
