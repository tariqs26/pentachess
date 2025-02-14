import type { BoardAction, BoardState, Cell } from "../board/types"
import type { Piece, PieceColor } from "../piece/types"

export type Move = {
  player: PieceColor
  notation: string
  timestamp: Date
  piece: Piece
  from: Cell
  to: Cell
  pieceCaptured: Piece | null
  piecePromoted: Piece | null
  check: boolean
  checkmate: boolean
}

type GameStatus =
  | "waiting"
  | "playing"
  | "promoting"
  | "checkmate"
  | "stalemate"
  | "time-expired"
  | "resigned"

export type LocalGameState = {
  player: PieceColor
  opponent: PieceColor
  turn: PieceColor
  timer: Record<PieceColor, number>
  previousMoves: Move[]
  capturedPieces: Record<PieceColor, Piece[]>
  check: PieceColor | null
  status: GameStatus
  boardState: BoardState
  promotionCoordinates?: { from: Cell; to: Cell; piece: Piece }
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
  | {
      type: "PROMOTE_PAWN"
      payload: Piece
    }
  | {
      type: "DECREMENT_TIMER"
      payload: PieceColor
    }
  | BoardAction
