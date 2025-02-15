"use client"

import Link from "next/link"
import { useEffect } from "react"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Board } from "@/features/board/components/Board"
import { CapturedPieces } from "@/features/game/components/CapturedPieces"
import { CreateGameForm } from "@/features/game/components/CreateGameForm"
import { PreviousMoves } from "@/features/game/components/PreviousMoves"
import { Timer } from "@/features/game/components/Timer"
import { useLocalGame } from "@/features/game/useLocalGame"
import { PawnPromotionModal } from "@/features/piece/components/PawnPromotionModal"

export default function LocalGamePage() {
  const { state, dispatch } = useLocalGame()

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "DECREMENT_TIMER", payload: state.turn })

      if (
        (state.status === "playing" || state.status === "promoting") &&
        (state.timer.w <= 0 || state.timer.b <= 0)
      ) {
        dispatch({ type: "UPDATE_STATUS", payload: "time-expired" })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch, state])

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
              startHandler={(duration) =>
                dispatch({ type: "START_GAME", payload: duration })
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex w-full justify-center gap-x-2">
          <div className="relative w-full max-w-[600px]">
            {state.status === "promoting" && <PawnPromotionModal />}
            <CapturedPieces pieces={state.capturedPieces.w} />
            <div className="relative">
              <Timer duration={state.timer.b} />
              <p className="absolute left-0 -mt-1 font-bold">Opponent</p>
              <Board />
              <p className="absolute bottom-0 left-0 -mb-1 font-bold">You</p>
              <Timer duration={state.timer.w} className="bottom-0" />
            </div>
            <CapturedPieces pieces={state.capturedPieces.b} />
          </div>
          <PreviousMoves previousMoves={state.previousMoves} />
          {state.status === "time-expired" && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
              <div className="rounded-md bg-card p-6 text-center shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Game Over</h2>
                <p className="mb-4 text-muted-foreground">Time has expired!</p>
                <Button variant="secondary" asChild className="mr-2">
                  <Link href="/">Leave Game</Link>
                </Button>
                <Button
                  onClick={() =>
                    dispatch({ type: "UPDATE_STATUS", payload: "waiting" })
                  }
                >
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
