import { describe, expect, it } from "@jest/globals"
import { makeCell, cloneCell, cellId, getCWEdge, getCCWEdge } from "../cell"
import { 
  getKingCell, 
  checkInsufficientMatrial, 
  cloneBoard, 
  initializeBoard,
  getSides,
  checkThreeMoveRep,
  checkFiftyMoveNoCap
} from "../utils"
import { makePiece } from "../../piece/utils"
import type { Board, Cell } from "../types"
import type { Piece } from "../../piece/types"

describe("Board Cell Functions", () => {
  it("should create a cell with correct properties", () => {
    const cell = makeCell(0, 5, 180)
    
    expect(cell.id).toBe("c5")
    expect(cell.color).toBe("w")
    expect(cell.x).toBe(0)
    expect(cell.y).toBe(5)
    expect(cell.angle).toBe(180)
    expect(cell.piece).toBeNull()
    expect(cell.edges).toEqual([])
    expect(cell.vertices).toEqual([])
  })
  
  it("should clone a cell correctly", () => {
    const original = makeCell(1, 10, 36)
    original.piece = makePiece("pawn-cw", "w")
    original.edges = [[1, 11], [1, 9]]
    original.vertices = [[0, 3], [0, 4]]
    
    const cloned = cloneCell(original)
    
    expect(cloned).not.toBe(original) // Different reference
    expect(cloned.id).toBe(original.id)
    expect(cloned.color).toBe(original.color)
    expect(cloned.piece).toEqual(original.piece)
    expect(cloned.edges).toEqual(original.edges)
    expect(cloned.vertices).toEqual(original.vertices)
    
    // Edges and vertices should be deep cloned
    expect(cloned.edges[0]).not.toBe(original.edges[0])
    expect(cloned.vertices[0]).not.toBe(original.vertices[0])
  })

  it("should generate correct cell IDs", () => {
    expect(cellId(0, 5)).toBe("c5")
    expect(cellId(1, 15)).toBe("b15")
    expect(cellId(2, 30)).toBe("a30")
  })

  it("should get clockwise and counter-clockwise edges", () => {
    const board = initializeBoard()
    const cell = board[0][0]

    // CCW edge is at edges[0], CW edge is at edges[1]
    const ccwEdge = getCCWEdge(cell, board)
    const cwEdge = getCWEdge(cell, board)

    expect(ccwEdge).not.toBeNull()
    expect(cwEdge).not.toBeNull()
    
    // Check that the edges are different cells
    expect(ccwEdge.id).not.toBe(cell.id)
    expect(cwEdge.id).not.toBe(cell.id)
    expect(ccwEdge.id).not.toBe(cwEdge.id)
  })
})

describe("Board Utility Functions", () => {
  it("should find the king's cell", () => {
    const board = initializeBoard()
    // Assuming the initial board has kings at known positions
    const whiteKingCell = getKingCell(board, "w")
    const blackKingCell = getKingCell(board, "b")
    
    expect(whiteKingCell).not.toBeNull()
    expect(blackKingCell).not.toBeNull()
    expect(whiteKingCell?.piece?.type).toBe("king")
    expect(whiteKingCell?.piece?.color).toBe("w")
    expect(blackKingCell?.piece?.type).toBe("king")
    expect(blackKingCell?.piece?.color).toBe("b")
  })
  
  it("should clone a board correctly", () => {
    const original = initializeBoard()
    const cloned = cloneBoard(original)
    
    expect(cloned).not.toBe(original) // Different reference
    expect(cloned.length).toBe(original.length)
    
    // Check a few cells to ensure they are cloned correctly
    expect(cloned[0][0]).not.toBe(original[0][0])
    expect(cloned[0][0].id).toBe(original[0][0].id)
    
    // Modify the clone and check it doesn't affect original
    cloned[0][0].piece = makePiece("queen", "w")
    expect(original[0][0].piece?.type).not.toBe("queen")
  })
  
  it("should detect insufficient material", () => {
    const board: Board = [[], [], []]
    
    // Create a minimal board with just two kings
    for (let ring = 0; ring < 3; ring++) {
      for (let tile = 0; tile < 10; tile++) {
        const cell = makeCell(ring, tile, 0)
        board[ring].push(cell)
      }
    }
    
    // Add kings
    board[0][0].piece = makePiece("king", "w")
    board[0][5].piece = makePiece("king", "b")
    
    const result = checkInsufficientMatrial(board)
    expect(result).toBe(true)
    
    // Add a piece so it's no longer insufficient material
    board[1][0].piece = makePiece("pawn-cw", "w")
    const resultWithPawn = checkInsufficientMatrial(board)
    expect(resultWithPawn).toBe(false)
  })

  it("should divide array into sides", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = getSides(array, 2)
    
    expect(result).toEqual([[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]])
    
    const result2 = getSides(array, 5)
    expect(result2).toEqual([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]])
  })

  it("should detect three-move repetition", () => {
    // Create a series of moves that repeat
    const moves: { from: Cell; to: Cell; piece: Piece }[] = []
    
    // Create a few cells for testing
    const cell1 = makeCell(0, 0, 0)
    const cell2 = makeCell(0, 1, 36)
    const piece = makePiece("knight", "w")
    
    // Add moves to simulate repetition (three times, each time has 4 moves)
    for (let i = 0; i < 3; i++) {
      moves.push({ from: cell1, to: cell2, piece })
      moves.push({ from: cell2, to: cell1, piece })
      moves.push({ from: cell1, to: cell2, piece })
      moves.push({ from: cell2, to: cell1, piece })
    }
    
    const result = checkThreeMoveRep(moves)
    expect(result).toBe(true)
    
    // Test with less than 12 moves (should return false)
    const fewMoves = moves.slice(0, 8)
    expect(checkThreeMoveRep(fewMoves)).toBe(false)
    
    // Test with non-repeating moves
    const nonRepeatingMoves = [...moves]
    nonRepeatingMoves[4] = { 
      from: makeCell(0, 3, 108), 
      to: makeCell(0, 4, 144), 
      piece 
    }
    expect(checkThreeMoveRep(nonRepeatingMoves)).toBe(false)
  })
  
  it("should detect fifty moves with no captures", () => {
    const moves: { to: Cell; piece: Piece }[] = []
    const cell = makeCell(0, 0, 0)
    const piece = makePiece("knight", "w")
    
    // Add 50 moves with no captures
    for (let i = 0; i < 50; i++) {
      moves.push({ to: cell, piece })
    }
    
    expect(checkFiftyMoveNoCap(moves)).toBe(true)
    
    // Test with less than 50 moves
    const fewMoves = moves.slice(0, 40)
    expect(checkFiftyMoveNoCap(fewMoves)).toBe(false)
    
    // Test with a capture in the middle
    const movesWithCapture = [...moves]
    const cellWithPiece = makeCell(0, 1, 36)
    cellWithPiece.piece = makePiece("pawn-cw", "b")
    movesWithCapture[25] = { to: cellWithPiece, piece }
    expect(checkFiftyMoveNoCap(movesWithCapture)).toBe(false)
  })
})
