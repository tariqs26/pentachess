import { initializeBoard } from "../board/utils"
import type { LocalGameState } from "./types"

export const INITIAL_STATE: LocalGameState = {
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
} as const
