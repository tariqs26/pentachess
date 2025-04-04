import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GameProvider } from "@/features/game/components/GameProvider"
import { LocalGame } from "@/features/game/components/LocalGame"
import type { GameState } from "@/features/game/types"
import { createGameState } from "@/features/game/utils"
import { createPiece } from "@/features/piece/utils"
import { getCellContainer } from "../board/utils"

const renderGame = (state?: GameState) =>
  render(
    <GameProvider initialState={state}>
      <LocalGame />
    </GameProvider>
  )

describe("Game UI", () => {
  it("should display all required components (Captured Pieces, Timers, Moves, etc.) when the game is in progress", () => {
    const state = createGameState({
      status: "playing",
      timer: { w: 1200, b: 1200 },
    })

    const game = renderGame(state)

    expect(game.getAllByTestId("captured-pieces").length).toBe(2)
    expect(game.getAllByTestId("timer").length).toBe(2)
    expect(game.getByTestId("previous-moves")).toBeDefined()
    expect(game.getByText("Resign")).toBeDefined()
    expect(
      game.container.querySelector("div[data-testid='board']")
    ).toBeDefined()
  })

  it("should display game end modal when game is over", () => {
    const state = createGameState({ status: "resignation" })
    const game = renderGame(state)

    expect(game.getByText("Resignation")).toBeDefined()
    expect(game.getByText("Leave Game")).toBeDefined()
    expect(game.getByText("Play Again")).toBeDefined()
  })

  describe("Piece Movement", () => {
    it("should move piece correctly after confirming move", () => {
      const state = createGameState({ status: "playing" })
      const game = renderGame(state)

      fireEvent.click(getCellContainer("a0", game.container))
      fireEvent.click(getCellContainer("b28", game.container))
      fireEvent.click(game.getByTestId("confirm-move"))

      expect(state.boardState.board[2][0].piece).toBeNull()
      expect(state.boardState.board[1][28].piece).toHaveProperty(
        "type",
        "bishop"
      )
      expect(state.boardState.selectedCell).toBeUndefined()
      expect(state.boardState.pendingMove).toBeUndefined()
    })

    it("should not move piece when canceling move", () => {
      const state = createGameState({ status: "playing" })
      const game = renderGame(state)

      fireEvent.click(getCellContainer("a0", game.container))
      fireEvent.click(getCellContainer("b28", game.container))
      fireEvent.click(game.getByTestId("cancel-move"))

      expect(state.boardState.board[2][0].piece).toHaveProperty(
        "type",
        "bishop"
      )
      expect(state.boardState.board[1][28].piece).toBeNull()
    })
  })

  it("should display pawn promotion modal when pawn reaches promotion square", () => {
    const state = createGameState({ status: "playing" })

    const piece = createPiece("pawn-cw", "w")
    const from = state.boardState.board[1][19]
    const to = state.boardState.board[2][31]
    state.promotionCoordinates = { from, to, piece }
    
    const game = renderGame(state)

    expect(game.getByTestId("pawn-promotion-modal")).toBeDefined()
  })
})
