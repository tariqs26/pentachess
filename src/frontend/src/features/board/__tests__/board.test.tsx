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
  it("should create a cell with correct properties for C5", () => {
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

  it("should create a cell with correct properties for C1", () => {
    const cell = makeCell(0, 1, 36)
    
    expect(cell.id).toBe("c1")
    expect(cell.color).toBe("w")
    expect(cell.x).toBe(0)
    expect(cell.y).toBe(1)
    expect(cell.angle).toBe(36)
    expect(cell.piece).toBeNull()
    expect(cell.edges).toEqual([])
    expect(cell.vertices).toEqual([])
  })

  it("should create a cell with correct properties for B13", () => {
    const cell = makeCell(1, 13, 108)
    
    expect(cell.id).toBe("b13")
    expect(cell.color).toBe("w")
    expect(cell.x).toBe(1)
    expect(cell.y).toBe(13)
    expect(cell.angle).toBe(108)
    expect(cell.piece).toBeNull()
    expect(cell.edges).toEqual([])
    expect(cell.vertices).toEqual([])
  })

  it("should create a cell with correct properties for B14", () => {
    const cell = makeCell(1, 14, 144)
    
    expect(cell.id).toBe("b14")
    expect(cell.color).toBe("b")
    expect(cell.x).toBe(1)
    expect(cell.y).toBe(14)
    expect(cell.angle).toBe(144)
    expect(cell.piece).toBeNull()
    expect(cell.edges).toEqual([])
    expect(cell.vertices).toEqual([])
  })

  it("should create a cell with correct properties for A40", () => {
    const cell = makeCell(2, 40, 288)
    
    expect(cell.id).toBe("a40")
    expect(cell.color).toBe("b")
    expect(cell.x).toBe(2)
    expect(cell.y).toBe(40)
    expect(cell.angle).toBe(288)
    expect(cell.piece).toBeNull()
    expect(cell.edges).toEqual([])
    expect(cell.vertices).toEqual([])
  })

  it("should create a cell with correct properties for A20", () => {
    const cell = makeCell(2, 20, 144)
    
    expect(cell.id).toBe("a20")
    expect(cell.color).toBe("b")
    expect(cell.x).toBe(2)
    expect(cell.y).toBe(20)
    expect(cell.angle).toBe(144)
    expect(cell.piece).toBeNull()
    expect(cell.edges).toEqual([])
    expect(cell.vertices).toEqual([])
  })

  it("should clone a cell A5 correctly", () => {
    const original = makeCell(0, 5, 180)
    original.piece = makePiece("pawn-cw", "w")
    original.edges = [[0, 6], [0, 4], [1, 18]]
    original.vertices = [[0, 7], [0, 8], [0, 9], [0, 0], [0, 1], [0, 2], [1, 15], [1, 16], [1, 17], [1, 19], [1, 20], [1, 21]]
    
    const cloned = cloneCell(original)
    
    expect(cloned).not.toBe(original) // Different reference
    expect(cloned.id).toBe(original.id)
    expect(cloned.color).toBe(original.color)
    expect(cloned.piece).toEqual(original.piece)
    expect(cloned.edges).toEqual(original.edges)
    expect(cloned.vertices).toEqual(original.vertices)
    
    for (let i = 0; i < original.edges.length; i++) {
      expect(cloned.edges[i]).toEqual(original.edges[i])
    }
    for (let i = 0; i < original.vertices.length; i++) {
      expect(cloned.vertices[i]).toEqual(original.vertices[i])
    }
  })
  
  it("should clone a cell B10 correctly", () => {
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
    
    for (let i = 0; i < original.edges.length; i++) {
      expect(cloned.edges[i]).toEqual(original.edges[i])
    }
    for (let i = 0; i < original.vertices.length; i++) {
      expect(cloned.vertices[i]).toEqual(original.vertices[i])
    }
  })

  it("should clone a cell C20 correctly", () => {
    const original = makeCell(2, 20, 144)
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
    
    for (let i = 0; i < original.edges.length; i++) {
      expect(cloned.edges[i]).toEqual(original.edges[i])
    }
    for (let i = 0; i < original.vertices.length; i++) {
      expect(cloned.vertices[i]).toEqual(original.vertices[i])
    }
  })

  it("should generate correct cell IDs", () => {
    expect(cellId(0, 5)).toBe("c5")
    expect(cellId(1, 15)).toBe("b15")
    expect(cellId(2, 30)).toBe("a30")
    expect(cellId(0, 9)).toBe("c9")
    expect(cellId(1, 1)).toBe("b1")
    expect(cellId(2, 3)).toBe("a3")
    expect(cellId(2, 20)).toBe("a20")
  })

  it("should get clockwise edges for cell A20", () => {
    const board = initializeBoard()
    const cell = board[0][0]

    const cwEdge = getCWEdge(cell, board)

    expect(cwEdge).not.toBeNull()
  
    expect(cwEdge.id).not.toBe(cell.id)
  })

  it("should get clockwise edges for cell B10", () => {
    const board = initializeBoard()
    const cell = board[1][10]

    const cwEdge = getCWEdge(cell, board)

    expect(cwEdge).not.toBeNull()
  
    expect(cwEdge.id).not.toBe(cell.id)
  })

  it("should get clockwise edges for cell C30", () => {
    const board = initializeBoard()
    const cell = board[2][30]

    const cwEdge = getCWEdge(cell, board)

    expect(cwEdge).not.toBeNull()
  
    expect(cwEdge.id).not.toBe(cell.id)
  })

  it("should get counter-clockwise edges for cell A20", () => {
    const board = initializeBoard()
    const cell = board[0][0]

    const ccwEdge = getCCWEdge(cell, board)

    expect(ccwEdge).not.toBeNull()
    
    expect(ccwEdge.id).not.toBe(cell.id)
  })

  it("should get counter-clockwise edges for cell B10", () => {
    const board = initializeBoard()
    const cell = board[1][10]

    const ccwEdge = getCCWEdge(cell, board)

    expect(ccwEdge).not.toBeNull()
    
    expect(ccwEdge.id).not.toBe(cell.id)
  })

  it("should get counter-clockwise edges for cell C30", () => {
    const board = initializeBoard()
    const cell = board[2][30]

    const ccwEdge = getCCWEdge(cell, board)

    expect(ccwEdge).not.toBeNull()
    
    expect(ccwEdge.id).not.toBe(cell.id)
  })
})

describe("Board Utility Functions", () => {
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
