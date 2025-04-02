import type { Board } from "@/features/board/types"
import { initializeBoard } from "@/features/board/utils"
import type { PieceType } from "@/features/piece/types"
import { makePiece } from "@/features/piece/utils"

export const createCheckmateBoard = (): Board => {
  // Clear the board
  const board = initializeBoard(false)

  // Setup checkmate scenario
  const pieces = [
    { ring: 2, cell: 9, type: "queen", color: "b" },
    { ring: 2, cell: 4, type: "king", color: "b" },
    { ring: 2, cell: 29, type: "king", color: "w" },
    { ring: 1, cell: 5, type: "rook", color: "b" },
    { ring: 2, cell: 40, type: "pawn-cw", color: "w" },
  ]

  pieces.forEach(({ ring, cell, type, color }) => {
    board[ring][cell].piece = makePiece(type as PieceType, color as "w" | "b")
  })

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

// Measure execution time for functions
export const measureExecutionTime = (fn: () => void): number => {
  const iterations = 10;
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return (end - start) / iterations;
};