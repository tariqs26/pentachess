import Image from "next/image"
import { useLocalGame } from "@/features/game/useLocalGame"
import { Piece } from "@/features/piece/types"
import { makePiece } from "@/features/piece/utils"
import { PROMOTION_PIECES } from "../constants"
import { cn } from "@/lib/utils"

export const PromoteIcon = () => {
  const { state, dispatch } = useLocalGame()

  function handlePawnPromotion(piece: Piece) {
    dispatch({ type: "PROMOTE_PAWN", payload: piece })
  }

  const pieceColor = state.turn === "w" ? "b" : "w"

  return (
    <div className="absolute inset-0 grid place-items-center bg-black/50">
      <div className="relative rounded-xl border bg-card p-4 text-center shadow-lg">
        <h2 className="mb-4 font-semibold leading-none tracking-tight">
          Promote Your Pawn
        </h2>
        <div className="flex gap-3">
          {PROMOTION_PIECES.map((piece) => makePiece(piece, pieceColor)).map(
            (piece) => (
              <button
                key={piece.type}
                onClick={() => handlePawnPromotion(piece)}
                className={cn(
                  "rounded-md border bg-secondary p-2.5 text-secondary-foreground shadow-sm transition-colors hover:cursor-pointer hover:bg-secondary/80 hover:text-accent-foreground",
                  pieceColor === "b" && "dark:brightness-110 dark:filter"
                )}
              >
                <Image src={piece.image} alt={piece.type} className="size-10" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
