import { Cell } from "../board/types"
import { Piece, PieceColor } from "../piece/types"
import { Move } from "./types"

export const getMove = (
  from: Cell,
  to: Cell,
  piece: Piece,
  player: PieceColor,
  piecePromoted: Piece | null
): Move => {
  const pieceAbrev = piece.abbr
  const fromPosition = from.id.toLowerCase()
  const toPosition = to.id.toLowerCase()
  const moveType = to.piece ? "x" : "-"
  const promotion = piecePromoted ? `=${piecePromoted.abbr}` : ""
  const kingInCheck = "" // TODO: implement check
  const checkmate = "" // TODO: implement checkmate
  const notation = `${pieceAbrev}:${fromPosition}${moveType}${toPosition}${kingInCheck}${checkmate}${promotion}`

  return {
    player,
    from,
    to,
    piece,
    pieceCaptured: to.piece,
    check: false,
    checkmate: false,
    piecePromoted: null,
    notation,
    timestamp: new Date(),
  }
}

export const displayTimeRemaining = (timeInSeconds: number) => {
  if (timeInSeconds <= 0) {
    return "00:00"
  }

  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}
