"use client"

import { useEffect } from "react"
import { useLocalGame } from "@/features/game/useLocalGame"
import { isGameOver } from "@/features/game/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { CapturedPieces } from "@/features/game/components/CapturedPieces"
import { CreateGameForm } from "@/features/game/components/CreateGameForm"
import { GameEndModal } from "@/features/game/components/GameEndModal"
import { PlayerCard } from "@/features/game/components/PlayerCard"
import { PreviousMoves } from "@/features/game/components/PreviousMoves"
import { RequestDrawModal } from "@/features/game/components/RequestDrawModal"
import { ResignModal } from "@/features/game/components/ResignModal"
import { Timer } from "@/features/game/components/Timer"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"

export default function LocalGamePage() {
  const { state, dispatch } = useLocalGame()

  useEffect(() => {
    if (state.status !== "playing") return
    const interval = setInterval(() => {
      dispatch({ type: "DECREMENT_TIMER", player: state.turn })

      if (
        state.status === "playing" &&
        (state.timer.w <= 0 || state.timer.b <= 0)
      ) {
        dispatch({ type: "SET_WINNER", player: state.timer.w <= 0 ? "b" : "w" })
        dispatch({ type: "SET_STATUS", status: "time-expired" })
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
                dispatch({ type: "START_GAME", duration })
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex w-full justify-center gap-x-2">
          <div className="relative w-full max-w-[600px]">
            {state.promotionCoordinates && (
              <PawnPromotionModal
                turn={state.turn}
                handlePromotion={(piece) =>
                  dispatch({ type: "PROMOTE_PAWN", piece })
                }
              />
            )}
            <CapturedPieces pieces={state.capturedPieces.w} />
            <div className="relative">
              <Timer duration={state.timer.b} disabled={state.turn === "w"} />
              <PlayerCard
                username="Opponent"
                isCheck={state.check === "b"}
                isCheckmate={state.status === "checkmate"}
                isDraw={state.status.startsWith("draw")}
              />
              <Board disabled={state.disabled} />
              <PlayerCard
                username="You"
                isCheck={state.check === "w"}
                isCheckmate={state.status === "checkmate"}
                isDraw={state.status.startsWith("draw")}
                className="bottom-0"
              />
              <Timer
                className="bottom-0"
                duration={state.timer.w}
                disabled={state.turn === "b"}
              />
            </div>
            <CapturedPieces pieces={state.capturedPieces.b} />
          </div>
          <div className="flex flex-col gap-2 [&>aside]:flex-1">
            <PreviousMoves startingPlayer="w" moves={state.previousMoves} />
            {isGameOver(state.status) ? (
              <GameEndModal
                winner={state.winner}
                status={state.status}
                onPlayAgain={() =>
                  dispatch({ type: "SET_STATUS", status: "waiting" })
                }
              />
            ) : (
              <div className="flex gap-2">
                <RequestDrawModal />
                <ResignModal
                  handleResign={() =>
                    dispatch({ type: "SET_STATUS", status: "resignation" })
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
