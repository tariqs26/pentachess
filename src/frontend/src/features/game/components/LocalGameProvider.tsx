"use client"

import { createContext, useReducer } from "react"
import { INITIAL_STATE } from "../constants"
import { localGameReducer } from "../reducer"
import type { LocalGameAction, LocalGameState } from "../types"

type LocalGameContextType = {
  state: LocalGameState
  dispatch: React.Dispatch<LocalGameAction>
}

export const LocalGameContext = createContext<LocalGameContextType | null>(null)

export const LocalGameProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(localGameReducer, INITIAL_STATE)

  return (
    <LocalGameContext.Provider value={{ state, dispatch }}>
      {children}
    </LocalGameContext.Provider>
  )
}
