import type { BoardState, BoardAction } from "../board/types"
import type { Cell } from "../board/cell"
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
  previousMoves: Move[]
  capturedPieces: Record<PieceColor, Piece[]>
  check: PieceColor | null
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
      payload: { player: PieceColor; move: Move }
    }
  | BoardAction
