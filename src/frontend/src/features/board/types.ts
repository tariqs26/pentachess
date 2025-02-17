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
  disabled: boolean
  selectedCell: { cell: Cell; availableMoves: Set<Cell> } | null
  overCell: Cell | null
}

export type BoardAction =
  | { type: "SELECT_CELL"; payload: Cell | null }
  | { type: "SET_OVER_CELL"; payload: Cell | null }
  | {
      type: "MOVE_PIECE"
      payload: { to: Cell; from: Cell; piece: Piece }
    }
  | { type: "SET_DISABLED"; payload: { disabled: boolean } }
