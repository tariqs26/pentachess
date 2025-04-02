import Image from "next/image"
import { cn } from "@/lib/utils"
import { PROMOTION_PIECES } from "../constants"
import type { Piece, PieceColor } from "../types"
import { makePiece } from "../utils"

type PawnPromotionModalProps = Readonly<{
  turn: PieceColor
  handlePromotion: (piece: Piece) => void
}>

export const PawnPromotionModal = ({
  turn,
  handlePromotion,
}: PawnPromotionModalProps) => (
  <>
    <div className="absolute inset-0 z-10 bg-black/50" />
    <div className="absolute inset-0 z-10 flex items-center justify-start">
      <div className="ml-4 rounded-xl border bg-card p-4 text-center shadow-lg">
        <h2 className="mb-4 font-semibold leading-none tracking-tight">
          Promote
          <br />
          Pawn
        </h2>
        <div className="flex flex-col gap-3">
          {PROMOTION_PIECES.map((piece) => makePiece(piece, turn)).map(
            (piece) => (
              <button
                key={piece.type}
                type="button"
                className={cn(
                  "rounded-md border bg-secondary p-2.5 text-secondary-foreground shadow-sm transition-colors hover:cursor-pointer hover:bg-secondary/80 hover:text-accent-foreground",
                  turn === "b" && "dark:brightness-110 dark:filter"
                )}
                onClick={() => handlePromotion(piece)}
              >
                {piece.type === "pawn-cw" ? (
                  "Skip"
                ) : (
                  <Image
                    src={piece.image}
                    alt={piece.type}
                    className="size-10"
                  />
                )}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  </>
)
