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

type PendingMove = {
  to: Cell
  from: Cell
  piece: Piece
  capturedPiece: Piece | null
}

export type BoardState = {
  board: Board
  selectedCell?: {
    cell: Cell
    availableMoves: Set<Cell>
    invalidMoves: Set<Cell>
  }
  pendingMove?: PendingMove
}

export type BoardAction =
  | { type: "SET_SELECTED_CELL"; cell: Cell | null }
  | { type: "SET_PENDING_MOVE"; pendingMove: PendingMove }
  | { type: "CANCEL_MOVE" }
  | { type: "CONFIRM_MOVE" }
