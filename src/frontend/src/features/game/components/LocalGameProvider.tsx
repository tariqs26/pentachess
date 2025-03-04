"use client"

import { createContext, useReducer } from "react"
import { localGameReducer } from "../reducer"
import type { LocalGameAction, LocalGameState } from "../types"
import { createLocalGameState } from "../utils"

type LocalGameContextType = {
  state: LocalGameState
  dispatch: React.Dispatch<LocalGameAction>
}

const initialState = createLocalGameState()

export const LocalGameContext = createContext<LocalGameContextType | null>(null)

export const LocalGameProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(localGameReducer, initialState)

  return (
    <LocalGameContext.Provider value={{ state, dispatch }}>
      {children}
    </LocalGameContext.Provider>
  )
}
