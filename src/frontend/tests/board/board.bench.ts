import { bench, describe } from "vitest"
import { createCell } from "@/features/board/cell"
import { cloneBoard, createBoard } from "@/features/board/utils"
import { createPiece } from "@/features/piece/utils"
import { mockDispatch } from "../game/utils"

describe("Board", () => {
  bench("initializeBoard", () => {
    createBoard()
  })
})

describe("Board", () => {
  const board = createBoard(false)
  bench("cloneBoard", () => {
    cloneBoard(board)
  })
})

describe("Board", () => {
  const cell = createCell(0, 0, 0)

  bench("SET_SELECTED_CELL", () => {
    mockDispatch({ type: "SET_SELECTED_CELL", cell })
  })
})

describe("Board", () => {
  const board = createBoard(false)
  const from = board[1][29]
  const to = board[1][28]
  const piece = createPiece("berolina-pawn-cw", "w")

  const pendingMove = {
    from,
    to,
    piece,
    capturedPiece: to.piece,
  }

  bench("SET_PENDING_MOVE", () => {
    mockDispatch({ type: "SET_PENDING_MOVE", pendingMove })
  })
})

describe("Board", () => {
  bench("CANCEL_MOVE", () => {
    mockDispatch({ type: "CANCEL_MOVE" })
  })
})

describe("Board", () => {
  bench("CONFIRM_MOVE", () => {
    mockDispatch({ type: "CONFIRM_MOVE" })
  })
})
