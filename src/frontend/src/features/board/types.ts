import type { Piece } from "../piece/types"

// TODO: improve colour type
export type CellColour = "primary" | "secondary"

export type RingId = "A" | "B" | "C"

export type CellId = `${RingId}${number}`

export type Cell = {
  id: CellId // A0, A1 ...
  colour: CellColour
  side: number // 1, 2, 3..
  position: { i: number; j: number }
  // adjacent neighbours
  adjacent: {
    // left
    prev: Cell
    // right
    next: Cell
    // top
    in: Cell | null
    // bottom
    out: Cell | null
  }
  // vertex neighbours
  vertices: {
    in: Cell[]
    out: Cell[]
  }
  piece: Piece | null
}

export type Ring = Cell[]

export type Board = Ring[]

export type BoardState = {
  board: Board
  disabled: boolean
  selectedCell: {
    cell: Cell
    availableMoves: Cell[]
  } | null
}

export type BoardAction =
  | { type: "SELECT_CELL"; payload: { cell: Cell } }
  | { type: "MOVE_PIECE"; payload: { cell: Cell } }
  | { type: "SET_DISABLED"; payload: { disabled: boolean } }
