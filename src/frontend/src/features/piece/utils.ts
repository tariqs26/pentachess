import type { Board } from "../board/types"
import type { Cell } from "@/features/board/cell"
import { Piece, PieceColour, PieceType } from "./types"
import { PIECE_DATA } from "./constants"

export function makePiece(type: PieceType, colour: PieceColour): Piece {
  return {
    type,
    colour,
    value: PIECE_DATA[type].value,
    image: PIECE_DATA[type].image[colour],
  }
}
// TODO: Demo MVP
export function getPossibleMoves(cell: Cell, board: Board): Cell[] {
  const possibleMoves: Cell[] = []

  switch (cell.piece?.type) {
    case "knight":
      console.log(cell.color)
      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        console.log(x, vertex.color)

        if (vertex.color !== cell.color) {
          possibleMoves.push(vertex)
        }
      }
      console.log("\nPossible Moves:")
    case "queen":
      break
    case "rook":
      break
    case "bishop":
      break
    case "king":
      break
    case "berolina-pawn-cw":
      break
    case "berolina-pawn-ccw":
      break
    case "pawn-cw":
      break
    case "pawn-ccw":
      break
  }
  return possibleMoves
}

// TODO
export function capturePiece(board: Board, from: Cell, to: Cell) {
  console.info(board, from, to)
}

// TODO
export function promotePawn(board: Board, cell: Cell) {
  console.info(board, cell)
}
