import type { StaticImageData } from "next/image"
import type { PieceColour, PieceType } from "./types"

import berolinaB from "/public/pieces/berolina-b.png"
import berolinaW from "/public/pieces/berolina-w.png"
import bishopB from "/public/pieces/bishop-b.png"
import bishopW from "/public/pieces/bishop-w.png"
import kingB from "/public/pieces/king-b.png"
import kingW from "/public/pieces/king-w.png"
import knightB from "/public/pieces/knight-b.png"
import knightW from "/public/pieces/knight-w.png"
import pawnB from "/public/pieces/pawn-b.png"
import pawnW from "/public/pieces/pawn-w.png"
import queenB from "/public/pieces/queen-b.png"
import queenW from "/public/pieces/queen-w.png"
import rookB from "/public/pieces/rook-b.png"
import rookW from "/public/pieces/rook-w.png"

const pawn = { value: 1, image: { w: pawnW, b: pawnB } }
const berolinaPawn = { value: 1, image: { w: berolinaW, b: berolinaB } }

export const PIECE_DATA: Record<
  PieceType,
  {
    value: number
    image: Record<PieceColour, StaticImageData>
  }
> = {
  king: {
    value: 9999,
    image: { w: kingW, b: kingB },
  },
  queen: {
    value: 9,
    image: { w: queenW, b: queenB },
  },
  rook: {
    value: 5,
    image: { w: rookW, b: rookB },
  },
  bishop: {
    value: 3,
    image: { w: bishopW, b: bishopB },
  },
  knight: {
    value: 3,
    image: { w: knightW, b: knightB },
  },
  "pawn-cw": pawn,
  "pawn-ccw": pawn,
  "berolina-pawn-cw": berolinaPawn,
  "berolina-pawn-ccw": berolinaPawn,
}
