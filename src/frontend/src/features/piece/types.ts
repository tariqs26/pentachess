import type { StaticImageData } from "next/image"

export type PieceColor = "w" | "b" // white | black

export type PieceType =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn-cw"
  | "pawn-ccw"
  | "berolina-pawn-cw"
  | "berolina-pawn-ccw"

export type Piece = {
  type: PieceType
  color: PieceColor
  value: number
  image: StaticImageData
}
