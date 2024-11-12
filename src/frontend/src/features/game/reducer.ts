import type { LocalGameAction, LocalGameState } from "./types"

export const localGameReducer = (
  state: LocalGameState,
  action: LocalGameAction
) => {
  switch (action.type) {
    default:
      return state
  }
}
