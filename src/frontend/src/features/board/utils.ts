import type { Piece } from "../piece/types"
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
  const initialPieces: Record<number, Record<number, Piece>> = {
    1: {
      0: makePiece("berolina-pawn-ccw", "w"),
      1: makePiece("pawn-ccw", "w"),
      2: makePiece("pawn-ccw", "w"),
      12: makePiece("pawn-cw", "b"),
      13: makePiece("pawn-cw", "b"),
      14: makePiece("berolina-pawn-cw", "b"),
      15: makePiece("berolina-pawn-ccw", "b"),
      16: makePiece("pawn-ccw", "b"),
      17: makePiece("pawn-ccw", "b"),
      27: makePiece("pawn-cw", "w"),
      28: makePiece("pawn-cw", "w"),
      29: makePiece("berolina-pawn-cw", "w"),
    },
    2: {
      0: makePiece("king", "w"),
      1: makePiece("knight", "w"),
      2: makePiece("rook", "w"),
      3: makePiece("bishop", "w"),
      4: makePiece("berolina-pawn-ccw", "w"),
      5: makePiece("pawn-ccw", "w"),
      19: makePiece("pawn-cw", "b"),
      20: makePiece("berolina-pawn-cw", "b"),
      21: makePiece("bishop", "b"),
      22: makePiece("rook", "b"),
      23: makePiece("knight", "b"),
      24: makePiece("queen", "b"),
      25: makePiece("king", "b"),
      26: makePiece("knight", "b"),
      27: makePiece("rook", "b"),
      28: makePiece("bishop", "b"),
      29: makePiece("berolina-pawn-ccw", "b"),
      30: makePiece("pawn-ccw", "b"),
      44: makePiece("pawn-cw", "w"),
      45: makePiece("berolina-pawn-cw", "w"),
      46: makePiece("bishop", "w"),
      47: makePiece("rook", "w"),
      48: makePiece("knight", "w"),
      49: makePiece("queen", "w"),
    },
  }

  for (const decagon of Object.keys(initialPieces)) {
    const x = parseInt(decagon)
    for (const tile of Object.keys(initialPieces[x])) {
      const y = parseInt(tile)
      board[x][y].piece = initialPieces[x][y]
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
