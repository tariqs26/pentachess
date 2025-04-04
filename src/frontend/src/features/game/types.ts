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
  | "checkmate"
  | "draw-stalemate"
  | "draw-agreement"
  | "draw-threefold"
  | "draw-fifty-move"
  | "draw-insufficient"
  | "resignation"
  | "time-expired"
  | "opponent-left"
  | "testing"

export type Player = {
  id: string
  userId: string
  username: string
  color: PieceColor
}

export type GameState = {
  player: Player
  opponent: Player
  winner?: PieceColor | "draw"
  turn: PieceColor
  timer?: Record<PieceColor, number>
  previousMoves: Move[]
  capturedPieces: Record<PieceColor, Piece[]>
  check: PieceColor | null
  status: GameStatus
  disabled: boolean
  boardState: BoardState
  promotionCoordinates?: { from: Cell; to: Cell; piece: Piece }
  testPiece?: Piece
}

export type SyncState = Omit<
  GameState,
  "player" | "opponent" | "promotionCoordinates"
>

export type GameAction =
  | { type: "START_GAME"; duration?: number; players?: [Player, Player] }
  | { type: "SET_STATUS"; status: GameStatus }
  | { type: "PROMOTE_PAWN"; piece: Piece }
  | { type: "DECREMENT_TIMER"; player: PieceColor }
  | { type: "SET_WINNER"; player: PieceColor }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" }
  | { type: "SYNC_GAME"; state: SyncState }
  | { type: "RESET_BOARD"; entire: boolean }
  | { type: "SET_PIECE"; move: { to: Cell } }
  | BoardAction
