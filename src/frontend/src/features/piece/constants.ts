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

const pawn = { value: 1, image: { white: pawnW, black: pawnB } }
const berolinaPawn = { value: 1, image: { white: berolinaW, black: berolinaB } }

export const PIECE_DATA: Record<
  PieceType,
  {
    value: number
    image: Record<PieceColour, StaticImageData>
  }
> = {
  king: {
    value: 9999,
    image: { white: kingW, black: kingB },
  },
  queen: {
    value: 9,
    image: { white: queenW, black: queenB },
  },
  rook: {
    value: 5,
    image: { white: rookW, black: rookB },
  },
  bishop: {
    value: 3,
    image: { white: bishopW, black: bishopB },
  },
  knight: {
    value: 3,
    image: { white: knightW, black: knightB },
  },
  "pawn-cw": pawn,
  "pawn-ccw": pawn,
  "berolina-pawn-cw": berolinaPawn,
  "berolina-pawn-ccw": berolinaPawn,
}

export const PIECE_POSITIONS: Record<
  PieceType,
  Record<PieceColour, { i: number; j: number }[]>
> = {
  king: {
    white: [{ i: 2, j: 0 }],
    black: [{ i: 2, j: 25 }],
  },
  queen: {
    white: [{ i: 2, j: 49 }],
    black: [{ i: 2, j: 24 }],
  },
  rook: {
    white: [
      { i: 2, j: 2 },
      { i: 2, j: 47 },
    ],
    black: [
      { i: 2, j: 22 },
      { i: 2, j: 27 },
    ],
  },
  bishop: {
    white: [
      { i: 2, j: 3 },
      { i: 2, j: 46 },
    ],
    black: [
      { i: 2, j: 21 },
      { i: 2, j: 28 },
    ],
  },
  knight: {
    white: [
      { i: 2, j: 1 },
      { i: 2, j: 48 },
    ],
    black: [
      { i: 2, j: 23 },
      { i: 2, j: 26 },
    ],
  },
  "pawn-cw": {
    white: [
      { i: 1, j: 27 },
      { i: 1, j: 28 },
      { i: 2, j: 44 },
    ],
    black: [
      { i: 1, j: 12 },
      { i: 1, j: 13 },
      { i: 2, j: 19 },
    ],
  },
  "pawn-ccw": {
    white: [
      { i: 1, j: 1 },
      { i: 1, j: 2 },
      { i: 2, j: 5 },
    ],
    black: [
      { i: 1, j: 16 },
      { i: 1, j: 17 },
      { i: 2, j: 30 },
    ],
  },
  "berolina-pawn-cw": {
    white: [
      { i: 1, j: 29 },
      { i: 2, j: 45 },
    ],
    black: [
      { i: 1, j: 14 },
      { i: 2, j: 20 },
    ],
  },
  "berolina-pawn-ccw": {
    white: [
      { i: 1, j: 0 },
      { i: 2, j: 4 },
    ],
    black: [
      { i: 1, j: 15 },
      { i: 2, j: 29 },
    ],
  },
}
