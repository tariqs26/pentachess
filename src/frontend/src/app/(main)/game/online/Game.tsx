"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { CapturedPieces } from "@/features/game/components/CapturedPieces"
import { GameEndModal } from "@/features/game/components/GameEndModal"
import { PreviousMoves } from "@/features/game/components/PreviousMoves"
import { RequestDrawModal } from "@/features/game/components/RequestDrawModal"
import { ResignModal } from "@/features/game/components/ResignModal"
import { Timer } from "@/features/game/components/Timer"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"
import { useGame } from "./useGame"
import { isGameOver } from "@/features/game/utils"

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
              <Timer duration={state.timer[state.opponent.color]} />
              <p
                className={cn(
                  "absolute left-0 -mt-1 font-bold",
                  state.check === state.opponent.color && "text-red-500",
                  state.status.startsWith("draw") && "text-gray-500"
                )}
              >
                Opponent{" "}
                {(state.check === state.opponent.color &&
                  `(${state.status === "checkmate" ? "checkmate" : "check"})`) ||
                  (state.status.startsWith("draw") && "(draw)")}
              </p>
              <Board
                flipped={state.player.color === "b"}
                disabled={state.disabled || state.turn !== state.player.color}
              />
              <p
                className={cn(
                  "absolute bottom-0 left-0 -mb-1 font-bold",
                  state.check === state.player.color && "text-red-500",
                  state.status.startsWith("draw") && "text-gray-500"
                )}
              >
                You{" "}
                {(state.check === state.player.color &&
                  `(${state.status === "checkmate" ? "checkmate" : "check"})`) ||
                  (state.status.startsWith("draw") && "(draw)")}
              </p>
              <Timer
                duration={state.timer[state.player.color]}
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
