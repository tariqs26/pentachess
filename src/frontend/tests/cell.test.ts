import { describe, expect, it } from "vitest"
import {
  makeCell,
  cloneCell,
  cellId,
  getCWEdge,
  getCCWEdge,
  getSideEdge,
  setCellEdges,
  setCellVertices,
} from "@/features/board/cell"
import { initializeBoard } from "@/features/board/utils"
import { makePiece } from "@/features/piece/utils"
import { Board } from "@/features/board/types"

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
    original.edges = [
      [0, 6],
      [0, 4],
      [1, 18],
    ]
    original.vertices = [
      [0, 7],
      [0, 8],
      [0, 9],
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 15],
      [1, 16],
      [1, 17],
      [1, 19],
      [1, 20],
      [1, 21],
    ]

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
    original.edges = [
      [1, 11],
      [1, 9],
    ]
    original.vertices = [
      [0, 3],
      [0, 4],
    ]

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
    original.edges = [
      [1, 11],
      [1, 9],
    ]
    original.vertices = [
      [0, 3],
      [0, 4],
    ]

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

  it("should get side edges for cell A2", () => {
    const board = initializeBoard()
    const cell = board[2][2]
    const correctSideEdge = board[1][1]

    const sideEdge = getSideEdge(cell, board)

    expect(sideEdge).not.toBeNull()

    expect(sideEdge.id).toBe(correctSideEdge.id)
  })

  it("should get side edges for cell B1", () => {
    const board = initializeBoard()
    const cell = board[1][1]
    const correctSideEdge = board[2][2]

    const sideEdge = getSideEdge(cell, board)

    expect(sideEdge).not.toBeNull()

    expect(sideEdge.id).toBe(correctSideEdge.id)
  })

  it("should get side edges for cell C4", () => {
    const board = initializeBoard()
    const cell = board[0][4]
    const correctSideEdge = board[1][15]

    const sideEdge = getSideEdge(cell, board)

    expect(sideEdge).not.toBeNull()

    expect(sideEdge.id).toBe(correctSideEdge.id)
  })

  it("should set cell edges correctly", () => {
    const correctBoard = initializeBoard()
    const board: Board = [[], [], []]

    for (let ring = 0; ring < correctBoard.length; ring++) {
      for (let cell = 0; cell < correctBoard[ring].length; cell++) {
        const newCell = makeCell(ring, cell, 0)
        setCellEdges(newCell)
        board[ring].push(newCell)
      }
    }

    for (let ring = 0; ring < correctBoard.length; ring++) {
      for (let cell = 0; cell < correctBoard[ring].length; cell++) {
        expect(board[ring][cell].edges).toEqual(correctBoard[ring][cell].edges)
      }
    }
  })

  it("should set cell vertices correctly", () => {
    const correctBoard = initializeBoard()
    const board: Board = [[], [], []]

    for (let ring = 0; ring < correctBoard.length; ring++) {
      for (let cell = 0; cell < correctBoard[ring].length; cell++) {
        const newCell = makeCell(ring, cell, 0)
        setCellEdges(newCell)
        board[ring].push(newCell)
      }
    }

    for (let ring = 0; ring < correctBoard.length; ring++) {
      for (let cell = 0; cell < correctBoard[ring].length; cell++) {
        setCellVertices(board[ring][cell], board)
      }
    }

    for (let ring = 0; ring < correctBoard.length; ring++) {
      for (let cell = 0; cell < correctBoard[ring].length; cell++) {
        expect(board[ring][cell].vertices).toEqual(
          correctBoard[ring][cell].vertices
        )
      }
    }
  })
})
