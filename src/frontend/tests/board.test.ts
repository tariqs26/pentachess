import { describe, expect, it, beforeEach } from "vitest"
import { makeCell } from "@/features/board/cell"
import {
  getKingCell,
  checkInsufficientMaterial,
  cloneBoard,
  initializeBoard,
  getSides,
  checkThreeMoveRep,
  checkFiftyMoveNoCap,
  checkForCheckOrMate,
  checkForStalemate,
} from "@/features/board/utils"
import { makePiece } from "@/features/piece/utils"
import type { Board } from "@/features/board/types"
import { Move } from "@/features/game/types"
import { createMove } from "@/features/game/utils"
import { PieceColor } from "@/features/piece/types"
import { createCheckmateBoard } from "./piece.test"

// Helper functions for test setup
const createEmptyBoard = (): Board => initializeBoard(false)

const createBoardWithKings = (): Board => {
  const board = createEmptyBoard()
  board[2][4].piece = makePiece("king", "w")
  board[2][28].piece = makePiece("king", "b")
  return board
}

const createMovesWithCapture = (count: number, withCapture = false): Move[] => {
  const moves: Move[] = []
  const cell1 = makeCell(0, 0, 0)
  const cell2 = makeCell(0, 1, 36)
  const piece = makePiece("knight", "w")

  for (let i = 0; i < count; i++) {
    let move: Move

    if (withCapture && i === Math.floor(count / 2)) {
      const captureCell = makeCell(0, 2, 72)
      captureCell.piece = makePiece("pawn-cw", "b")
      move = createMove(
        "w",
        cell1,
        captureCell,
        piece,
        captureCell.piece,
        null,
        "playing"
      )
    } else {
      move = createMove("w", cell1, cell2, piece, null, null, "playing")
    }

    moves.push(move)
  }

  return moves
}

const createRepeatingMoves = (count: number): Move[] => {
  // Create test moves with repetition pattern for three-move detection
  const moves: Move[] = []
  const cell1 = makeCell(0, 0, 0)
  const cell2 = makeCell(0, 1, 36)
  const piece = makePiece("knight", "w")

  // Add repeating pattern (count) times - each unit has 4 moves
  for (let i = 0; i < count; i++) {
    moves.push(createMove("w", cell1, cell2, piece, null, null, "waiting"))
    moves.push(createMove("w", cell2, cell1, piece, null, null, "waiting"))
    moves.push(createMove("w", cell1, cell2, piece, null, null, "waiting"))
    moves.push(createMove("w", cell2, cell1, piece, null, null, "waiting"))
  }

  return moves
}

