"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Eraser } from "lucide-react"
import { PIECE_DATA } from "@/features/piece/constants"
import type { PieceColor, PieceType } from "@/features/piece/types"
import { makePiece } from "@/features/piece/utils"
import { useGame } from "../hooks/useGame"
import { isGameOver } from "../utils"
import { Board } from "@/features/board/components/Board"
import { ResetBoardButton } from "@/features/game/components/ResetBoardButton"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"
import { CapturedPieces } from "./CapturedPieces"
import { GameEndModal } from "./GameEndModal"
import { MoveConfirmation } from "./MoveConfirmation"
import { PlayerCard } from "./PlayerCard"
import { PreviousMoves } from "./PreviousMoves"
import { Timer } from "./Timer"

export const TestGame = () => {
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

  const pieces: PieceType[] = [
    "pawn-cw",
    "pawn-ccw",
    "berolina-pawn-cw",
    "berolina-pawn-ccw",
    "bishop",
    "knight",
    "rook",
    "queen",
    "king",
  ]
  const colors: PieceColor[] = ["w", "b"]
  const [selectPiece, setSelectPiece] = useState<
    | {
        type: PieceType
        color: PieceColor
      }
    | "eraser"
    | null
  >(null)

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center gap-x-2 p-6">
      <div className="flex rounded-md border bg-accent p-2 shadow">
        <div className="v-full flex min-w-max items-center justify-center">
          {colors.map((color) => (
            <div key={color}>
              {pieces.map((piece) => (
                <Image
                  key={piece + color}
                  alt={piece + color}
                  src={PIECE_DATA[piece].image[color]}
                  className={
                    state.status === "testing" &&
                    selectPiece !== null &&
                    selectPiece !== "eraser" &&
                    selectPiece.type === piece &&
                    selectPiece.color === color
                      ? "h-14 w-14 rounded-md border-4 border-green-500"
                      : "h-14 w-14"
                  }
                  onClick={() => {
                    if (
                      selectPiece !== null &&
                      selectPiece !== "eraser" &&
                      selectPiece.type === piece &&
                      selectPiece.color === color
                    ) {
                      setSelectPiece(null)
                      dispatch({
                        type: "SET_STATUS",
                        status: "playing",
                      })
                    } else if (state.boardState.selectedCell === undefined) {
                      setSelectPiece({ type: piece, color })
                      state.testPiece = makePiece(piece, color)
                      dispatch({
                        type: "SET_STATUS",
                        status: "testing",
                      })
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="v-full flex min-w-max items-center justify-center">
          <Eraser
            className={
              state.status === "testing" && selectPiece === "eraser"
                ? "h-10 w-10 rounded-md border-4 border-green-500"
                : "h-10 w-10"
            }
            onClick={() => {
              if (selectPiece === "eraser") {
                setSelectPiece(null)
                dispatch({
                  type: "SET_STATUS",
                  status: "playing",
                })
              } else if (state.boardState.selectedCell === undefined) {
                setSelectPiece("eraser")
                state.testPiece = undefined
                dispatch({
                  type: "SET_STATUS",
                  status: "testing",
                })
              }
            }}
          ></Eraser>
        </div>
      </div>{" "}
      <div className="flex gap-x-2">
        <div className="relative w-full max-w-[600px]">
          {state.promotionCoordinates?.piece.canPromote && (
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
              hidden={!state.boardState.pendingMove}
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
              <ResetBoardButton
                action="Clear"
                handleReset={() => {
                  if (state.boardState.selectedCell === undefined)
                    dispatch({ type: "RESET_BOARD", entire: true })
                }}
              />
              <ResetBoardButton
                action="Reset"
                handleReset={() => {
                  if (state.boardState.selectedCell === undefined)
                    dispatch({ type: "RESET_BOARD", entire: false })
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
