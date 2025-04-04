import type { Board } from "@/features/board/types"
import { createBoard } from "@/features/board/utils"
import { createPiece } from "@/features/piece/utils"

export const createBenchmarkBoard = () => {
  const board = createBoard(false)

  board[2][2].piece = createPiece("king", "w")
  board[2][1].piece = createPiece("rook", "w")
  board[2][3].piece = createPiece("rook", "w")
  board[1][0].piece = createPiece("rook", "b")

  return board
}

export const createCheckmateBoard = () => {
  const board = createBoard(false)

  board[2][9].piece = createPiece("queen", "b")
  board[2][4].piece = createPiece("king", "b")
  board[2][29].piece = createPiece("king", "w")
  board[1][5].piece = createPiece("rook", "b")
  board[2][40].piece = createPiece("pawn-cw", "w")

  return board
}

export const getEmptyCellTests = (board: Board, testFn: (cell: any) => any) =>
  board.reduce((tests, ring, ringIndex) => {
    ring.forEach((cell, cellIndex) => {
      if (cell.piece === null) {
        tests.push(testFn(board[ringIndex][cellIndex]))
      }
    })
    return tests
  }, [] as any[])

export const getBlockedCellIndices = () => [
  ...Array(6)
    .fill(0)
    .map((_, i) => ({ ring: 2, cell: i + 1 })),
  ...Array(6)
    .fill(0)
    .map((_, i) => ({ ring: 2, cell: i + 26 })),
  ...Array(2)
    .fill(0)
    .map((_, i) => ({ ring: 1, cell: i + 1 })),
  ...Array(2)
    .fill(0)
    .map((_, i) => ({ ring: 1, cell: i + 16 })),
]
