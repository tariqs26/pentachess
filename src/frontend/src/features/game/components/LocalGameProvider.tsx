import { type Dispatch, createContext, useReducer } from "react"
import { localGameReducer } from "../reducer"
import type { LocalGameAction, LocalGameState } from "../types"

const initialState: LocalGameState = {
  player: "white",
  opponent: "black",
  turn: "white",
  check: null,
  status: "playing",
  timer: { white: 15, black: 15 },
  previousMoves: [],
  capturedPieces: { white: [], black: [] },
  boardState: {
    disabled: false,
    board: [],
    selectedCell: null,
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
