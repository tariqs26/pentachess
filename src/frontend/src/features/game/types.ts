import type { BoardAction, BoardState, Cell } from "../board/types"
import type { Piece, PieceColor } from "../piece/types"

export type Player = {
  id: string
  color: PieceColor
}

// Shared types between local and multiplayer
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
  | "draw-insufficient"
  | "resignation"
  | "time-expired"

// Local Game Types
export type LocalGameState = {
  player: PieceColor
  opponent: PieceColor
  winner?: PieceColor | "draw"
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
  | { type: "START_GAME"; duration?: number }
  | { type: "SET_STATUS"; status: GameStatus }
  | { type: "PROMOTE_PAWN"; piece: Piece }
  | { type: "DECREMENT_TIMER"; player: PieceColor }
  | { type: "SET_WINNER"; player: PieceColor }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" }
  | BoardAction

export type MultiplayerGameState = Omit<LocalGameState, 'player' | 'opponent'> & {
  id: string
  player: Player
  opponent: Player
}

export type MultiplayerGameAction =
  | { type: "GAME_JOIN"; payload: Player }
  | { type: "GAME_START"; payload: MultiplayerGameState }
  | { type: "GAME_END"; payload: MultiplayerGameState }
  | LocalGameAction // Reuse local game actions where possible
