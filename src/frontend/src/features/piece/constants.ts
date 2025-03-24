import type { StaticImageData } from "next/image"
import type { PieceAbbr, PieceColor, PieceType } from "./types"

import berolinaBCw from "/public/pieces/berolina-b-cw.png"
import berolinaBCcw from "/public/pieces/berolina-b-ccw.png"
import berolinaWCw from "/public/pieces/berolina-w-cw.png"
import berolinaWCcw from "/public/pieces/berolina-w-ccw.png"
import bishopB from "/public/pieces/bishop-b.png"
import bishopW from "/public/pieces/bishop-w.png"
import kingB from "/public/pieces/king-b.png"
import kingW from "/public/pieces/king-w.png"
import knightB from "/public/pieces/knight-b.png"
import knightW from "/public/pieces/knight-w.png"
import pawnBCw from "/public/pieces/pawn-b-cw.png"
import pawnBCcw from "/public/pieces/pawn-b-ccw.png"
import pawnWCw from "/public/pieces/pawn-w-cw.png"
import pawnWCcw from "/public/pieces/pawn-w-ccw.png"
import queenB from "/public/pieces/queen-b.png"
import queenW from "/public/pieces/queen-w.png"
import rookB from "/public/pieces/rook-b.png"
import rookW from "/public/pieces/rook-w.png"

const pawnCw = {
  abbr: "P" as const,
  value: 1,
  image: { w: pawnWCw, b: pawnBCw },
}

const pawnCcw = {
  abbr: "P" as const,
  value: 1,
  image: { w: pawnWCcw, b: pawnBCcw },
}

const berolinaPawnCw = {
  abbr: "L" as const,
  value: 1,
  image: { w: berolinaWCw, b: berolinaBCw },
}

const berolinaPawnCcw = {
  abbr: "L" as const,
  value: 1,
  image: { w: berolinaWCcw, b: berolinaBCcw },
}

export const PIECE_DATA: Record<
  PieceType,
  {
    abbr: PieceAbbr
    value: number
    image: Record<PieceColor, StaticImageData>
  }
> = {
  king: {
    abbr: "K",
    value: 9999,
    image: { w: kingW, b: kingB },
  },
  queen: {
    abbr: "Q",
    value: 9,
    image: { w: queenW, b: queenB },
  },
  rook: {
    abbr: "R",
    value: 5,
    image: { w: rookW, b: rookB },
  },
  bishop: {
    abbr: "B",
    value: 3,
    image: { w: bishopW, b: bishopB },
  },
  knight: {
    abbr: "N",
    value: 3,
    image: { w: knightW, b: knightB },
  },
  "pawn-cw": pawnCw,
  "pawn-ccw": pawnCcw,
  "berolina-pawn-cw": berolinaPawnCw,
  "berolina-pawn-ccw": berolinaPawnCcw,
} as const

export const INITIAL_PIECES: Record<
  number,
  Record<number, [PieceType, PieceColor]>
> = {
  1: {
    29: ["pawn-cw", "w"],
    0: ["pawn-cw", "w"],
    1: ["berolina-pawn-cw", "w"],
    2: ["berolina-pawn-ccw", "w"],
    3: ["pawn-ccw", "w"],
    4: ["pawn-ccw", "w"],
    14: ["pawn-cw", "b"],
    15: ["pawn-cw", "b"],
    16: ["berolina-pawn-cw", "b"],
    17: ["berolina-pawn-ccw", "b"],
    18: ["pawn-ccw", "b"],
    19: ["pawn-ccw", "b"],
  },
  2: {
    48: ["pawn-cw", "w"],
    49: ["berolina-pawn-cw", "w"],
    0: ["bishop", "w"],
    1: ["rook", "w"],
    2: ["knight", "w"],
    3: ["queen", "w"],
    4: ["king", "w"],
    5: ["knight", "w"],
    6: ["rook", "w"],
    7: ["bishop", "w"],
    8: ["berolina-pawn-ccw", "w"],
    9: ["pawn-ccw", "w"],
    23: ["pawn-cw", "b"],
    24: ["berolina-pawn-cw", "b"],
    25: ["bishop", "b"],
    26: ["rook", "b"],
    27: ["knight", "b"],
    28: ["queen", "b"],
    29: ["king", "b"],
    30: ["knight", "b"],
    31: ["rook", "b"],
    32: ["bishop", "b"],
    33: ["berolina-pawn-ccw", "b"],
    34: ["pawn-ccw", "b"],
  },
} as const

export const PROMOTION_PIECES = ["queen", "rook", "bishop", "knight"] as const
