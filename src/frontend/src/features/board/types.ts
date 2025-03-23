import type { Piece } from "../piece/types"

export type Cell = {
  id: string
  color: "b" | "w"
  x: number
  y: number
  side: number
  angle: number
  piece: Piece | null
  edges: [number, number][]
  vertices: [number, number][]
}

export type Board = Cell[][]

export type BoardState = {
  board: Board
  pendingMove?: {
    to: Cell
    from: Cell
    piece: Piece
    capturedPiece: Piece | null
  }
  selectedCell: {
    cell: Cell
    availableMoves: Set<Cell>
    invalidMoves: Set<Cell>
  } | null
  overCell: Cell | null
}

export type BoardAction =
  | { type: "SELECT_CELL"; cell: Cell | null }
  | { type: "SET_OVER_CELL"; cell: Cell | null }
  | {
      type: "SET_PENDING_MOVE"
      pendingMove: {
        to: Cell
        from: Cell
        piece: Piece
        capturedPiece: Piece | null
      }
    }
  | { type: "CONFIRM_MOVE" }
  | { type: "CANCEL_MOVE" }
