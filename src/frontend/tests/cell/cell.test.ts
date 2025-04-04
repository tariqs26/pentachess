import { beforeEach, describe, expect, it } from "vitest"

import {
  cellId,
  cloneCell,
  createCell,
  getCCWEdge,
  getCWEdge,
  getSideEdge,
  setCellEdges,
  setCellVertices,
} from "@/features/board/cell"
import type { Board } from "@/features/board/types"
import { createBoard } from "@/features/board/utils"
import { createPiece } from "@/features/piece/utils"

import { CELL_TEST_CASES } from "./constants"

describe("Cell Utility Functions", () => {
  // Cell creation and manipulation tests
  describe("createCell", () => {
    CELL_TEST_CASES.forEach(({ ring, cell, angle, id, color }) => {
      it(`should create a cell with correct properties for ${id}`, () => {
        const result = createCell(ring, cell, angle)

        expect(result.id).toBe(id)
        expect(result.color).toBe(color)
        expect(result.x).toBe(ring)
        expect(result.y).toBe(cell)
        expect(result.angle).toBe(angle)
        expect(result.piece).toBeNull()
        expect(result.edges).toEqual([])
        expect(result.vertices).toEqual([])
      })
    })
  })

  describe("cloneCell", () => {
    CELL_TEST_CASES.forEach(({ id, ring, cell, angle, color }) => {
      it(`should clone cell ${id} correctly`, () => {
        const original = createCell(ring, cell, angle)
        original.piece = createPiece("pawn-cw", color)
        original.edges = [
          [0, 1],
          [0, 2],
        ]
        original.vertices = [
          [0, 1],
          [0, 2],
        ]

        const cloned = cloneCell(original)

        expect(cloned).not.toBe(original) // Different reference
        expect(cloned.id).toBe(original.id)
        expect(cloned.color).toBe(original.color)
        expect(cloned.piece).toEqual(original.piece)
        expect(cloned.edges).toEqual(original.edges)
        expect(cloned.vertices).toEqual(original.vertices)
      })
    })
  })

  describe("cellId", () => {
    it("should generate correct cell IDs", () => {
      const testCases = [
        { ring: 0, cell: 5, expected: "c5" },
        { ring: 1, cell: 15, expected: "b15" },
        { ring: 2, cell: 30, expected: "a30" },
        { ring: 0, cell: 9, expected: "c9" },
        { ring: 1, cell: 1, expected: "b1" },
        { ring: 2, cell: 3, expected: "a3" },
        { ring: 2, cell: 20, expected: "a20" },
      ]

      testCases.forEach(({ ring, cell, expected }) => {
        expect(cellId(ring, cell)).toBe(expected)
      })
    })
  })

  // Edge and vertex-related tests
  describe("Edge and Vertex Operations", () => {
    let board: Board

    beforeEach(() => {
      board = createBoard()
    })

    describe("getCWEdge", () => {
      const testCases = [
        { id: "a20", x: 0, y: 0 },
        { id: "b10", x: 1, y: 10 },
        { id: "c30", x: 2, y: 30 },
      ]

      testCases.forEach(({ id, x, y }) => {
        it(`should get clockwise edge for cell ${id}`, () => {
          const cell = board[x][y]

          const cwEdge = getCWEdge(cell, board)

          expect(cwEdge).not.toBeNull()
          expect(cwEdge.id).not.toBe(cell.id)
        })
      })
    })

    describe("getCCWEdge", () => {
      const testCases = [
        { id: "a20", x: 0, y: 0 },
        { id: "b10", x: 1, y: 10 },
        { id: "c30", x: 2, y: 30 },
      ]

      testCases.forEach(({ id, x, y }) => {
        it(`should get counter-clockwise edge for cell ${id}`, () => {
          const cell = board[x][y]
          const ccwEdge = getCCWEdge(cell, board)

          expect(ccwEdge).not.toBeNull()
          expect(ccwEdge.id).not.toBe(cell.id)
        })
      })
    })

    describe("getSideEdge", () => {
      const testCases = [
        { id: "a2", cellCoords: [2, 2], edgeCoords: [1, 1] },
        { id: "b1", cellCoords: [1, 1], edgeCoords: [2, 2] },
        { id: "c4", cellCoords: [0, 4], edgeCoords: [1, 15] },
      ]

      testCases.forEach(({ id, cellCoords, edgeCoords }) => {
        it(`should get correct side edge for cell ${id}`, () => {
          const cell = board[cellCoords[0]][cellCoords[1]]
          const expectedEdge = board[edgeCoords[0]][edgeCoords[1]]
          const sideEdge = getSideEdge(cell, board)

          expect(sideEdge).not.toBeNull()
          expect(sideEdge.id).toBe(expectedEdge.id)
        })
      })
    })

    describe("setCellEdges and setCellVertices", () => {
      it("should set cell edges correctly", () => {
        const correctBoard = createBoard()
        const testBoard: Board = [[], [], []]

        // Create cells with edges
        for (let ring = 0; ring < correctBoard.length; ring++) {
          for (let cell = 0; cell < correctBoard[ring].length; cell++) {
            const newCell = createCell(ring, cell, 0)
            setCellEdges(newCell)
            testBoard[ring].push(newCell)
          }
        }

        // Verify edges
        for (let ring = 0; ring < correctBoard.length; ring++) {
          for (let cell = 0; cell < correctBoard[ring].length; cell++) {
            expect(testBoard[ring][cell].edges).toEqual(
              correctBoard[ring][cell].edges
            )
          }
        }
      })

      it("should set cell vertices correctly", () => {
        const correctBoard = createBoard()
        const testBoard: Board = [[], [], []]

        // Create cells with edges
        for (let ring = 0; ring < correctBoard.length; ring++) {
          for (let cell = 0; cell < correctBoard[ring].length; cell++) {
            const newCell = createCell(ring, cell, 0)
            setCellEdges(newCell)
            testBoard[ring].push(newCell)
          }
        }

        // Set vertices
        for (let ring = 0; ring < correctBoard.length; ring++) {
          for (let cell = 0; cell < correctBoard[ring].length; cell++) {
            setCellVertices(testBoard[ring][cell], testBoard)
          }
        }

        // Verify vertices
        for (let ring = 0; ring < correctBoard.length; ring++) {
          for (let cell = 0; cell < correctBoard[ring].length; cell++) {
            expect(testBoard[ring][cell].vertices).toEqual(
              correctBoard[ring][cell].vertices
            )
          }
        }
      })
    })
  })
})
