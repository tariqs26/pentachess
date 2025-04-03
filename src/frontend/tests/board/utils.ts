import { makeCell } from "@/features/board/cell"
import { initializeBoard } from "@/features/board/utils"
import type { Move } from "@/features/game/types"
import { createMove } from "@/features/game/utils"
import { makePiece } from "@/features/piece/utils"
import {
  sideRotation,
  sideTop,
  sideLeft,
} from "@/features/board/components/Side"

export const createEmptyBoard = () => initializeBoard(false)

export const createBoardWithKings = () => {
  const board = createEmptyBoard()
  board[2][4].piece = makePiece("king", "w")
  board[2][28].piece = makePiece("king", "b")
  return board
}

export const createMovesWithCapture = (
  count: number,
  withCapture = false
): Move[] => {
  const moves: Move[] = []
  const cell1 = makeCell(0, 0, 0)
  const cell2 = makeCell(0, 1, 36)
  const piece = makePiece("knight", "w")

  for (let i = 0; i < count; i++) {
    let move: Move

    if (withCapture && i === Math.floor(count / 2)) {
      const captureCell = makeCell(0, 2, 72)
      captureCell.piece = makePiece("pawn-cw", "b")
      move = createMove(
        "w",
        cell1,
        captureCell,
        piece,
        captureCell.piece,
        null,
        "playing"
      )
    } else {
      move = createMove("w", cell1, cell2, piece, null, null, "playing")
    }

    moves.push(move)
  }

  return moves
}

export const createRepeatingMoves = (count: number): Move[] => {
  // Create test moves with repetition pattern for three-move detection
  const moves: Move[] = []
  const cell1 = makeCell(0, 0, 0)
  const cell2 = makeCell(0, 1, 36)
  const piece = makePiece("knight", "w")

  // Add repeating pattern (count) times - each unit has 4 moves
  for (let i = 0; i < count; i++) {
    moves.push(createMove("w", cell1, cell2, piece, null, null, "waiting"))
    moves.push(createMove("w", cell2, cell1, piece, null, null, "waiting"))
    moves.push(createMove("w", cell1, cell2, piece, null, null, "waiting"))
    moves.push(createMove("w", cell2, cell1, piece, null, null, "waiting"))
  }

  return moves
}

export const getSideProps = (ring: number, side: number) => {
  const rotation = sideRotation[ring][side]
  const left = sideLeft[ring][side]
  const top = sideTop[ring][side]

  return {
    rotate: `${rotation}deg`,
    left: `${left}px`,
    top: `${top}px`,
  }
}

export const normalizeImagePath = (url: string): string => {
  return decodeURI(url)
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/_next\/image\?url=/, "")
    .replace(/%2F/g, "/")
    .replace(/&w=\d+&q=\d+/, "")
}
