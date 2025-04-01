import {
  makePiece,
  canPromote,
  getPossibleMoves,
  getInvalidMoves,
} from "@/features/piece/utils"
import type {
  Piece,
  PieceAbbr,
  PieceColor,
  PieceType,
} from "@/features/piece/types"
import { describe, it, expect, beforeEach } from "vitest"
import kingW from "/public/pieces/king-w.png"
import rookB from "/public/pieces/rook-b.png"
import queenW from "/public/pieces/queen-w.png"
import pawnBCcw from "/public/pieces/pawn-b-ccw.png"
import { initializeBoard } from "@/features/board/utils"
import { Board } from "@/features/board/types"

// Test fixtures
const TEST_PIECE_TYPES: PieceType[] = ["king", "rook", "queen", "pawn-ccw"]
const TEST_PIECE_COLORS = ["white", "black", "white", "black"]
const TEST_PIECE_VALUES = [9999, 5, 9, 1]
const TEST_PIECE_IMAGES = [kingW, rookB, queenW, pawnBCcw]

const PAWN_TYPES: PieceType[] = [
  "pawn-cw",
  "pawn-ccw",
  "berolina-pawn-cw",
  "berolina-pawn-ccw",
]

const NON_PAWN_TYPES: PieceType[] = [
  "king",
  "queen",
  "rook",
  "bishop",
  "knight",
]

const PROMOTION_SQUARES = {
  w: Array(8)
    .fill(0)
    .map((_, i) => ({ x: 2, y: i + 25 })),
  b: Array(8)
    .fill(0)
    .map((_, i) => ({ x: 2, y: i })),
}

