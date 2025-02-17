import type { BoardAction, BoardState, Cell } from "../board/types"
import type { Piece, PieceColor } from "../piece/types"

export type Move = {
  player: PieceColor
  from: Cell
  to: Cell
  piece: Piece
  pieceCaptured: Piece | null
  piecePromoted: Piece | null
  check: boolean
  status: GameStatus
  notation: string
  timestamp: Date
}

export type GameStatus =
  | "waiting"
  | "playing"
  | "promoting"
  | "checkmate"
  | "draw-stalemate"
  | "draw-agreement"
  | "draw-threefold"
  | "draw-fifty-move"
  | "resignation"
  | "time-expired"

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
  | { type: "START_GAME"; payload?: number }
  | { type: "UPDATE_STATUS"; payload: GameStatus }
  | { type: "PROMOTE_PAWN"; payload: Piece }
  | { type: "DECREMENT_TIMER"; payload: PieceColor }
  | { type: "RESET_GAME" }
  | BoardAction
