import { DECAGON_SIDES, RING_SIZES } from "./constants"
import type { Board, Cell } from "./types"
import { PIECE_POSITIONS } from "../piece/constants"
import { makePiece } from "../piece/utils"
import { PieceColour, PieceType } from "../piece/types"

// TODO: Demo MVP (adjacent in/out, vertices in/out)
export const generateInitialBoard = (): Board => {
  const board: Board = []

  for (let i = 0; i < RING_SIZES.length; i++) {
    const size = RING_SIZES[i]
    const ring: Cell[] = []

    for (let j = 0; j < size; j++) {
      const cell: Omit<Cell, "adjacent"> = {
        id: `${i === 2 ? "A" : i === 1 ? "B" : "C"}${j + 1}`,
        position: { i, j },
        colour: (j % 2 === 0 ? "white" : "black") as Cell["colour"],
        side: Math.floor(j / (size / DECAGON_SIDES)) + 1,
        piece: null,
        vertices: { in: [], out: [] },
      }

      ring.push(cell as Cell)
    }

    // assign adjacent cells
    for (const cell of ring) {
      cell.adjacent = {
        prev: ring[(cell.position.j - 1 + size) % size],
        next: ring[(cell.position.j + 1) % size],
        in: null,
        out: null,
      }
    }

    board.push(ring)
  }

  // assign pieces to cells
  Object.entries(PIECE_POSITIONS).forEach(([type, colours]) => {
    Object.entries(colours).forEach(([colour, positions]) => {
      positions.forEach((position) => {
        board[position.i][position.j].piece = makePiece(
          type as PieceType,
          colour as PieceColour
        )
      })
    })
  })

  return board
}

export const getSides = <T>(arr: T[], size: number) =>
  arr.reduce((acc: T[][], _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size))
    return acc
  }, [])

// TODO
export const checkForCheck = (board: Board): boolean => {
  console.info(board)
  return false
}

// TODO
export const checkForStalemate = (board: Board): boolean => {
  console.info(board)
  return false
}

// TODO
export const checkForCheckmate = (board: Board): boolean => {
  console.info(board)
  return false
}