// Helper functions
const createCheckmateBoard = (board: Board): Board => {
  // Clear the board
  board = initializeBoard(false)

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

const getEmptyCellTests = (board: Board, testFn: (cell: any) => any) => {
  return board.reduce((tests, ring, ringIndex) => {
    ring.forEach((cell, cellIndex) => {
      if (cell.piece === null) {
        tests.push(testFn(board[ringIndex][cellIndex]))
      }
    })
    return tests
  }, [] as any[])
}

const getBlockedCellIndices = () => {
  return [
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
}

describe("Piece Utility Functions", () => {
  describe("makePiece", () => {
    const testCases = TEST_PIECE_TYPES.map(
      (type, i) =>
        `should create a ${TEST_PIECE_COLORS[i]} ${type} with correct properties`
    )

    const expectedPieces: Piece[] = TEST_PIECE_TYPES.map((type, i) => ({
      type,
      abbr: type[0].toUpperCase() as PieceAbbr,
      color: TEST_PIECE_COLORS[i][0] as PieceColor,
      value: TEST_PIECE_VALUES[i],
      image: TEST_PIECE_IMAGES[i],
      hasMoved: false,
      canPromote: true,
    }))

    testCases.forEach((description, i) => {
      it(description, () => {
        const piece = makePiece(
          TEST_PIECE_TYPES[i],
          TEST_PIECE_COLORS[i][0] as "w" | "b"
        )
        expect(piece).toEqual(expectedPieces[i])
      })
    })
  })

  describe("canPromote", () => {
    const pieceColors: PieceColor[] = ["w", "b"]

    const runPromotionTest = (
      description: string,
      squares: any[],
      pieceTypes: PieceType[],
      color: PieceColor,
      expectedResult: boolean
    ) => {
      it(description, () => {
        squares.forEach((square) => {
          pieceTypes.forEach((type) => {
            expect(canPromote(makePiece(type, color), square)).toBe(
              expectedResult
            )
          })
        })
      })
    }

    pieceColors.forEach((color) => {
      const colorName = color === "w" ? "white" : "black"
      const promotionSquares = PROMOTION_SQUARES[color]
      const nonPromotionSquares = PROMOTION_SQUARES[color === "w" ? "b" : "w"]

      runPromotionTest(
        `should allow ${colorName} pawns to promote at promotion squares`,
        promotionSquares,
        PAWN_TYPES,
        color,
        true
      )

      runPromotionTest(
        `should not allow ${colorName} pawns to promote at non-promotion squares`,
        nonPromotionSquares,
        PAWN_TYPES,
        color,
        false
      )

      runPromotionTest(
        `should not allow ${colorName} non-pawn pieces to promote at promotion squares`,
        promotionSquares,
        NON_PAWN_TYPES,
        color,
        false
      )
    })
  })

  describe("getPossibleMoves and getInvalidMoves", () => {
    let board: Board

    beforeEach(() => {
      board = initializeBoard()
    })

    describe("getPossibleMoves", () => {
      it("should return correct moves for pawns", () => {
        const pawnMoveTests = [
          { piece: board[1][0], expected: [board[0][9]] },
          { piece: board[2][48], expected: [board[2][46], board[2][47]] },
          { piece: board[1][19], expected: [board[1][20], board[1][21]] },
          { piece: board[2][24], expected: [board[2][22]] },
        ]

        pawnMoveTests.forEach(({ piece, expected }) => {
          expect(getPossibleMoves(piece, board)).toEqual(new Set(expected))
        })
      })

      it("should return correct moves for bishops", () => {
        const bishopMoveTests = [
          { piece: board[2][0], expected: [board[1][28]] },
          { piece: board[2][25], expected: [board[1][13]] },
        ]

        bishopMoveTests.forEach(({ piece, expected }) => {
          expect(getPossibleMoves(piece, board)).toEqual(new Set(expected))
        })
      })

      it("should return empty set for empty cells", () => {
        const emptyCellTests = getEmptyCellTests(board, (cell) => ({
          piece: cell,
          expected: [],
        }))

        emptyCellTests.forEach(({ piece, expected }) => {
          expect(getPossibleMoves(piece, board)).toEqual(new Set(expected))
        })
      })

      it("should return empty set for blocked pieces", () => {
        const blockedIndices = getBlockedCellIndices()

        blockedIndices.forEach(({ ring, cell }) => {
          expect(getPossibleMoves(board[ring][cell], board)).toEqual(
            new Set([])
          )
        })
      })
    })

    describe("getInvalidMoves", () => {
      it("should return empty set for pieces with only valid moves", () => {
        const validMovesTests = [
          { ring: 2, cell: 0 },
          { ring: 2, cell: 25 },
          { ring: 1, cell: 0 },
          { ring: 2, cell: 48 },
          { ring: 1, cell: 19 },
          { ring: 2, cell: 24 },
        ]

        validMovesTests.forEach(({ ring, cell }) => {
          const piece = board[ring][cell]
          const possibleMoves = getPossibleMoves(piece, board)
          expect(getInvalidMoves(piece, board, possibleMoves)).toEqual(
            new Set([])
          )
        })
      })

      it("should return empty set for empty cells", () => {
        const emptyCellTests = getEmptyCellTests(board, (cell) => ({
          piece: cell,
          possibleMoves: getPossibleMoves(cell, board),
        }))

        emptyCellTests.forEach(({ piece, possibleMoves }) => {
          expect(getInvalidMoves(piece, board, possibleMoves)).toEqual(
            new Set([])
          )
        })
      })

      it("should return empty set for blocked pieces", () => {
        const blockedIndices = getBlockedCellIndices()

        blockedIndices.forEach(({ ring, cell }) => {
          const piece = board[ring][cell]
          const possibleMoves = getPossibleMoves(piece, board)
          expect(getInvalidMoves(piece, board, possibleMoves)).toEqual(
            new Set([])
          )
        })
      })

      it("should return set of invalid moves in checkmate scenario", () => {
        board = createCheckmateBoard(board)
        const kingPiece = board[2][29]
        const possibleMoves = getPossibleMoves(kingPiece, board)
        const expectedInvalidMoves = [
          board[2][30],
          board[2][31],
          board[2][28],
          board[2][27],
          board[1][17],
        ]

        expect(getInvalidMoves(kingPiece, board, possibleMoves)).toEqual(
          new Set(expectedInvalidMoves)
        )
      })
    })
  })
})

// Keeping placeholder tests but with improved structure
describe("UI Tests", () => {
  // Add UI tests when ready
  it.todo("should implement UI tests")
})

describe("Performance Tests", () => {
  // Add performance tests when ready
  it.todo("should implement performance tests")
})
