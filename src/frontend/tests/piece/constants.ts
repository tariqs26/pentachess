import type { PieceType } from "@/features/piece/types"
import kingW from "/public/pieces/king-w.png"
import pawnBCcw from "/public/pieces/pawn-b-ccw.png"
import queenW from "/public/pieces/queen-w.png"
import rookB from "/public/pieces/rook-b.png"

export const TEST_PIECE_TYPES: PieceType[] = [
  "king",
  "rook",
  "queen",
  "pawn-ccw",
]
export const TEST_PIECE_COLORS = ["white", "black", "white", "black"]
export const TEST_PIECE_VALUES = [9999, 5, 9, 1]
export const TEST_PIECE_IMAGES = [kingW, rookB, queenW, pawnBCcw]

export const PAWN_TYPES: PieceType[] = [
  "pawn-cw",
  "pawn-ccw",
  "berolina-pawn-cw",
  "berolina-pawn-ccw",
]

export const NON_PAWN_TYPES: PieceType[] = [
  "king",
  "queen",
  "rook",
  "bishop",
  "knight",
]

export const PROMOTION_SQUARES = {
  w: Array(8)
    .fill(0)
    .map((_, i) => ({ x: 2, y: i + 25 })),
  b: Array(8)
    .fill(0)
    .map((_, i) => ({ x: 2, y: i })),
}
