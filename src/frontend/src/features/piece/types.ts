export type PieceColour = "white" | "black"

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
  colour: PieceColour
  image: string
  value: number
}
