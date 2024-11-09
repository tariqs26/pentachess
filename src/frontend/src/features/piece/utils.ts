import type { Board, Cell } from "../board/types"

// TODO
export const getAvailableMoves = (board: Board, cell: Cell): Cell[] => {
  const cells: Cell[] = []

  if (cell.piece === null) return cells

  switch (cell.piece.type) {
    case "king":
      break
    case "queen":
      break
    case "rook":
      break
    case "bishop":
      break
    case "knight":
      break
    case "pawn":
      break
    case "bPawn":
      break
  }

  return cells
}

// TODO
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
