"use client"

import { useState } from "react"
import { useLocalGame } from "@/features/game/useLocalGame"
import { isGameOver } from "@/features/game/utils"
import { cn } from "@/lib/utils"
import { Board } from "@/features/board/components/Board"
import { CapturedPieces } from "@/features/game/components/CapturedPieces"
import { GameEndModal } from "@/features/game/components/GameEndModal"
import { PreviousMoves } from "@/features/game/components/PreviousMoves"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"
import { ResetBoardModal } from "@/features/game/components/ResetBoardModal"
import { PIECE_DATA } from "@/features/piece/constants"
import type { PieceType, PieceColor } from "@/features/piece/types"
import Image from "next/image"
import { makePiece } from "@/features/piece/utils"

export default function TestingPage() {
  const { state, dispatch } = useLocalGame()
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
  const [selectPiece, setSelectPiece] = useState<{
    type: PieceType
    color: PieceColor
  } | null>(null)

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center gap-x-2 p-6">
      <div className="flex rounded-md border bg-accent p-2 shadow">
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
                  selectPiece.type === piece &&
                  selectPiece.color === color
                    ? "h-14 w-14 rounded-md border-4 border-green-500"
                    : "h-14 w-14"
                }
                onClick={() => {
                  if (
                    selectPiece !== null &&
                    selectPiece.type === piece &&
                    selectPiece.color === color
                  ) {
                    setSelectPiece(null)
                    dispatch({
                      type: "SET_STATUS",
                      status: "playing",
                    })
                  } else if (state.boardState.overCell === null) {
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
      <div className="flex gap-x-2">
        <div className="relative w-full max-w-[600px]">
          {state.status === "promoting" && (
            <PawnPromotionModal
              turn={state.turn}
              handlePromotion={(piece) =>
                dispatch({ type: "PROMOTE_PAWN", piece })
              }
            />
          )}
          <CapturedPieces pieces={state.capturedPieces.w} />
          <div className="relative">
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
                (state.status.startsWith("draw") && "(draw)")}
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
                (state.status.startsWith("draw") && "(draw)")}
            </p>
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
              <ResetBoardModal
                action="Clear"
                handleReset={() => {
                  dispatch({ type: "RESET_BOARD", entire: true })
                }}
              />
              <ResetBoardModal
                action="Reset"
                handleReset={() => {
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
