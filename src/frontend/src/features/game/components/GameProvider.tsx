"use client"

import { createContext, useReducer } from "react"
import { gameReducer } from "../reducer"
import type { GameAction, GameState } from "../types"
import { createGameState } from "../utils"

type GameContextType = {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

const initialState = createGameState()

export const GameContext = createContext<GameContextType | null>(null)

export const GameProvider = (
  props: React.PropsWithChildren<{ initialState?: GameState }>
) => {
  const [state, dispatch] = useReducer(
    gameReducer,
    props.initialState ?? initialState
  )

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {props.children}
    </GameContext.Provider>
  )
}
