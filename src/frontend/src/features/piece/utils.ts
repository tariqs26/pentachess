import type { Board, Cell } from "../board/types"
import { cloneBoard, checkForCheckOrMate } from "../board/utils"
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
      (piece.color === "b" && to.y >= 0 && to.y <= 7))
  )
}

function isNotAlly(cellTo: Cell, currPiece: Piece): boolean {
  return cellTo.piece === null || cellTo.piece.color !== currPiece.color
}
function isEnemy(cellTo: Cell, currPiece: Piece | null): boolean {
  return cellTo.piece !== null && cellTo.piece.color !== currPiece?.color
}
function isEmpty(cell: Cell) {
  return cell.piece === null
}
function getSideEdge(cell: Cell, board: Board): Cell {
  return board[cell.edges[2][0]][cell.edges[2][1]]
}
function getCWEdge(cell: Cell, board: Board): Cell {
  return board[cell.edges[1][0]][cell.edges[1][1]]
}
function getCCWEdge(cell: Cell, board: Board): Cell {
  return board[cell.edges[0][0]][cell.edges[0][1]]
}
function getPawnTypeMoves(
  possibleMoves: Set<Cell>,
  cell: Cell,
  board: Board,
  type: "p" | "b",
  dir: "cw" | "ccw"
): void {
  const var1 = dir === "cw" ? 2 : 1
  const var2 = dir === "cw" ? 4 : 3
  if (cell.edges.length === 3) {
    const sideEdge = getSideEdge(cell, board)
    if (type === "p" ? isEmpty(sideEdge) : isEnemy(sideEdge, cell.piece))
      possibleMoves.add(sideEdge)
  }

  const forwEdge =
    dir === "cw" ? getCWEdge(cell, board) : getCCWEdge(cell, board)
  if (type === "p" ? isEmpty(forwEdge) : isEnemy(forwEdge, cell.piece)) {
    possibleMoves.add(forwEdge)
    if (type === "p" && !cell.piece?.hasMoved) {
      const forwForwEdge =
        dir === "cw" ? getCWEdge(forwEdge, board) : getCCWEdge(forwEdge, board)
      if (isEmpty(forwForwEdge)) possibleMoves.add(forwForwEdge)
    }
  }

  const forwForwEdge =
    dir === "cw" ? getCWEdge(forwEdge, board) : getCCWEdge(forwEdge, board)
  if (type === "p" ? isEnemy(forwForwEdge, cell.piece) : isEmpty(forwForwEdge))
    possibleMoves.add(forwForwEdge)
  if (
    (cell.x === 2 && (cell.y % 5 === 0 || cell.y % 5 === 2)) ||
    (cell.x === 1 && cell.y % 3 !== var1)
  ) {
    const sideEdge = getSideEdge(cell, board)
    const sideForwEdge =
      dir === "cw" ? getCWEdge(sideEdge, board) : getCCWEdge(sideEdge, board)
    if (
      type === "p" ? isEnemy(sideForwEdge, cell.piece) : isEmpty(sideForwEdge)
    )
      possibleMoves.add(sideForwEdge)
  } else if ((cell.x === 2 && cell.y % 5 === var2) || cell.x === 1) {
    const backEdge =
      dir === "cw" ? getCCWEdge(cell, board) : getCWEdge(cell, board)
    const sideBackEdge = getSideEdge(backEdge, board)
    if (
      type === "p" ? isEnemy(sideBackEdge, cell.piece) : isEmpty(sideBackEdge)
    )
      possibleMoves.add(sideBackEdge)
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
    case "pawn-cw": {
      getPawnTypeMoves(possibleMoves, cell, board, "p", "cw")
      break
    }
    case "pawn-ccw": {
      getPawnTypeMoves(possibleMoves, cell, board, "p", "ccw")
      break
    }
    case "berolina-pawn-cw": {
      getPawnTypeMoves(possibleMoves, cell, board, "b", "cw")
      break
    }
    case "berolina-pawn-ccw": {
      getPawnTypeMoves(possibleMoves, cell, board, "b", "ccw")
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
      for (let i = 0; i < 2; i++) {
        if (i === 0) currEdge = getCCWEdge(cell, board)
        else currEdge = getCWEdge(cell, board)
        while (currEdge !== cell) {
          if (currEdge.piece !== null) {
            if (currEdge.piece.color !== cell.piece.color) {
              possibleMoves.add(currEdge)
            }
            break
          } else possibleMoves.add(currEdge)
          if (i === 0) currEdge = getCCWEdge(currEdge, board)
          else currEdge = getCWEdge(currEdge, board)
        }
      }
      break
    }
    case "queen": {
      // get rook moves
      const rookMoves = getPossibleMoves(
        { ...cell, piece: makePiece("rook", cell.piece.color) },
        board,
        simulate
      )
      // get bishop moves
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
      for (const vertexTuple of cell.vertices) {
        const vertex = board[vertexTuple[0]][vertexTuple[1]]
        if (
          vertex.color === cell.color &&
          (vertex.piece === null || vertex.piece.color !== cell.piece.color)
        ) {
          possibleMoves.add(vertex)

          if (vertex.angle === cell.angle && vertex.piece === null) {
            for (const attachedVertexTuple of vertex.vertices) {
              const attachedVertex =
                board[attachedVertexTuple[0]][attachedVertexTuple[1]]
              if (
                attachedVertex.angle === vertex.angle &&
                attachedVertex.color === vertex.color &&
                (attachedVertex.piece === null ||
                  attachedVertex.piece.color !== cell.piece.color) &&
                cell.x !== 1
              ) {
                if (cell.x === 0) {
                  if (
                    attachedVertex.x === 2 &&
                    ((cell.y * 5) % 50 === attachedVertex.y ||
                      (cell.y * 5 + 4) % 50 === attachedVertex.y ||
                      (cell.y * 5 + 8) % 50 === attachedVertex.y)
                  ) {
                    possibleMoves.add(attachedVertex)
                    break
                  }
                  // cell.x = 2
                } else if (
                  attachedVertex.x === 0 &&
                  (cell.y + 4) % 5 !== 0 &&
                  (cell.y + 3) % 5 !== 0
                ) {
                  possibleMoves.add(attachedVertex)
                  break
                }
              }
            }
          }
        }
      }

      // cycles for center and outer ring
      if (cell.x === 1) {
        // counter clockwise check
        for (let counter = 2; counter < 28; counter += 2) {
          const currVertex = board[cell.x][(cell.y + counter) % 30]
          if (currVertex.piece === null) {
            possibleMoves.add(currVertex)
          } else {
            if (currVertex.piece.color !== cell.piece?.color) {
              possibleMoves.add(currVertex)
            }
            break
          }
        }
        // clockwise check
        for (let counter = 2; counter < 28; counter += 2) {
          const currVertex = board[cell.x][(cell.y - counter + 30) % 30]
          if (currVertex.piece === null) {
            possibleMoves.add(currVertex)
          } else {
            if (currVertex.piece.color !== cell.piece?.color) {
              possibleMoves.add(currVertex)
            }
            break
          }
        }
      } else if (cell.x === 2) {
        // counter clockwise check
        for (let counter = 2; counter < 48; counter += 2) {
          const currVertex = board[cell.x][(cell.y + counter) % 50]
          if (currVertex.piece === null) {
            possibleMoves.add(currVertex)
          } else {
            if (currVertex.piece.color !== cell.piece?.color) {
              possibleMoves.add(currVertex)
            }
            break
          }
        }
        // clockwise check
        for (let counter = 2; counter < 48; counter += 2) {
          const currVertex = board[cell.x][(cell.y - counter + 50) % 50]
          if (currVertex.piece === null) {
            possibleMoves.add(currVertex)
          } else {
            if (currVertex.piece.color !== cell.piece?.color) {
              possibleMoves.add(currVertex)
            }
            break
          }
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
