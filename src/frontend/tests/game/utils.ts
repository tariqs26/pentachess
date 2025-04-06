import { createCell } from "@/features/board/cell"
import type { Cell } from "@/features/board/types"
import { gameReducer } from "@/features/game/reducer"
import type { GameAction, GameState } from "@/features/game/types"
import { createGameState } from "@/features/game/utils"
import type { Piece } from "@/features/piece/types"
import { createPiece } from "@/features/piece/utils"

export const createTestMove = (from: Cell, to: Cell, piece: Piece) => ({
  from,
  to,
  piece,
  piecePromoted: null,
})

export const mockDispatch = (
  action: GameAction,
  state: GameState = createGameState()
) => {
  const dispatch = (action: GameAction) => gameReducer(state, action)
  dispatch(action)
}

export const createPromotionState = () => {
  const initialState = createGameState()
  const to = createCell(0, 0, 0)
  const from = createCell(0, 0, 0)

  const promotionState = {
    ...initialState,
    promotionCoordinates: {
      from,
      to,
      piece: createPiece("pawn-ccw", "w"),
    },
  }

  return promotionState
}
