import { INITIAL_PIECES } from "../piece/constants"
import type { Piece, PieceColor, PieceType } from "../piece/types"
import { getPossibleMoves, makePiece } from "../piece/utils"
import { cloneCell, makeCell, setCellEdges, setCellVertices } from "./cell"
import type { Board, Cell } from "./types"

export function initializeBoard(initialPieces: boolean = true) {
  const rings = [new Array(10), new Array(30), new Array(50)]
  const board: Board = [[], [], []]

  for (let ring = 0; ring < rings.length; ring++) {
    const tiles = rings[ring]
    let angle = 0
    let flipCounter = 0

    for (let tile = 0; tile < tiles.length; tile++) {
      const cell = makeCell(ring, tile, angle)
      board[ring].push(cell)

      // inner ring (increment every cell by 36)
      if (ring === 0) {
        angle = (angle + 36) % 360
      }
      // center ring (pattern is down, up, up)
      else if (ring === 1) {
        if (flipCounter % 3 === 0) {
          angle = (angle - 36 + 360) % 360
        } else angle = (angle + 36) % 360
      }
      // outer ring (pattern is down, up, down, up, up)
      else if (flipCounter % 5 === 0 || flipCounter % 5 === 2) {
        angle = (angle - 36 + 360) % 360
      } else {
        angle = (angle + 36) % 360
      }
      flipCounter += 1
    }
  }

  for (const ring of board) {
    for (const cell of ring) setCellEdges(cell)
  }

  for (const ring of board) {
    for (const cell of ring) setCellVertices(cell, board)
  }

  if (initialPieces) initializePieces(board)

  return board
}

function initializePieces(board: Board) {
  for (const [ring, tiles] of Object.entries(INITIAL_PIECES)) {
    const x = Number.parseInt(ring)
    for (const [tile, piece] of Object.entries(tiles)) {
      const y = Number.parseInt(tile)
      board[x][y].piece = makePiece(...piece)
    }
  }
}

export function cloneBoard(board: Board): Board {
  return board.map((ring) => ring.map(cloneCell))
}

export function getSides<T>(arr: T[], size: number) {
  return arr.reduce((acc: T[][], _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size))
    return acc
  }, [])
}

export function getKingCell(board: Board, pieceColor?: PieceColor) {
  for (const ring of board) {
    for (const cell of ring) {
      if (cell.piece?.type === "king" && cell.piece.color === pieceColor) {
        return cell
      }
    }
  }

  return null
}

export function checkForCheckOrMate(
  board: Board,
  color: PieceColor,
  checkForMate = true
): [PieceColor | null, boolean] {
  const king = getKingCell(board, color)
  for (const ring of board) {
    for (const cell of ring) {
      if (cell.piece !== null && cell.piece.color !== color) {
        const possibleMoves = getPossibleMoves(cell, board, true)

        if (Array.from(possibleMoves).some((move) => move.id === king?.id)) {
          if (!checkForMate) return [color, true]
          return [
            color,
            king?.piece ? checkIfMovesExist(board, king.piece.color) : false,
          ]
        }
      }
    }
  }
  return [null, false]
}

function checkIfMovesExist(board: Board, color: PieceColor) {
  for (const ring of board) {
    for (const cell of ring) {
      if (cell.piece !== null && cell.piece.color === color) {
        const possibleMoves = getPossibleMoves(cell, board)
        if (possibleMoves.size > 0) return false
      }
    }
  }
  return true
}

export function checkForStalemate(board: Board, color: PieceColor) {
  return checkIfMovesExist(board, color)
}

export function checkThreeMoveRep(
  moves: { from: Cell; to: Cell; piece: Piece }[]
) {
  if (moves.length >= 12) {
    const lastTwelve = moves.slice(-12)
    for (let i = 0; i < 8; i++) {
      if (
        lastTwelve[i].from.id !== lastTwelve[i + 4].from.id ||
        lastTwelve[i].to.id !== lastTwelve[i + 4].to.id ||
        lastTwelve[i].piece.type !== lastTwelve[i + 4].piece.type
      ) {
        return false
      }
    }
    return true
  }
  return false
}

export function checkFiftyMoveNoCap(moves: { to: Cell; piece: Piece }[]) {
  if (moves.length >= 50) {
    const lastFifty = moves.slice(-50)
    for (const { to, piece } of lastFifty) {
      if (piece.abbr === "P" || to.piece) return false
    }
    return true
  }
  return false
}

export function checkInsufficientMaterial(board: Board) {
  const whitePieces = new Set<PieceType>()
  const blackPieces = new Set<PieceType>()
  for (const ring of board) {
    for (const cell of ring) {
      if (cell.piece) {
        if (cell.piece.color === "w") whitePieces.add(cell.piece.type)
        else blackPieces.add(cell.piece.type)
      }
    }
  }
  // 1 possible condition for insufficient material (waiting on others from Dr. Paul)
  if (
    whitePieces.size === 1 &&
    whitePieces.has("king") &&
    blackPieces.size === 1 &&
    blackPieces.has("king")
  ) {
    return true
  }
  return false
}

export const cellRotation = (cell: Cell) => {
  if (cell.x === 0) return cell.y % 2 === 0 ? -70.5 : -109
  if (cell.side % 2 !== 0) return cell.y % 2 === 0 ? -73.5 : -109.5
  return cell.y % 2 === 0 ? -109.5 : -73.5
}

export const marginLeftStyle = (cell: Cell) => {
  // key = the ith cell in the side, value = margin value
  const leftMarginsForRing1 = { 0: -70, 1: -69, 2: -69.5 }
  const leftMarginsForRing2 = { 0: -70, 1: -69, 2: -69.5, 3: -69, 4: -69.5 }

  if (cell.x === 1) {
    const ithCell = (cell.y - cell.side * 3) as keyof typeof leftMarginsForRing1
    return leftMarginsForRing1[ithCell]
  }

  if (cell.x === 2) {
    const ithCell = (cell.y - cell.side * 5) as keyof typeof leftMarginsForRing2
    return leftMarginsForRing2[ithCell]
  }
  // default margins for ring 0
  return cell.side % 2 !== 0 ? -70.1 : -70.5
}

export const marginTopStyle = (cell: Cell) => {
  // key = the ith cell in the side, value = margin value
  const topMarginsForRing1 = { 0: 0, 1: 4.5, 2: -1.5 }
  const topMarginsForRing2 = { 0: 0, 1: 4.5, 2: -1.6, 3: 2.9, 4: -3.2 }

  if (cell.x === 1) {
    const ithCell = (cell.y - cell.side * 3) as keyof typeof topMarginsForRing1
    return topMarginsForRing1[ithCell]
  }

  if (cell.x === 2) {
    const ithCell = (cell.y - cell.side * 5) as keyof typeof topMarginsForRing2
    return topMarginsForRing2[ithCell]
  }

  // default margins for ring 0
  return cell.side % 2 !== 0 ? -30 : -10
}