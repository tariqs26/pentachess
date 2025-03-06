"use client"

import { createContext, useReducer } from "react"
import { multiplayerGameReducer } from "../multiplayerGameReducer"
import type { MultiplayerGameAction, MultiplayerGameState } from "../types"
import { createNewMultiplayerGameState } from "../utils"

type MultiplayerGameContextType = {
  state: MultiplayerGameState
  dispatch: React.Dispatch<MultiplayerGameAction>
}

const initialState = createNewMultiplayerGameState()

export const MultiplayerGameContext = createContext<MultiplayerGameContextType | null>(null)

export const MultiplayerGameProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(multiplayerGameReducer, initialState)

  return (
    <MultiplayerGameContext.Provider value={{ state, dispatch }}>
      {children}
    </MultiplayerGameContext.Provider>
  )
}