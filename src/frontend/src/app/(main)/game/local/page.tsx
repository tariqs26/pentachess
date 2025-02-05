"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { CreateGameForm } from "@/features/game/components/CreateGameForm"
import { useLocalGame } from "@/features/game/useLocalGame"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"
import type { Piece } from "@/features/piece/types"
import { useEffect, useState } from "react"

// Calculate the time remaining for the current move
const calculateTimeRemaining = (startTime: number) => {
  if (!startTime) {
    return "5:00"
  }

  const totalDuration = 5 * 60 * 1000 // 5 minutes in milliseconds
  const currentTime = Date.now()
  const elapsedTime = currentTime - startTime
  const timeRemaining = totalDuration - elapsedTime

  if (timeRemaining <= 0) {
    return "00:00"
  }

  const minutes = Math.floor(timeRemaining / (60 * 1000))
  const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000)

  const formattedMinutes = minutes.toString().padStart(2, "0")
  const formattedSeconds = seconds.toString().padStart(2, "0")

  // TODO: send a dispatch to change turns when time runs out

  return `${formattedMinutes}:${formattedSeconds}`
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
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(state.startTimeForMove))

  // Update the time remaining every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(state.startTimeForMove))
    }, 1000)

    return () => clearInterval(interval)
  }, [state.startTimeForMove])

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
                <span className="text-lg font-bold">{timeRemaining}</span>
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
          <Card className="flex-shrink-0 w-[230px] max-h-min">
            <CardHeader>
              <CardTitle className="text-xl">Previous Moves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-y-auto bg-white rounded-lg p-2 shadow-md shadow-white border border-black">
                <ul className="text-black text-xs">
                  {state.previousMoves.map((move, i) => (
                    <li key={i}>{move.notation}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
