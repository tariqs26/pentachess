import { INITIAL_PIECES } from "../piece/constants"
import type { PieceColor } from "../piece/types"
import { getPossibleMoves, makePiece } from "../piece/utils"
import { cloneCell, makeCell, setCellEdges, setCellVertices } from "./cell"
import type { Board, Cell } from "./types"

export function initializeBoard() {
  const rings = [new Array(10), new Array(30), new Array(50)]
  const board: Board = [[], [], []]

  for (let ring = 0; ring < rings.length; ring++) {
    const tiles = rings[ring]
    let angle = 0
    let flipCounter2 = 2
    let flipCounter4 = 4

    // loop through loopRange
    for (let tile = 0; tile < tiles.length; tile++) {
      const cell = makeCell(ring, tile, angle)
      board[ring].push(cell)

      // logic for angle and counters...
      if (ring === 0) {
        angle = (angle + 36) % 360
      } else if (ring === 1) {
        if (flipCounter2 === 2) {
          flipCounter2 = 0
          angle = (angle + 36) % 360
        } else {
          if (flipCounter2 === 0) {
            angle = (angle - 36 + 360) % 360 // must add 360 so negative angle is not returned
          } else {
            angle = (angle + 36) % 360
          }

          flipCounter2 += 1
        }
      } else {
        if (flipCounter4 === 4) {
          flipCounter4 = 0
          angle = (angle + 36) % 360
        } else {
          if (flipCounter4 % 2 === 0) {
            angle = (angle - 36 + 360) % 360 // must add 360 so negative angle is not returned
          } else {
            angle = (angle + 36) % 360
          }

          flipCounter4 += 1
        }
      }
    }
  }

  for (const ring of board) {
    for (const cell of ring) setCellEdges(cell)
  }

  for (const ring of board) {
    for (const cell of ring) setCellVertices(cell, board)
  }

  initializePieces(board)

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
  color: PieceColor
): [PieceColor | null, boolean] {
  const king = getKingCell(board, color)
  for (const ring of board) {
    for (const cell of ring) {
      if (cell.piece !== null && cell.piece.color !== king?.piece?.color) {
        const possibleMoves = getPossibleMoves(cell, board, true)
        if (Array.from(possibleMoves).some((move) => move.id === king?.id)) {
          return [color, king ? checkForCheckmate(board, king) : false]
        }
      }
    }
  }
  return [null, false]
}

function checkForCheckmate(board: Board, king: Cell) {
  for (const ring of board) {
    for (const cell of ring) {
      if (cell.piece !== null && cell.piece.color === king.piece?.color) {
        const possibleMoves = getPossibleMoves(cell, board)
        if (possibleMoves.size > 0) return false
      }
    }
  }
  return true
}

// TODO
export function checkForStalemate(board: Board): boolean {
  console.info(board)
  return false
}
