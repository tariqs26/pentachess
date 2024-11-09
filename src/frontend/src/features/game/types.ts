import type { BoardState, BoardAction, Cell } from "../board/types"
import type { PieceColour, PieceType } from "../piece/types"

export type User = {
  id: string
  username: string
}

type Move = {
  notation: string
  timestamp: Date
  piece: PieceType
  from: Cell
  to: Cell
  pieceCaptured: PieceType | null
}

type GameStatus =
  | "playing"
  | "checkmate"
  | "stalemate"
  | "time-expired"
  | "resigned"

export type LocalGameState = {
  player: PieceColour
  opponent: PieceColour
  turn: PieceColour
  timer: Record<PieceColour, number>
  previousMoves: Move[]
  capturedPieces: Record<PieceColour, PieceType[]>
  check: PieceColour | null
  status: GameStatus
  boardState: BoardState
}

export type LocalGameAction =
  | {
      type: "UPDATE_STATUS"
      payload: GameStatus
    }
  | {
      type: "SWITCH_TURN"
    }
  | {
      type: "ADD_MOVE"
      payload: { player: PieceColour; move: Move }
    }
  | BoardAction
