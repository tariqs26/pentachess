import type { Cell } from "../board/types"
import { initializeBoard } from "../board/utils"
import type { Piece, PieceColor } from "../piece/types"
import type { GameStatus, LocalGameState, Move } from "./types"

export const createNewGameState = (): LocalGameState => ({
  player: "w",
  opponent: "b",
  turn: "w",
  check: null,
  status: "waiting",
  boardState: {
    disabled: false,
    board: initializeBoard(),
    selectedCell: null,
    overCell: null,
  },
  timer: { w: 0, b: 0 },
  previousMoves: [],
  capturedPieces: { w: [], b: [] },
})

export const getMove = (
  player: PieceColor,
  from: Cell,
  to: Cell,
  piece: Piece,
  piecePromoted: Piece | null,
  check: PieceColor | null,
  status: GameStatus
): Move => {
  const fromId = from.id.toLowerCase()
  const toId = to.id.toLowerCase()
  const moveType = to.piece ? "x" : "-"
  const promotion = piecePromoted ? `=${piecePromoted.abbr}` : ""
  const postfix =
    status === "checkmate"
      ? "#"
      : status.startsWith("draw")
        ? "$"
        : check
          ? "+"
          : ""
  const notation = `${piece.abbr}:${fromId}${moveType}${toId}${promotion}${postfix}`

  return {
    player,
    from,
    to,
    piece,
    pieceCaptured: to.piece,
    piecePromoted,
    check: check !== null,
    status,
    notation,
    timestamp: new Date(),
  }
}

export const displayTimeRemaining = (timeInSeconds: number) => {
  if (timeInSeconds <= 0) {
    return "00:00"
  }

  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export const isGameOver = (status: GameStatus) =>
  status === "checkmate" ||
  status.startsWith("draw") ||
  status === "resignation" ||
  status === "time-expired"