describe("Board Utility Functions", () => {
  describe("initializeBoard", () => {
    it("should initialize a board with correct structure and properties", () => {
      const board = initializeBoard()

      // Check board dimensions
      expect(board.length).toBe(3)
      expect(board[0].length).toBe(10) // Inner ring
      expect(board[1].length).toBe(30) // Middle ring
      expect(board[2].length).toBe(50) // Outer ring

      // Verify all cells have required properties
      board.forEach((ring, ringIndex) => {
        ring.forEach((cell) => {
          expect(cell.id).toBeDefined()
          expect(cell.color).toBeDefined()
          expect(cell.edges).toBeInstanceOf(Array)
          expect(cell.vertices).toBeInstanceOf(Array)
        })
      })
    })
  })

  describe("getSides", () => {
    it("should divide array into sides with specified side length", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      // Test with side length 2
      expect(getSides(array, 2)).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, 10],
      ])

      // Test with side length 5
      expect(getSides(array, 5)).toEqual([
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
      ])

      // Test with side length 0
      expect(getSides(array, 0)).toEqual([])

      // Test with side length 1
      expect(getSides(array, 1)).toEqual([
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8],
        [9],
        [10],
      ])
    })
  })

  describe("getKingCell", () => {
    let board: Board

    beforeEach(() => {
      board = createEmptyBoard()
    })

    const testCases = [
      { color: "white", type: "w", id: "c0", x: 0, y: 0 },
      { color: "black", type: "b", id: "c5", x: 0, y: 5 },
      { color: "white", type: "w", id: "b20", x: 1, y: 20 },
      { color: "black", type: "b", id: "b20", x: 1, y: 21 },
      { color: "white", type: "w", id: "a1", x: 2, y: 1 },
      { color: "black", type: "b", id: "b20", x: 2, y: 2 },
      { color: "white", type: "w", id: "", x: -1, y: -1 },
      { color: "black", type: "b", id: "", x: -1, y: -1 },
    ]

    testCases.forEach(({ color, type, id, x, y }) => {
      if (!id) {
        it(`should find the ${color} king's cell at ${id}`, () => {
          board[0][0].piece = makePiece("king", type as PieceColor)

          const result = getKingCell(board, type as PieceColor)

          expect(result).not.toBeNull()
          expect(result?.piece?.type).toBe("king")
          expect(result?.piece?.color).toBe(type)
        })
      } else {
        it(`should not be able to find the ${color} king's cell`, () => {
          expect(getKingCell(board, type as PieceColor)).toBeNull()
        })
      }
    })
  })

  describe("cloneBoard", () => {
    it("should clone a board correctly", () => {
      const original = initializeBoard()
      const cloned = cloneBoard(original)

      // Check that the clone is a new object with same structure
      expect(cloned).not.toBe(original)
      expect(cloned.length).toBe(original.length)

      // Verify each cell is properly cloned
      original.forEach((ring, ringIndex) => {
        ring.forEach((cell, cellIndex) => {
          const clonedCell = cloned[ringIndex][cellIndex]

          // Cell should be a new object
          expect(clonedCell).not.toBe(cell)

          // But with identical properties
          expect(clonedCell.id).toBe(cell.id)
          expect(clonedCell.color).toBe(cell.color)
          expect(clonedCell.piece).toEqual(cell.piece)
          expect(clonedCell.edges).toEqual(cell.edges)
          expect(clonedCell.vertices).toEqual(cell.vertices)
        })
      })

      // Verify changes to clone don't affect original
      cloned[0][0].piece = makePiece("queen", "w")
      expect(original[0][0].piece?.type).not.toBe("queen")
    })
  })

  describe("checkInsufficientMaterial", () => {
    let board: Board

    beforeEach(() => {
      board = createBoardWithKings()
    })

    it("should detect insufficient material", () => {
      const result = checkInsufficientMaterial(board)
      expect(result).toBe(true)

      // remove one king
      board[2][4].piece = null
      const resultWithoutOneKing = checkInsufficientMaterial(board)
      expect(resultWithoutOneKing).toBe(false)

      // remove another king
      board[2][29].piece = null
      const resultWithoutTwoKings = checkInsufficientMaterial(board)
      expect(resultWithoutTwoKings).toBe(false)

      // Add a piece so it's no longer insufficient material
      board[0][0].piece = makePiece("pawn-cw", "w")
      const resultWithPawn = checkInsufficientMaterial(board)
      expect(resultWithPawn).toBe(false)

      board[0][1].piece = makePiece("rook", "w")
      const resultWithRook = checkInsufficientMaterial(board)
      expect(resultWithRook).toBe(false)

      board[0][2].piece = makePiece("bishop", "w")
      const resultWithBishop = checkInsufficientMaterial(board)
      expect(resultWithBishop).toBe(false)

      board[0][3].piece = makePiece("knight", "w")
      const resultWithKnight = checkInsufficientMaterial(board)
      expect(resultWithKnight).toBe(false)
    })

    it("should not be able to detect insufficient material", () => {
      const completeBoard: Board = initializeBoard()
      const result = checkInsufficientMaterial(completeBoard)

      expect(result).toBe(false)
    })
  })

  describe("checkForCheckOrMate", () => {
    it("should not detect checkmate", () => {
      const board = initializeBoard(false)
      const emptyBoardResult = checkForCheckOrMate(board, "w")
      expect(emptyBoardResult).toEqual([null, false])

      board[0][0].piece = makePiece("king", "w")
      board[0][2].piece = makePiece("king", "b")

      const twoKingsResult = checkForCheckOrMate(board, "w")
      expect(twoKingsResult).toEqual(["w", false])
    })

    it("should detect checkmate", () => {
      const board = createCheckmateBoard()

      const result = checkForCheckOrMate(board, "w")
      expect(result).toEqual(["w", true])
    })
  })

  describe("checkForStalemate", () => {
    it("should not detect stalemate", () => {
      const board = initializeBoard()
      const result = checkForStalemate(board, "w")
      expect(result).toEqual(false)
    })

    it("should detect stalemate", () => {
      const board = initializeBoard(false)

      board[2][30].piece = makePiece("king", "w")
      board[2][31].piece = makePiece("pawn-cw", "w")
      board[2][29].piece = makePiece("pawn-ccw", "w")

      board[2][4].piece = makePiece("rook", "b")
      board[1][4].piece = makePiece("rook", "b")

      const result = checkForStalemate(board, "w")
      expect(result).toEqual(true)
    })
  })

  describe("checkThreeMoveRep", () => {
    it("should detect three-move repetition", () => {
      // Create moves with 3 repetition cycles (sufficient for detection)
      const moves: Move[] = createRepeatingMoves(3)

      expect(checkThreeMoveRep(moves)).toBe(true)

      // Test with insufficient moves for repetition detection
      expect(checkThreeMoveRep(moves.slice(0, 8))).toBe(false)

      // Test with non-repeating pattern
      const nonRepeatingMoves = [
        ...moves,
        createMove(
          "w",
          makeCell(0, 3, 108),
          makeCell(0, 4, 144),
          makePiece("rook", "b"),
          null,
          null,
          "waiting"
        ),
      ]
      expect(checkThreeMoveRep(nonRepeatingMoves)).toBe(false)
    })

    it("should not detect three-move repetition", () => {
      // Create moves with insufficient repetition (only 2 cycles)
      const moves: Move[] = createRepeatingMoves(2)
      expect(checkThreeMoveRep(moves)).toBe(false)
    })
  })

  describe("checkFiftyMoveNoCap", () => {
    it("should detect fifty moves with no captures", () => {
      const moves: Move[] = createMovesWithCapture(50, false)
      expect(checkFiftyMoveNoCap(moves)).toBe(true)
    })

    it("should not detect fifty moves with no captures", () => {
      // Test with fewer than 50 moves
      const movesNoCap: Move[] = createMovesWithCapture(40, false)
      expect(checkFiftyMoveNoCap(movesNoCap)).toBe(false)

      // Test with capture in the middle
      const movesWithCap: Move[] = createMovesWithCapture(40, true)
      expect(checkFiftyMoveNoCap(movesWithCap)).toBe(false)
    })
  })
})
