import type { BoardAction, BoardState, Cell } from "../board/types"
import type { Piece, PieceColor } from "../piece/types"

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

// Multiplayer Types
export type MultiplayerPlayer = {
  id: string
  name: string
  color: PieceColor
  timeRemaining: number
}

export type MultiplayerGameState = Omit<LocalGameState, 'player' | 'opponent'> & {
  id: string
  players: MultiplayerPlayer[]
  currentPlayerId?: string // The current player's ID in the multiplayer game
  drawOffer?: string // ID of player who offered draw
}

export type MultiplayerGameAction =
  | { type: "GAME_JOIN"; payload: MultiplayerPlayer }
  | { type: "GAME_START"; payload: MultiplayerGameState }
  | { type: "MOVE_MADE"; payload: Move }
  | { type: "TIMER_UPDATE"; payload: Record<string, number> }
  | { type: "DRAW_OFFER"; payload: { playerId: string } }
  | { type: "DRAW_RESPONSE"; payload: { accepted: boolean } }
  | LocalGameAction // Reuse local game actions where possible
