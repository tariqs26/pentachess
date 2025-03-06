"use client"

import { createContext, useReducer } from "react"
import { localGameReducer } from "../localGameReducer"
import type { LocalGameAction, LocalGameState } from "../types"
import { createNewLocalGameState } from "../utils"

type LocalGameContextType = {
  state: LocalGameState
  dispatch: React.Dispatch<LocalGameAction>
}

const initialState = createNewLocalGameState()

export const LocalGameContext = createContext<LocalGameContextType | null>(null)

export const LocalGameProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(localGameReducer, initialState)

  return (
    <LocalGameContext.Provider value={{ state, dispatch }}>
      {children}
    </LocalGameContext.Provider>
  )
}
