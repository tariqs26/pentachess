import type { Cell } from "../board/types"
import type { Piece, PieceColor } from "../piece/types"
import type { Move } from "./types"

export const getMove = (
  from: Cell,
  to: Cell,
  piece: Piece,
  player: PieceColor,
  piecePromoted: Piece | null
): Move => {
  const fromId = from.id.toLowerCase()
  const toId = to.id.toLowerCase()
  const moveType = to.piece ? "x" : "-"
  const promotion = piecePromoted ? `=${piecePromoted.abbr}` : ""
  const check = "" // TODO: implement check
  const checkmate = "" // TODO: implement checkmate
  const notation = `${piece.abbr}:${fromId}${moveType}${toId}${promotion}${check}${checkmate}`

  return {
    player,
    from,
    to,
    piece,
    pieceCaptured: to.piece,
    piecePromoted,
    check: false,
    checkmate: false,
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
