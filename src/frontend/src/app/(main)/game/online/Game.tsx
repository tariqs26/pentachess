"use client"

import { isGameOver } from "@/features/game/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { CapturedPieces } from "@/features/game/components/CapturedPieces"
import { GameEndModal } from "@/features/game/components/GameEndModal"
import { PlayerCard } from "@/features/game/components/PlayerCard"
import { PreviousMoves } from "@/features/game/components/PreviousMoves"
import { RequestDrawModal } from "@/features/game/components/RequestDrawModal"
import { ResignModal } from "@/features/game/components/ResignModal"
import { Timer } from "@/features/game/components/Timer"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"
import { useGame } from "./useGame"

type GameProps = Readonly<{ id: string; username: string }>

export const Game = ({ id: userId, username }: GameProps) => {
  const { state, connected, handlePlayAgain, handleResign, handlePromotion } =
    useGame(userId, username)

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
                duration={state.timer[state.opponent.color]}
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
              <Timer
                duration={state.timer[state.player.color]}
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
