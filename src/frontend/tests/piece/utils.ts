import type { Board } from "@/features/board/types"
import { initializeBoard } from "@/features/board/utils"
import { makePiece } from "@/features/piece/utils"

export const createBenchmarkBoard = () => {
  const board = initializeBoard(false)

  board[2][2].piece = makePiece("king", "w")
  board[2][1].piece = makePiece("rook", "w")
  board[2][3].piece = makePiece("rook", "w")
  board[1][0].piece = makePiece("rook", "b")
  
  return board
}

export const createCheckmateBoard = (): Board => {
  const board = initializeBoard(false)

  board[2][9].piece = makePiece("queen", "b")
  board[2][4].piece = makePiece("king", "b")
  board[2][29].piece = makePiece("king", "w")
  board[1][5].piece = makePiece("rook", "b")
  board[2][40].piece = makePiece("pawn-cw", "w")

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
