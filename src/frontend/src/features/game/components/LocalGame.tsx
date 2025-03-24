"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"
import { CapturedPieces } from "../components/CapturedPieces"
import { CreateGameForm } from "../components/CreateGameForm"
import { GameEndModal } from "../components/GameEndModal"
import { PlayerCard } from "../components/PlayerCard"
import { PreviousMoves } from "../components/PreviousMoves"
import { RequestDrawModal } from "../components/RequestDrawModal"
import { ResignModal } from "../components/ResignModal"
import { Timer } from "../components/Timer"
import { useGame } from "../hooks/useGame"
import { isGameOver } from "../utils"
import { MoveConfirmation } from "./MoveConfirmation"

export const LocalGame = () => {
  const { state, dispatch } = useGame()

  useEffect(() => {
    const timer = state.timer
    if (state.status !== "playing" || !timer) return
    const interval = setInterval(() => {
      dispatch({ type: "DECREMENT_TIMER", player: state.turn })
      if (timer.w <= 0 || timer.b <= 0) {
        dispatch({ type: "SET_WINNER", player: timer.w <= 0 ? "b" : "w" })
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
              <Timer duration={state.timer?.b} disabled={state.turn === "w"} />
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
              <MoveConfirmation
                className={
                  state.turn === "b"
                    ? state.timer
                      ? "top-12"
                      : "top-0"
                    : state.timer
                      ? "bottom-12"
                      : "bottom-0"
                }
                disabled={
                  !state.boardState.pendingMove || state.status !== "playing"
                }
              />
              <Timer
                className="bottom-0"
                duration={state.timer?.w}
                disabled={state.turn === "b"}
              />
            </div>
            <CapturedPieces pieces={state.capturedPieces.b} />
          </div>
          <div className="flex flex-col gap-2 [&>aside]:flex-1">
            <PreviousMoves player="w" moves={state.previousMoves} />
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
