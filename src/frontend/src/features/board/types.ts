import type { Piece } from "../piece/types"

// TODO: improve colour type
type CellColour = "white" | "black"

export type CellId = `${"A" | "B" | "C"}${number}`

export type Cell = {
  id: CellId // A0, A1 ...
  colour: CellColour
  side: number // 1, 2, 3..
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
