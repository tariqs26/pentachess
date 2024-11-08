import { DECAGON_SIDES, RING_SIZES } from "./constants"
import type { Board, Cell } from "./types"

// TODO
export const generateInitialBoard = (): Board => {
  const board: Board = []

  for (let i = 0; i < RING_SIZES.length; i++) {
    const size = RING_SIZES[i]
    const ring: Cell[] = []

    for (let j = 0; j < size; j++) {
      const cell: Cell = {
        id: `${i === 0 ? "A" : i === 1 ? "B" : "C"}${j + 1}`,
        colour: j % 2 === 0 ? "white" : "black",
        side: Math.floor(j / (size / DECAGON_SIDES)) + 1,
        adjacent: {
          prev: ring[j > 0 ? j - 1 : size - 1],
          next: ring[j < size - 1 ? j + 1 : 0],
          in: null,
          out: null,
        },
        vertices: {
          in: [],
          out: [],
        },
        piece: null,
      }

      ring.push(cell)
    }

    board.push(ring)
  }

  return board
}

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
