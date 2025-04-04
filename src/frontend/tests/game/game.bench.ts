import { bench, describe } from "vitest"
import { createPiece } from "@/features/piece/utils"
import { TEST_PLAYERS } from "./constants"
import { createPromotionState, mockDispatch } from "./utils"

describe("Game", () => {
  const [player, opponent] = TEST_PLAYERS
  const duration = 10

  bench("START_GAME", () => {
    mockDispatch({
      type: "START_GAME",
      duration,
      players: [player, opponent],
    })
  })
})

describe("Game", () => {
  const state = createPromotionState()

  bench("PROMOTE_PAWN", () => {
    mockDispatch(
      { type: "PROMOTE_PAWN", piece: createPiece("pawn-ccw", "w") },
      state
    )
  })
})

describe("Game", () => {
  bench("END_GAME", () => {
    mockDispatch({ type: "END_GAME" })
  })
})

describe("Game", () => {
  bench("SYNC_GAME", () => {
    mockDispatch({ type: "SYNC_GAME", state: createPromotionState() })
  })
})

describe("Game", () => {
  bench("RESET_GAME", () => {
    mockDispatch({ type: "RESET_GAME" })
  })
})
