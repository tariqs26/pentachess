export type PieceColour = "black" | "white"

export type PieceType =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn"
  | "bPawn"

export type Piece = {
  type: PieceType
  colour: PieceColour
  image: string
  value: number
}
