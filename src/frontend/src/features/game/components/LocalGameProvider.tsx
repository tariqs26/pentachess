"use client"

import { type Dispatch, createContext, useReducer } from "react"
import { initializeBoard } from "@/features/board/utils"

import { localGameReducer } from "../reducer"
import type { LocalGameAction, LocalGameState } from "../types"

const initialState: LocalGameState = {
  player: "w",
  opponent: "b",
  turn: "w",
  check: null,
  status: "waiting",
  previousMoves: [],
  capturedPieces: { w: [], b: [] },
  boardState: {
    disabled: false,
    board: initializeBoard(),
    selectedCell: null,
    overCell: null,
  },
}

type LocalGameContextType = {
  state: LocalGameState
  dispatch: Dispatch<LocalGameAction>
}

export const LocalGameContext = createContext<LocalGameContextType | null>(null)

export const LocalGameProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(localGameReducer, initialState)

  return (
    <LocalGameContext.Provider value={{ state, dispatch }}>
      {children}
    </LocalGameContext.Provider>
  )
}
