import { INITIAL_PIECES } from "../piece/constants"
import { getPossibleMoves, makePiece } from "../piece/utils"
import { Cell } from "./cell"
import type { Board } from "./types"

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
    let flip_counter_2 = 2
    let flip_counter_4 = 4

    // loop through loopRange
    for (let tile = 0; tile < tiles.length; tile++) {
      const cell = new Cell(ring, tile, angle)
      board[ring].push(cell)

      // logic for angle and counters...
      if (ring === 0) {
        angle = (angle + 36) % 360
      } else if (ring === 1) {
        if (flip_counter_2 === 2) {
          flip_counter_2 = 0
          angle = (angle + 36) % 360
        } else {
          if (flip_counter_2 === 0) {
            angle = (angle - 36 + 360) % 360 // must add 360 so negative angle is not returned
          } else {
            angle = (angle + 36) % 360
          }

          flip_counter_2 += 1
        }
      } else {
        if (flip_counter_4 === 4) {
          flip_counter_4 = 0
          angle = (angle + 36) % 360
        } else {
          if (flip_counter_4 % 2 === 0) {
            angle = (angle - 36 + 360) % 360 // must add 360 so negative angle is not returned
          } else {
            angle = (angle + 36) % 360
          }

          flip_counter_4 += 1
        }
      }
    }
  }

  // set cell vertices
  for (const ring of board) {
    for (const cell of ring) cell.setVertices(board)
  }

  initializePieces(board)

  return board
}

function initializePieces(board: Board) {
  for (const [ring, tiles] of Object.entries(INITIAL_PIECES)) {
    const x = parseInt(ring)
    for (const [tile, piece] of Object.entries(tiles)) {
      const y = parseInt(tile)
      board[x][y].piece = makePiece(...piece)
    }
  }
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
export function pieceClick(cell: Cell, board: Board): Cell[] {
  return getPossibleMoves(cell, board)
}

// handle the movement of pieces (once move is confirmed)
export function movePiece(
  fromPos: [number, number],
  toPos: [number, number]
): boolean {
  console.log(fromPos, toPos)
  // movement logic can be implemented here
  return true
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
