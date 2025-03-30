import { getCCWEdge, getCWEdge, getSideEdge } from "../board/cell"
import type { Board, Cell } from "../board/types"
import { checkForCheckOrMate, cloneBoard } from "../board/utils"
import { PIECE_DATA } from "./constants"
import type { Piece, PieceColor, PieceType } from "./types"

export function makePiece(type: PieceType, color: PieceColor): Piece {
  return {
    type,
    abbr: PIECE_DATA[type].abbr,
    color,
    value: PIECE_DATA[type].value,
    image: PIECE_DATA[type].image[color],
    hasMoved: false,
    canPromote: true,
  }
}

export function canPromote(piece: Piece, to: { x: number; y: number }) {
  return (
    (piece.type === "pawn-cw" ||
      piece.type === "pawn-ccw" ||
      piece.type === "berolina-pawn-cw" ||
      piece.type === "berolina-pawn-ccw") &&
    to.x === 2 &&
    ((piece.color === "w" && to.y >= 25 && to.y <= 32) ||
      (piece.color === "b" && to.y >= 0 && to.y <= 7)) &&
    piece.canPromote
  )
}

function isNotAlly(cellTo: Cell, currPiece: Piece) {
  return cellTo.piece === null || cellTo.piece.color !== currPiece.color
}

function isEnemy(cellTo: Cell, currPiece: Piece | null) {
  return cellTo.piece !== null && cellTo.piece.color !== currPiece?.color
}

function isEmpty(cell: Cell) {
  return cell.piece === null
}

function getPawnTypeMoves(
  possibleMoves: Set<Cell>,
  cell: Cell,
  board: Board,
  piece: Piece
) {
  const isPawn = piece.type[0] === "p"
  const isCW = piece.type.endsWith("-cw")

  const getForwardEdge = isCW ? getCWEdge : getCCWEdge
  const getBackwardEdge = isCW ? getCCWEdge : getCWEdge

  if (cell.edges.length === 3) {
    const sideEdge = getSideEdge(cell, board)
    if (isPawn ? isEmpty(sideEdge) : isEnemy(sideEdge, piece))
      possibleMoves.add(sideEdge)
  }

  const forwardEdge = getForwardEdge(cell, board)
  if (isPawn ? isEmpty(forwardEdge) : isEnemy(forwardEdge, piece)) {
    possibleMoves.add(forwardEdge)
    if (isPawn && !piece.hasMoved) {
      const nextForwardEdge = getForwardEdge(forwardEdge, board)
      if (isEmpty(nextForwardEdge)) possibleMoves.add(nextForwardEdge)
    }
  }

  const nextForwardEdge = getForwardEdge(forwardEdge, board)

  if (isPawn ? isEnemy(nextForwardEdge, piece) : isEmpty(nextForwardEdge))
    possibleMoves.add(nextForwardEdge)

  if (
    (cell.x === 1 && cell.y % 3 !== (isCW ? 2 : 1)) ||
    (cell.x === 2 && (cell.y % 5 === 0 || cell.y % 5 === 2))
  ) {
    const sideForwardEdge = getForwardEdge(getSideEdge(cell, board), board)
    if (isPawn ? isEnemy(sideForwardEdge, piece) : isEmpty(sideForwardEdge))
      possibleMoves.add(sideForwardEdge)
  }
  if (
    (cell.x === 1 && cell.y % 3 === (isCW ? 2 : 1)) ||
    (cell.x === 2 && cell.y % 5 === (isCW ? 4 : 3))
  ) {
    const backwardSideEdge = getSideEdge(getBackwardEdge(cell, board), board)
    if (isPawn ? isEnemy(backwardSideEdge, piece) : isEmpty(backwardSideEdge))
      possibleMoves.add(backwardSideEdge)
  }
}

