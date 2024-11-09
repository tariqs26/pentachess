import { DECAGON_SIDES, RING_SIZES } from "./constants"
import type { Board } from "./types"

// TODO
export const generateInitialBoard = (): Board => {
  const board: Board = []

  for (let i = 0; i < RING_SIZES.length; i++) {
    const size = RING_SIZES[i]
    const ring = []

    for (let j = 0; j < size; j++) {
      const cell = {
        id: `${i === 0 ? "A" : i === 1 ? "B" : "C"}${j + 1}`,
        colour: j % 2 === 0 ? "white" : "black",
        side: Math.floor(j / (size / DECAGON_SIDES)) + 1,
        piece: null,
      }

      ring.push(cell)
    }
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
