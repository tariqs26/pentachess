import type { BoardAction, BoardState, Cell } from "../board/types"
import type { Piece, PieceColor, PieceType } from "../piece/types"

type Move = {
  notation: string
  timestamp: Date
  piece: PieceType
  from: Cell
  to: Cell
  pieceCaptured: PieceType | null
  piecePromoted: PieceType | null
  check: boolean
  checkmate: boolean
}

type GameStatus =
  | "waiting"
  | "playing"
  | "checkmate"
  | "stalemate"
  | "time-expired"
  | "resigned"

export type LocalGameState = {
  player: PieceColor
  opponent: PieceColor
  turn: PieceColor
  timer: Record<PieceColor, number>
  duration?: number
  previousMoves: Move[]
  capturedPieces: Record<PieceColor, Piece[]>
  check: PieceColor | null
  status: GameStatus
  boardState: BoardState
}

export type LocalGameAction =
  | {
      type: "START_GAME"
      payload?: number
    }
  | {
      type: "UPDATE_STATUS"
      payload: GameStatus
    }
  | {
      type: "ADD_MOVE"
      payload: { player: PieceColor; move: Move }
    }
  | {
      type: "SWITCH_TURN"
    }
  | BoardAction
