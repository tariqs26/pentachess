import type { Board, Cell } from "../board/types"
import {
  checkForCheckOrMate,
  checkForStalemate,
  checkThreeMoveRep,
  initializeBoard,
} from "../board/utils"
import type { Piece, PieceColor } from "../piece/types"
import type { GameStatus, LocalGameState, Move } from "./types"

export const createLocalGameState = (): LocalGameState => ({
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

export const createMove = (
  player: PieceColor,
  from: Cell,
  to: Cell,
  piece: Piece,
  piecePromoted: Piece | null,
  check: PieceColor | null,
  status: GameStatus
): Move => {
  const moveType = to.piece ? "x" : "-"
  const promotion = piecePromoted ? `=${piecePromoted.abbr}` : ""
  const postfix = status === "checkmate" ? "#" : check ? "+" : ""
  const notation = `${piece.abbr}:${from.id}${moveType}${to.id}${promotion}${postfix}`

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

const checkFiftyMoveNoCap = (moves: { to: Cell; piece: Piece }[]) => {
  if (moves.length >= 50) {
    const lastFifty = moves.slice(-50)
    for (const { to, piece } of lastFifty) {
      if (piece.abbr === "P" || to.piece) return false
    }
    return true
  }
  return false
}

export const getNewStatus = (
  isCheckmate: boolean,
  board: Board,
  turn: PieceColor,
  moves: Move[],
  nextMove: Pick<Move, "from" | "to" | "piece" | "piecePromoted">
): GameStatus => {
  if (isCheckmate) return "checkmate"
  if (checkForStalemate(board, turn)) return "draw-stalemate"
  if (checkThreeMoveRep()) return "draw-threefold"
  if (
    checkFiftyMoveNoCap([...moves, { to: nextMove.to, piece: nextMove.piece }])
  )
    return "draw-fifty-move"
  return "playing"
}

export const moveHelper = (
  oldTurn: PieceColor,
  board: Board,
  previousMoves: Move[],
  promotionCoordinates: { from: Cell; to: Cell; piece: Piece },
  piecePromoted: Piece | null
) => {
  const { to, from, piece } = promotionCoordinates
  const turn: PieceColor = oldTurn === "w" ? "b" : "w"

  const [checkedColor, isCheckmate] = checkForCheckOrMate(board, turn)

  const status = getNewStatus(isCheckmate, board, turn, previousMoves, {
    from,
    to,
    piece,
    piecePromoted,
  })

  const move = createMove(
    oldTurn,
    from,
    to,
    piece,
    piecePromoted,
    checkedColor,
    status
  )

  return { turn, status, checkedColor, move }
}
