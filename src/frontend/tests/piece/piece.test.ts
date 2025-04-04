import { beforeEach, describe, expect, it } from "vitest"

import type { Board } from "@/features/board/types"
import { initializeBoard } from "@/features/board/utils"
import type {
  Piece,
  PieceAbbr,
  PieceColor,
  PieceType,
} from "@/features/piece/types"
import {
  canPromote,
  getInvalidMoves,
  getPossibleMoves,
  makePiece,
} from "@/features/piece/utils"

import {
  NON_PAWN_TYPES,
  PAWN_TYPES,
  PROMOTION_SQUARES,
  TEST_PIECE_COLORS,
  TEST_PIECE_IMAGES,
  TEST_PIECE_TYPES,
  TEST_PIECE_VALUES,
} from "./constants"
import {
  createCheckmateBoard,
  getBlockedCellIndices,
  getEmptyCellTests,
} from "./utils"

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
          TEST_PIECE_COLORS[i][0] as PieceColor
        )
        expect(piece).toEqual(expectedPieces[i])
      })
    })
  })

  describe("canPromote", () => {
    const pieceColors: PieceColor[] = ["w", "b"]

    const runPromotionTest = (
      description: string,
      squares: { x: number; y: number }[],
      pieceTypes: PieceType[],
      color: PieceColor,
      expectedResult: boolean
    ) => {
      it(description, () => {
        squares.forEach((square) => {
          pieceTypes.forEach((pieceType) => {
            expect(canPromote(makePiece(pieceType, color), square)).toBe(
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
        board = createCheckmateBoard()
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