export function getPossibleMoves(
  cell: Cell,
  board: Board,
  simulate = false
): Set<Cell> {
  let possibleMoves = new Set<Cell>()

  if (cell.piece === null) return possibleMoves

  switch (cell.piece.type) {
    case "pawn-cw":
    case "pawn-ccw":
    case "berolina-pawn-cw":
    case "berolina-pawn-ccw": {
      getPawnTypeMoves(possibleMoves, cell, board, cell.piece)
      break
    }
    case "knight": {
      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        if (vertex.color !== cell.color && isNotAlly(vertex, cell.piece))
          possibleMoves.add(vertex)
      }
      break
    }
    case "rook": {
      if (cell.edges.length === 3) {
        const sideEdge = getSideEdge(cell, board)
        if (isNotAlly(sideEdge, cell.piece)) {
          possibleMoves.add(sideEdge)
        }
      }

      let currEdge: Cell
      for (const getForwardEdge of [getCCWEdge, getCWEdge]) {
        currEdge = getForwardEdge(cell, board)
        while (currEdge !== cell) {
          if (currEdge.piece !== null) {
            if (currEdge.piece.color !== cell.piece.color)
              possibleMoves.add(currEdge)
            break
          } else possibleMoves.add(currEdge)
          currEdge = getForwardEdge(currEdge, board)
        }
      }
      break
    }
    case "queen": {
      const rookMoves = getPossibleMoves(
        { ...cell, piece: makePiece("rook", cell.piece.color) },
        board,
        simulate
      )
      const bishopMoves = getPossibleMoves(
        { ...cell, piece: makePiece("bishop", cell.piece.color) },
        board,
        simulate
      )
      possibleMoves = bishopMoves.union(rookMoves)
      break
    }
    case "king": {
      for (const [x, y] of cell.edges) {
        const edge = board[x][y]
        if (isNotAlly(edge, cell.piece)) possibleMoves.add(edge)
      }
      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        if (vertex.color === cell.color && isNotAlly(vertex, cell.piece))
          possibleMoves.add(vertex)
      }
      break
    }
    case "bishop": {
      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        if (vertex.color === cell.color && isNotAlly(vertex, cell.piece)) {
          possibleMoves.add(vertex)
          if (
            cell.x !== 1 &&
            vertex.angle === cell.angle &&
            vertex.piece === null
          ) {
            for (const [attachedX, attachedY] of vertex.vertices) {
              const attachedVertex = board[attachedX][attachedY]
              if (
                attachedVertex.angle === vertex.angle &&
                attachedVertex.color === vertex.color &&
                isNotAlly(attachedVertex, cell.piece)
              ) {
                if (
                  (cell.x === 0 &&
                    attachedVertex.x === 2 &&
                    ((cell.y * 5) % 50 === attachedVertex.y ||
                      (cell.y * 5 + 4) % 50 === attachedVertex.y ||
                      (cell.y * 5 + 8) % 50 === attachedVertex.y)) ||
                  (cell.x === 2 &&
                    attachedVertex.x === 0 &&
                    cell.y % 5 !== 1 &&
                    cell.y % 5 !== 2)
                ) {
                  possibleMoves.add(attachedVertex)
                  break
                }
              }
            }
          }
        }
      }

      let currEdge: Cell
      for (const getForwardEdge of [getCCWEdge, getCWEdge]) {
        currEdge = getForwardEdge(getForwardEdge(cell, board), board)
        while (currEdge !== cell) {
          if (currEdge.piece !== null) {
            if (currEdge.piece.color !== cell.piece.color)
              possibleMoves.add(currEdge)
            break
          } else possibleMoves.add(currEdge)
          currEdge = getForwardEdge(getForwardEdge(currEdge, board), board)
        }
      }
      break
    }
  }
  if (simulate) return possibleMoves
  return checkKingSafety(cell, board, possibleMoves)
}

function checkKingSafety(
  simulation: Cell,
  board: Board,
  possibleMoves: Set<Cell>
): Set<Cell> {
  const currentColor = simulation?.piece?.color

  for (const move of Array.from(possibleMoves)) {
    const clonedBoard = cloneBoard(board)
    clonedBoard[move.x][move.y].piece = simulation.piece
    clonedBoard[simulation.x][simulation.y].piece = null
    let illegalMove = false
    if (currentColor) {
      // eslint-disable-next-line no-extra-semi
      ;[, illegalMove] = checkForCheckOrMate(clonedBoard, currentColor, false)
    }

    if (illegalMove) {
      possibleMoves.delete(move)
    }
  }
  return possibleMoves
}

export function getInvalidMoves(
  cell: Cell,
  board: Board,
  validMoves: Set<Cell>
): Set<Cell> {
  const invalidMoves = getPossibleMoves(cell, board, true)

  validMoves.forEach((move) => {
    invalidMoves.delete(move)
  })

  return invalidMoves
}
