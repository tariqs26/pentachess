import type { Piece } from "../piece/types"

export type Cell = {
  id: string
  color: "b" | "w"
  x: number
  y: number
  side: number
  angle: number
  piece: Piece | null
  edges: Array<Cell> // TODO: switch to {next: Cell, prev: Cell, inout: Cell | null}
  vertices: Array<Cell>
}

export type Board = Cell[][]

export type BoardState = {
  board: Board
  disabled: boolean
  selectedCell: {
    cell: Cell
    availableMoves: Cell[]
  } | null
  overCell: Cell | null
}

export type BoardAction =
  | { type: "SELECT_CELL"; payload: Cell | null }
  | { type: "SET_OVER_CELL"; payload: Cell | null }
  | {
      type: "MOVE_PIECE"
      payload: {
        to: { x: number; y: number; piece: Piece | null }
        from: { x: number; y: number; piece: Piece }
        piece: Piece
      }
    }
  | { type: "SET_DISABLED"; payload: { disabled: boolean } }
