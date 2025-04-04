import { bench, describe } from "vitest"
import { checkForCheckOrMate } from "@/features/board/utils"
import { getInvalidMoves, getPossibleMoves } from "@/features/piece/utils"
import { createBenchmarkBoard, createCheckmateBoard } from "./utils"

describe("Piece", () => {
  const board = createBenchmarkBoard()
  bench("getPossibleMoves", () => {
    getPossibleMoves(board[2][1], board)
  })
})

describe("Piece", () => {
  const board = createBenchmarkBoard()
  const kingCell = board[2][2]
  const possibleMoves = getPossibleMoves(kingCell, board)

  bench("getInvalidMoves", () => {
    getInvalidMoves(kingCell, board, possibleMoves)
  })
})

describe("Piece", () => {
  const board = createCheckmateBoard()
  bench("checkForCheckOrMate", () => {
    checkForCheckOrMate(board, "w", true)
  })
})
