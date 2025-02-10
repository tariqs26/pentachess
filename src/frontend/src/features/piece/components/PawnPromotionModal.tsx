import Image from "next/image"
import { useLocalGame } from "@/features/game/useLocalGame"
import { Piece } from "@/features/piece/types"
import { makePiece } from "@/features/piece/utils"
import { PROMOTION_PIECES } from "../constants"
import { cn } from "@/lib/utils"

export const PawnPromotionModal = () => {
  const { state, dispatch } = useLocalGame()

  function handlePawnPromotion(piece: Piece) {
    dispatch({ type: "PROMOTE_PAWN", payload: piece })
  }

  return (
    <div className="absolute inset-0 flex items-center justify-start z-10">
      <div className="relative ml-4 rounded-xl border bg-card p-4 text-center shadow-lg">
        <h2 className="mb-4 font-semibold leading-none tracking-tight">
          Promote
          <br />
          Pawn
        </h2>
        <div className="flex flex-col gap-3 z-12">
          {PROMOTION_PIECES.map((piece) => makePiece(piece, state.turn)).map(
            (piece) => (
              <button
                key={piece.type}
                onClick={() => handlePawnPromotion(piece)}
                className={cn(
                  "rounded-md border bg-secondary p-2.5 text-secondary-foreground shadow-sm transition-colors hover:cursor-pointer hover:bg-secondary/80 hover:text-accent-foreground",
                  state.turn === "b" && "dark:brightness-110 dark:filter"
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
