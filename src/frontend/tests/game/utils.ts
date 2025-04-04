import { makeCell } from "@/features/board/cell"
import type { Cell } from "@/features/board/types"
import { gameReducer } from "@/features/game/reducer"
import type { GameAction, GameState, Player } from "@/features/game/types"
import { createGameState } from "@/features/game/utils"
import type { Piece } from "@/features/piece/types"
import { makePiece } from "@/features/piece/utils"

export const createTestMove = (from: Cell, to: Cell, piece: Piece) => ({
  from,
  to,
  piece,
  piecePromoted: null,
})

export const createTestPlayers = (): [Player, Player] => [
  { id: "1", color: "w", userId: "1", username: "Test Player 1" },
  { id: "2", color: "b", userId: "2", username: "Test Player 2" },
]

export const mockDispatch = (
  action: GameAction,
  state: GameState = createGameState()
) => {
  const dispatch = (action: GameAction) => gameReducer(state, action)
  dispatch(action)
}

export const createPromotionState = (): GameState => {
  const initialState = createGameState()
  const to = makeCell(0, 0, 0)
  const from = makeCell(0, 0, 0)

  const promotionState = {
    ...initialState,
    promotionCoordinates: {
      from,
      to,
      piece: makePiece("pawn-ccw", "w"),
    },
  }

  return promotionState
}
