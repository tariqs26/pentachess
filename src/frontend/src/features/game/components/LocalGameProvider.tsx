"use client"

import { type Dispatch, createContext, useReducer } from "react"
import { initializeBoard } from "@/features/board/utils"
import Image from "next/image"
import { localGameReducer } from "../reducer"
import type { LocalGameAction, LocalGameState } from "../types"
import { Piece } from "@/features/piece/types"

const initialState: LocalGameState = {
  player: "w",
  opponent: "b",
  turn: "w",
  check: null,
  timer: { w: 0, b: 0 },
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

export const CapturedPieces = ({ pieces }: { pieces: Piece[] }) => (
  <div className="flex h-[48px] items-center rounded-lg border border-black bg-[#27B559] p-2 shadow-md shadow-white">
    {pieces.map((piece, i) => (
      <Image
        key={i}
        src={piece.image}
        alt={piece.type}
        className="mr-[-1.2px] size-8"
      />
    ))}
  </div>
)
