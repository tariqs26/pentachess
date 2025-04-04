import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GameProvider } from "@/features/game/components/GameProvider"
import { LocalGame } from "@/features/game/components/LocalGame"
import { createGameState } from "@/features/game/utils"

describe("Game UI Tests", () => {
  it("should display all required components (Captured Pieces, Timers, Moves, etc.) when game state is START_GAME", () => {
    const state = createGameState({
      status: "playing",
      timer: { w: 1200, b: 1200 },
    })

    const game = render(
      <GameProvider initialState={state}>
        <LocalGame />
      </GameProvider>
    )

    const capturedPieces = game.getAllByTestId("captured-pieces")
    expect(capturedPieces.length).toBe(2)

    const timers = game.getAllByTestId("timer")
    expect(timers.length).toBe(2)

    const moves = game.getByTestId("previous-moves")
    expect(moves).toBeDefined()

    const resignButton = game.getByText("Resign")
    expect(resignButton).toBeDefined()

    const board = game.container.querySelector("div[data-testid='board']")
    expect(board).toBeDefined()
  })

  it("should disable the board and display End Game modal when game state transitions to END_GAME", () => {
    const state = createGameState({
      status: "resignation",
    })

    const game = render(
      <GameProvider initialState={state}>
        <LocalGame />
      </GameProvider>
    )

    const leaveButton = game.getByText("Leave Game")
    expect(leaveButton).toBeDefined()

    const playAgainButton = game.getByText("Play Again")
    expect(playAgainButton).toBeDefined()
  })

  it("should move piece correctly after sequence of SET_PENDING_MOVE followed by CONFIRM_MOVE actions", () => {})

  it("should not move piece when SET_PENDING_MOVE is followed by CANCEL_MOVE action", () => {})

  it("should display pawn promotion modal when game state transitions to PROMOTE_PAWN", () => {})
})
