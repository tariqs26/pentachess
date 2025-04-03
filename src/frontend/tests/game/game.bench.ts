import { bench, describe } from "vitest"
import { makePiece } from "@/features/piece/utils"
import { createPromotionState, createTestPlayers, mockDispatch } from "./utils"

describe("Game", () => {
  const [player, opponent] = createTestPlayers()
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
      { type: "PROMOTE_PAWN", piece: makePiece("pawn-ccw", "w") },
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
  bench("RESET_GAME", () => {
    mockDispatch({ type: "RESET_GAME" })
  })
})
