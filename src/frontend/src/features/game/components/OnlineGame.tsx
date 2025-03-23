"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"
import { useOnlineGame } from "../hooks/useOnlineGame"
import { isGameOver } from "../utils"
import { CapturedPieces } from "./CapturedPieces"
import { GameEndModal } from "./GameEndModal"
import { PlayerCard } from "./PlayerCard"
import { PreviousMoves } from "./PreviousMoves"
import { RequestDrawModal } from "./RequestDrawModal"
import { ResignModal } from "./ResignModal"
import { Timer } from "./Timer"
import { MoveConfirmation } from "./MoveConfirmation"

type GameProps = Readonly<{ id: string; username: string }>

export const OnlineGame = ({ id: userId, username }: GameProps) => {
  const { state, connected, handlePlayAgain, handleResign, handlePromotion } =
    useOnlineGame(userId, username)

  return (
    <div className="mx-auto grid min-h-screen place-items-center p-6">
      {state.status === "waiting" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Online Game</CardTitle>
          </CardHeader>
          <CardContent>
            {connected ? "Waiting for opponent..." : "Connecting..."}
          </CardContent>
        </Card>
      ) : (
        <div className="flex w-full justify-center gap-x-2">
          <div className="relative w-full max-w-[600px]">
            {state.promotionCoordinates && (
              <PawnPromotionModal
                turn={state.turn}
                handlePromotion={handlePromotion}
              />
            )}
            <CapturedPieces pieces={state.capturedPieces[state.player.color]} />
            <div className="relative">
              <Timer
                duration={state.timer?.[state.opponent.color]}
                disabled={state.turn !== state.opponent.color}
              />
              <PlayerCard
                username={state.opponent.username}
                isCheck={state.check === state.opponent.color}
                isCheckmate={state.status === "checkmate"}
                isDraw={state.status.startsWith("draw")}
              />
              <Board
                flipped={state.player.color === "b"}
                disabled={state.disabled || state.turn !== state.player.color}
              />
              <PlayerCard
                username={username}
                isCheck={state.check === state.player.color}
                isCheckmate={state.status === "checkmate"}
                isDraw={state.status.startsWith("draw")}
                className="bottom-0"
              />
              <MoveConfirmation
                className="bottom-12"
                disabled={
                  !state.boardState.pendingMove ||
                  state.turn !== state.player.color ||
                  state.status !== "playing"
                }
              />
              <Timer
                duration={state.timer?.[state.player.color]}
                disabled={state.turn !== state.player.color}
                className="bottom-0"
              />
            </div>
            <CapturedPieces
              pieces={state.capturedPieces[state.opponent.color]}
            />
          </div>
          <div className="flex flex-col gap-2 [&>aside]:flex-1">
            <PreviousMoves
              startingPlayer={state.player.color}
              moves={state.previousMoves}
            />
            {isGameOver(state.status) ? (
              <GameEndModal
                winner={state.winner}
                status={state.status}
                onPlayAgain={handlePlayAgain}
              />
            ) : (
              <div className="flex gap-2">
                <RequestDrawModal />
                <ResignModal handleResign={handleResign} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
