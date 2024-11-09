import type { PieceColour, PieceType, Piece } from "./types"

export const INITIAL_PIECES: Record<
  PieceType,
  Pick<Piece, "value" | "image"> & {
    startingPositions: Record<PieceColour, { x: number; y: number }[]>
  }
> = {
  king: {
    image: "king.png",
    value: 1000,
    startingPositions: {
      black: [{ x: 4, y: 0 }],
      white: [{ x: 4, y: 7 }],
    },
  },
  queen: {
    image: "queen.png",
    value: 7,
    startingPositions: {
      black: [{ x: 3, y: 0 }],
      white: [{ x: 3, y: 7 }],
    },
  },
  rook: {
    image: "rook.png",
    value: 4,
    startingPositions: {
      black: [
        { x: 0, y: 0 },
        { x: 7, y: 0 },
      ],
      white: [
        { x: 0, y: 7 },
        { x: 7, y: 7 },
      ],
    },
  },
  bishop: {
    image: "bishop.png",
    value: 3,
    startingPositions: {
      black: [
        { x: 2, y: 0 },
        { x: 5, y: 0 },
      ],
      white: [
        { x: 2, y: 7 },
        { x: 5, y: 7 },
      ],
    },
  },
  knight: {
    image: "knight.png",
    value: 3,
    startingPositions: {
      black: [
        { x: 1, y: 0 },
        { x: 6, y: 0 },
      ],
      white: [
        { x: 1, y: 7 },
        { x: 6, y: 7 },
      ],
    },
  },
  pawn: {
    image: "pawn.png",
    value: 1,
    startingPositions: {
      black: [
        { x: 1, y: 0 },
        { x: 6, y: 0 },
      ],
      white: [
        { x: 1, y: 7 },
        { x: 6, y: 7 },
      ],
    },
  },
  bPawn: {
    image: "b-pawn.png",
    value: 1,
    startingPositions: {
      black: [
        { x: 1, y: 0 },
        { x: 6, y: 0 },
      ],
      white: [
        { x: 1, y: 7 },
        { x: 6, y: 7 },
      ],
    },
  },
} as const
