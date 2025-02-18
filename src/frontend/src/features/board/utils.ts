import { INITIAL_PIECES } from "../piece/constants"
import { getPossibleMoves, makePiece } from "../piece/utils"
import { cloneCell, makeCell, setCellEdges, setCellVertices } from "./cell"
import type { Board, Cell } from "./types"

export function initializeBoard(): Board {
  const rings = [
    new Array(10), // inner ring
    new Array(30), // middle ring
    new Array(50), // outer ring
  ]

  const board: Board = [[], [], []]

  for (let ring = 0; ring < rings.length; ring++) {
    const tiles = rings[ring]
    let angle = 0
    let flipCounter = 0

    // loop through loopRange
    for (let tile = 0; tile < tiles.length; tile++) {
      const cell = makeCell(ring, tile, angle)
      board[ring].push(cell)

      // logic for angle and counters
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
      // outter ring (pattern is down, up, down, up, up)
      else {
        if (flipCounter % 5 === 0 || flipCounter % 5 === 2) {
          angle = (angle - 36 + 360) % 360
        } else angle = (angle + 36) % 360
      }
      flipCounter += 1
    }
  }

  // set cell edges
  for (const ring of board) {
    for (const cell of ring) setCellEdges(cell)
  }

  // set cell vertices
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

// display the board state for debugging
export function logBoard(board: Board) {
  board.forEach((ring) => {
    const pieces = ring.map((cell) => cell.piece ?? "empty")
    console.log(pieces)
  })
}

export function getSides<T>(arr: T[], size: number) {
  return arr.reduce((acc: T[][], _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size))
    return acc
  }, [])
}

// handle piece click (user interaction)
export function pieceClick(cell: Cell, board: Board): Set<Cell> {
  // memoize moves here and reset in the movePiece function
  return getPossibleMoves(cell, board)
}

// TODO
export function checkForCheck(board: Board): boolean {
  console.info(board)
  return false
}

// TODO
export function checkForStalemate(board: Board): boolean {
  console.info(board)
  return false
}

// TODO
export function checkForCheckmate(board: Board): boolean {
  console.info(board)
  return false
}
