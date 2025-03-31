import { describe, expect, it } from "vitest"
import { makeCell } from "../features/board/cell"
import {
  getKingCell,
  checkInsufficientMatrial,
  cloneBoard,
  initializeBoard,
  getSides,
  checkThreeMoveRep,
  checkFiftyMoveNoCap,
  checkForCheckOrMate,
  checkForStalemate,
} from "../features/board/utils"
import { makePiece } from "../features/piece/utils"
import type { Board } from "../features/board/types"
import { Move } from "@/features/game/types"
import { createMove } from "@/features/game/utils"

describe("Board Utility Functions", () => {
  it("should initialize a board correctly", () => {
    const board = initializeBoard()
    expect(board.length).toBe(3)
    expect(board[0].length).toBe(10)
    expect(board[1].length).toBe(30)
    expect(board[2].length).toBe(50)

    for (let ring = 0; ring < board.length; ring++) {
      for (let cell = 0; cell < board[ring].length; cell++) {
        expect(board[ring][cell].id).toBeDefined()
        expect(board[ring][cell].color).toBeDefined()
        expect(board[ring][cell].edges).toBeDefined()
        expect(board[ring][cell].vertices).toBeDefined()
      }
    }
  })

  it("should divide array into sides", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = getSides(array, 2)

    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
    ])

    const result2 = getSides(array, 5)
    expect(result2).toEqual([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
    ])

    const result4 = getSides(array, 0)
    expect(result4).toEqual([])

    const result5 = getSides(array, 1)
    expect(result5).toEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]])
  })

  it("should find the white king's cell at C0", () => {
    const board = initializeBoard()
    board[2][4].piece = null

    board[0][0].piece = makePiece("king", "w")

    const whiteKingCell = getKingCell(board, "w")

    expect(whiteKingCell).not.toBeNull()
    expect(whiteKingCell?.piece?.type).toBe("king")
    expect(whiteKingCell?.piece?.color).toBe("w")
  })

  it("should find the black king's cell at C5", () => {
    const board = initializeBoard()

    board[2][29].piece = null

    board[0][5].piece = makePiece("king", "b")

    const blackKingCell = getKingCell(board, "b")

    expect(blackKingCell).not.toBeNull()
    expect(blackKingCell?.piece?.type).toBe("king")
    expect(blackKingCell?.piece?.color).toBe("b")
  })

  it("should find the white king's cell at B20", () => {
    const board = initializeBoard()
    board[2][4].piece = null

    board[1][19].piece = makePiece("king", "w")

    const whiteKingCell = getKingCell(board, "w")

    expect(whiteKingCell).not.toBeNull()
    expect(whiteKingCell?.piece?.type).toBe("king")
    expect(whiteKingCell?.piece?.color).toBe("w")
  })

  it("should find the black king's cell at B21", () => {
    const board = initializeBoard()
    board[2][29].piece = null

    board[1][20].piece = makePiece("king", "b")

    const blackKingCell = getKingCell(board, "b")

    expect(blackKingCell).not.toBeNull()
    expect(blackKingCell?.piece?.type).toBe("king")
    expect(blackKingCell?.piece?.color).toBe("b")
  })

  it("should find the white king's cell at A1", () => {
    const board = initializeBoard()
    board[2][4].piece = null

    board[2][0].piece = makePiece("king", "w")

    const whiteKingCell = getKingCell(board, "w")

    expect(whiteKingCell).not.toBeNull()
    expect(whiteKingCell?.piece?.type).toBe("king")
    expect(whiteKingCell?.piece?.color).toBe("w")
  })

  it("should find the black king's cell at A2", () => {
    const board = initializeBoard()
    board[2][29].piece = null

    board[2][1].piece = makePiece("king", "b")

    const blackKingCell = getKingCell(board, "b")

    expect(blackKingCell).not.toBeNull()
    expect(blackKingCell?.piece?.type).toBe("king")
    expect(blackKingCell?.piece?.color).toBe("b")
  })

  it("should not be able to find the white king's cell", () => {
    const board = initializeBoard()
    board[2][4].piece = null

    const whiteKingCell = getKingCell(board, "w")

    expect(whiteKingCell).toBeNull()
  })

  it("should not be able to find the black king's cell", () => {
    const board = initializeBoard()
    board[2][29].piece = null

    const blackKingCell = getKingCell(board, "b")

    expect(blackKingCell).toBeNull()
  })

  it("should clone a board correctly", () => {
    const original = initializeBoard()
    const cloned = cloneBoard(original)

    expect(cloned).not.toBe(original)
    expect(cloned.length).toBe(original.length)

    // Check each cell in the board is the same as the original
    for (let i = 0; i < original.length; i++) {
      for (let j = 0; j < original[i].length; j++) {
        expect(cloned[i][j]).not.toBe(original[i][j])
        expect(cloned[i][j].id).toBe(original[i][j].id)
        expect(cloned[i][j].color).toBe(original[i][j].color)
        expect(cloned[i][j].piece).toEqual(original[i][j].piece)
        expect(cloned[i][j].edges).toEqual(original[i][j].edges)
        expect(cloned[i][j].vertices).toEqual(original[i][j].vertices)
      }
    }

    cloned[0][0].piece = makePiece("queen", "w")
    expect(original[0][0].piece?.type).not.toBe("queen")
  })

  it("should detect insufficient material", () => {
    const board: Board = initializeBoard()

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].piece?.type !== "king") {
          board[i][j].piece = null
        }
      }
    }

    const result = checkInsufficientMatrial(board)
    expect(result).toBe(true)

    // remove one king
    board[2][4].piece = null
    const resultWithoutOneKing = checkInsufficientMatrial(board)
    expect(resultWithoutOneKing).toBe(false)

    // remove one king
    board[2][29].piece = null
    const resultWithoutTwoKings = checkInsufficientMatrial(board)
    expect(resultWithoutTwoKings).toBe(false)

    // Add a piece so it's no longer insufficient material
    board[0][0].piece = makePiece("pawn-cw", "w")
    const resultWithPawn = checkInsufficientMatrial(board)
    expect(resultWithPawn).toBe(false)

    board[0][1].piece = makePiece("rook", "w")
    const resultWithRook = checkInsufficientMatrial(board)
    expect(resultWithRook).toBe(false)

    board[0][2].piece = makePiece("bishop", "w")
    const resultWithBishop = checkInsufficientMatrial(board)
    expect(resultWithBishop).toBe(false)

    board[0][3].piece = makePiece("knight", "w")
    const resultWithKnight = checkInsufficientMatrial(board)
    expect(resultWithKnight).toBe(false)
  })

  it("should not be able to detect insufficient material", () => {
    const completeBoard: Board = initializeBoard()
    const result = checkInsufficientMatrial(completeBoard)

    expect(result).toBe(false)
  })

  // checkForCheckOrMate

  it("should not detect checkmate", () => {
    const board = initializeBoard()
    const result1 = checkForCheckOrMate(board, "w")
    expect(result1).toEqual([null, false])

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].piece = null
      }
    }

    board[0][0].piece = makePiece("king", "w")
    board[0][2].piece = makePiece("king", "b")

    const result2 = checkForCheckOrMate(board, "w")
    expect(result2).toEqual(["w", false])
  })

  // fix this test
  it("should detect checkmate", () => {
    const board = initializeBoard()

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].piece = null
      }
    }

    board[2][9].piece = makePiece("queen", "w")
    board[2][4].piece = makePiece("king", "w")
    board[1][5].piece = makePiece("rook", "w")
    board[2][40].piece = makePiece("pawn-cw", "b")

    const result = checkForCheckOrMate(board, "w")
    expect(result).toEqual(["w", true])
  })

  it("should not detect stalemate", () => {
    const board = initializeBoard()
    const result = checkForStalemate(board, "w")
    expect(result).toEqual(false)
  })

  // fix this test
  it("should detect stalemate", () => {
    const board = initializeBoard()

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].piece = null
      }
    }

    board[2][40].piece = makePiece("king", "w")
    board[2][2].piece = makePiece("king", "b")

    const result = checkForStalemate(board, "w")
    expect(result).toEqual(true)
  })

  it("should detect three-move repetition", () => {
    // Create a series of moves that repeat
    const moves: Move[] = []

    // Create a few cells for testing
    const cell1 = makeCell(0, 0, 0)
    const cell2 = makeCell(0, 1, 36)
    const piece = makePiece("knight", "w")

    // Add moves to simulate repetition (three times, each time has 4 moves)
    for (let i = 0; i < 3; i++) {
      const move1 = createMove("w", cell1, cell2, piece, null, null, "waiting")
      const move2 = createMove("w", cell2, cell1, piece, null, null, "waiting")
      moves.push(move1)
      moves.push(move2)
      moves.push(move1)
      moves.push(move2)
    }

    const result = checkThreeMoveRep(moves)
    expect(result).toBe(true)

    // Test with less than 12 moves (should return false)
    const fewMoves = moves.slice(0, 8)
    expect(checkThreeMoveRep(fewMoves)).toBe(false)

    // Test with non-repeating moves
    const nonRepeatingMoves = [...moves]
    nonRepeatingMoves[4] = createMove(
      "w",
      makeCell(0, 3, 108),
      makeCell(0, 4, 144),
      piece,
      null,
      null,
      "waiting"
    )
    expect(checkThreeMoveRep(nonRepeatingMoves)).toBe(false)
  })

  it("should not detect three-move repetition", () => {
    // Create a series of moves that repeat
    const moves: Move[] = []

    // Create a few cells for testing
    const cell1 = makeCell(0, 0, 0)
    const cell2 = makeCell(0, 1, 36)
    const piece = makePiece("knight", "w")

    // Add moves to simulate repetition (three times, each time has 4 moves)
    for (let i = 0; i < 2; i++) {
      const move1 = createMove("w", cell1, cell2, piece, null, null, "waiting")
      const move2 = createMove("w", cell2, cell1, piece, null, null, "waiting")
      moves.push(move1)
      moves.push(move2)
      moves.push(move1)
      moves.push(move2)
    }

    expect(checkThreeMoveRep(moves)).toBe(false)

    // Test with non-repeating moves
    const nonRepeatingMoves = [...moves]
    nonRepeatingMoves[4] = createMove(
      "w",
      makeCell(0, 3, 108),
      makeCell(0, 4, 144),
      piece,
      null,
      null,
      "waiting"
    )
    expect(checkThreeMoveRep(nonRepeatingMoves)).toBe(false)
  })

  it("should detect fifty moves with no captures", () => {
    const moves: Move[] = []
    const cell = makeCell(0, 0, 0)
    const piece = makePiece("knight", "w")

    // Add 50 moves with no captures
    for (let i = 0; i < 50; i++) {
      const move = createMove("w", cell, cell, piece, null, null, "waiting")
      moves.push(move)
    }

    expect(checkFiftyMoveNoCap(moves)).toBe(true)
  })

  it("should not detect fifty moves with no captures", () => {
    const moves: Move[] = []
    const cell = makeCell(0, 0, 0)
    const piece = makePiece("knight", "w")

    // Add 50 moves with no captures
    for (let i = 0; i < 40; i++) {
      const move = createMove("w", cell, cell, piece, null, null, "waiting")
      moves.push(move)
    }

    expect(checkFiftyMoveNoCap(moves)).toBe(false)

    // Test with a capture in the middle
    const movesWithCapture = [...moves]
    const cellWithPiece = makeCell(0, 1, 36)
    cellWithPiece.piece = makePiece("pawn-cw", "b")
    movesWithCapture[25] = createMove(
      "w",
      cell,
      cellWithPiece,
      piece,
      null,
      null,
      "waiting"
    )
    expect(checkFiftyMoveNoCap(movesWithCapture)).toBe(false)
  })
})
