import type { Board, Cell } from "../board/types"

// TODO: Demo MVP
export const getAvailableMoves = (board: Board, cell: Cell): Cell[] => {
  const cells: Cell[] = []

  if (cell.piece === null) return cells

  // We could look at using strategy pattern instead of the switch statement

  switch (cell.piece.type) {
    case "king":
      break
    case "queen":
      break
    case "rook":
      break
    case "bishop":
      break
    default:
      break
  }

  return cells
}

// TODO: Demo MVP
export const movePiece = (board: Board, from: Cell, to: Cell) => {
  console.info(board, from, to)
}

// TODO
export const capturePiece = (board: Board, from: Cell, to: Cell) => {
  console.info(board, from, to)
}

// TODO
export const promotePawn = (board: Board, cell: Cell) => {
  console.info(board, cell)
}
