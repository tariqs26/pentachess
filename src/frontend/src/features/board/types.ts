import type { Cell } from "@/features/board/cell"

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
  | { type: "SELECT_CELL"; payload: { cell: Cell } }
  | { type: "SET_OVER_CELL"; payload: { cell: Cell } }
  | { type: "MOVE_PIECE"; payload: { cell: Cell } }
  | { type: "SET_DISABLED"; payload: { disabled: boolean } }
