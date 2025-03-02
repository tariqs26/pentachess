 "use client"

import { createContext, useReducer, useContext } from "react"
import { multiplayerGameReducer, createInitialMultiplayerState } from "../MultiplayerGameReducer"
import type { MultiplayerGameState, MultiplayerGameAction } from "../types"

type MultiplayerGameContextType = {
  state: MultiplayerGameState
  dispatch: React.Dispatch<MultiplayerGameAction>
}

const MultiplayerGameContext = createContext<MultiplayerGameContextType | null>(null)

export const MultiplayerGameProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(multiplayerGameReducer, createInitialMultiplayerState())

  return (
    <MultiplayerGameContext.Provider value={{ state, dispatch }}>
      {children}
    </MultiplayerGameContext.Provider>
  )
}

export function useMultiplayerGame() {
  const context = useContext(MultiplayerGameContext)

  if (context === null) {
    throw new Error("useMultiplayerGame must be used within a MultiplayerGameProvider")
  }

  return context
}