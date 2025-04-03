import { bench, describe } from "vitest"
import { makeCell } from "@/features/board/cell"
import { cloneBoard, initializeBoard } from "@/features/board/utils"
import { makePiece } from "@/features/piece/utils"
import { mockDispatch } from "../game/utils"

describe("Board", () => {
  bench("initializeBoard", () => {
    initializeBoard()
  })
})

describe("Board", () => {
  const board = initializeBoard(false)
  bench("cloneBoard", () => {
    cloneBoard(board)
  })
})

describe("Board", () => {
  const cell = makeCell(0, 0, 0)

  bench("SET_SELECTED_CELL", () => {
    mockDispatch({ type: "SET_SELECTED_CELL", cell })
  })
})

describe("Board", () => {
  const board = initializeBoard(false)
  const from = board[1][29]
  const to = board[1][28]
  const piece = makePiece("berolina-pawn-cw", "w")

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
