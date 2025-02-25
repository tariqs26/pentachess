"use client"

import { useEffect } from "react"
import { useLocalGame } from "@/features/game/useLocalGame"
import { isGameOver } from "@/features/game/utils"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { CapturedPieces } from "@/features/game/components/CapturedPieces"
import { CreateGameForm } from "@/features/game/components/CreateGameForm"
import { GameEndModal } from "@/features/game/components/GameEndModal"
import { PreviousMoves } from "@/features/game/components/PreviousMoves"
import { Timer } from "@/features/game/components/Timer"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"

export default function LocalGamePage() {
  const { state, dispatch } = useLocalGame()

  useEffect(() => {
    if (state.status !== "playing" && state.status !== "promoting") return
    const interval = setInterval(() => {
      dispatch({ type: "DECREMENT_TIMER", payload: state.turn })

      if (
        (state.status === "playing" || state.status === "promoting") &&
        (state.timer.w <= 0 || state.timer.b <= 0)
      ) {
        dispatch({
          type: "SET_WINNER",
          payload: state.timer.w <= 0 ? "b" : "w",
        })
        dispatch({ type: "UPDATE_STATUS", payload: "time-expired" })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [state, dispatch])

  useEffect(() => {
    if (isGameOver(state.status)) {
      dispatch({ type: "END_GAME" })
    }
  }, [state.status, dispatch])

  return (
    <div className="mx-auto grid min-h-screen place-items-center p-6">
      {state.status === "waiting" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create Local Game</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateGameForm
              isOnline={false}
              startHandler={(duration) => {
                dispatch({ type: "RESET_GAME" })
                dispatch({ type: "START_GAME", payload: duration })
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex w-full justify-center gap-x-2">
          <div className="relative w-full max-w-[600px]">
            {state.status === "promoting" && (
              <PawnPromotionModal
                turn={state.turn}
                handlePromotion={(piece) =>
                  dispatch({ type: "PROMOTE_PAWN", payload: piece })
                }
              />
            )}
            <CapturedPieces pieces={state.capturedPieces.w} />
            <div className="relative">
              <Timer duration={state.timer.b} />
              <p
                className={cn(
                  "absolute left-0 -mt-1 font-bold",
                  state.check === "b" && "text-red-500",
                  state.status.startsWith("draw") && "text-gray-500"
                )}
              >
                Opponent{" "}
                {(state.check === "b" &&
                  `(${state.status === "checkmate" ? "checkmate" : "check"})`) ||
                  (state.status.startsWith("draw") && `(draw)`)}
              </p>
              <Board />
              <p
                className={cn(
                  "absolute bottom-0 left-0 -mb-1 font-bold",
                  state.check === "w" && "text-red-500",
                  state.status.startsWith("draw") && "text-gray-500"
                )}
              >
                You{" "}
                {(state.check === "w" &&
                  `(${state.status === "checkmate" ? "checkmate" : "check"})`) ||
                  (state.status.startsWith("draw") && `(draw)`)}
              </p>
              <Timer duration={state.timer.w} className="bottom-0" />
            </div>
            <CapturedPieces pieces={state.capturedPieces.b} />
          </div>
          <div className="flex flex-col gap-2 [&>aside]:flex-1">
            <PreviousMoves startingPlayer="w" moves={state.previousMoves} />
            {isGameOver(state.status) && (
              <GameEndModal
                winner={state.winner}
                status={state.status}
                onPlayAgain={() =>
                  dispatch({ type: "UPDATE_STATUS", payload: "waiting" })
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
