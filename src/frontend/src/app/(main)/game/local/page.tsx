"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { CreateGameForm } from "@/features/game/components/CreateGameForm"
import { useLocalGame } from "@/features/game/useLocalGame"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"
import { useEffect, useState } from "react"
import { displayTimeRemaining } from "@/features/game/utils"
import { CapturedPieces } from "@/features/game/components/LocalGameProvider"

export default function LocalGamePage() {
  const { state, dispatch } = useLocalGame()
  const [timeRemaining, setTimeRemaining] = useState(() => ({
    w: displayTimeRemaining(state.timer?.w || 0),
    b: displayTimeRemaining(state.timer?.b || 0),
  }))

  useEffect(() => {
    const interval = setInterval(() => {
      if (state && state.timer) {
        dispatch({ type: "DECREMENT_TIMER", payload: state.turn })

        if (
          state.status == "playing" &&
          (state.timer.w <= 0 || state.timer.b <= 0)
        ) {
          dispatch({ type: "UPDATE_STATUS", payload: "time-expired" })
        }
      }
    }, 1000)

    setTimeRemaining({
      w: displayTimeRemaining(state.timer?.w || 0),
      b: displayTimeRemaining(state.timer?.b || 0),
    })

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
        <div className="relative ml-[-500px] flex w-full space-x-4">
          <Card className="ml-[-50px] max-h-min w-[230px] flex-shrink-0">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Previous Moves
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-[-20px] flex flex-col items-center">
              <div className="mb-2 flex w-full justify-between">
                <div className="ml-[-15px] w-1/2 text-center text-sm font-bold">
                  You
                </div>
                <div className="mr-[-5px] w-1/2 text-center text-sm font-bold">
                  Opponent
                </div>
              </div>
              <div className="flex space-x-1">
                <div className="max-h-[610px] w-[100px] overflow-y-auto rounded-lg border border-black bg-white p-2 shadow-md shadow-white">
                  <ul className="text-xs text-black">
                    {state.previousMoves
                      .filter((move) => move.player === "w")
                      .map((move, i) => (
                        <li
                          key={i}
                          className={
                            move.pieceCaptured
                              ? "text-red-500"
                              : "text-green-500"
                          }
                        >
                          {move.notation}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="max-h-[610px] w-[100px] overflow-y-auto rounded-lg border border-black bg-white p-2 shadow-md shadow-white">
                  <ul className="text-xs text-black">
                    {state.previousMoves
                      .filter((move) => move.player === "b")
                      .map((move, i) => (
                        <li
                          key={i}
                          className={
                            move.pieceCaptured
                              ? "text-red-500"
                              : "text-green-500"
                          }
                        >
                          {move.notation}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          <div
            className={`flex-1 ${state.status === "promoting" ? "relative" : ""}`}
          >
            {state.status === "promoting" && (
              <div className="absolute inset-0 z-10 bg-black/50"></div>
            )}
            <CapturedPieces pieces={state.capturedPieces.w} />
            <div className="relative">
              <div className="absolute right-0 w-[80px] items-center justify-center rounded-lg border border-black bg-secondary p-2 shadow-md shadow-white">
                <div className="flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {timeRemaining["b"]}
                  </span>
                </div>
              </div>
              <div className="absolute left-0 top-7 mb-2 -translate-y-full transform text-lg font-bold">
                Opponent
              </div>
              <Board />
              <div className="absolute left-0 mb-2 -translate-y-full transform text-lg font-bold">
                You
              </div>
              <div className="absolute bottom-0 right-0 w-[80px] items-center justify-center rounded-lg border border-black bg-secondary p-2 shadow-md shadow-white">
                <div className="flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {timeRemaining["w"]}
                  </span>
                </div>
              </div>
            </div>
            <CapturedPieces pieces={state.capturedPieces.b} />
            {state.status === "promoting" && <PawnPromotionModal />}
          </div>
          {state.status === "time-expired" && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
              <div className="rounded-lg bg-[#27B559] p-6 text-center shadow-lg">
                <h2 className="mb-4 text-2xl font-bold">Game Over</h2>
                <p className="mb-4">Time has expired!</p>
                <button
                  className="rounded bg-red-500 px-4 py-2 text-white"
                  onClick={() =>
                    dispatch({ type: "UPDATE_STATUS", payload: "waiting" })
                  }
                >
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
