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

export function getPossibleMoves(
  cell: Cell,
  board: Board,
  simulate = false
): Set<Cell> {
  let possibleMoves = new Set<Cell>()

  if (cell.piece === null) return possibleMoves

  switch (cell.piece.type) {
    case "knight": {
      for (const vertexTuple of cell.vertices) {
        const vertex = board[vertexTuple[0]][vertexTuple[1]]
        if (
          vertex.color !== cell.color &&
          (vertex.piece === null || vertex.piece.color !== cell.piece.color)
        ) {
          possibleMoves.add(vertex)
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
    case "rook": {
      if (cell.edges.length === 3) {
        const edge = board[cell.edges[2][0]][cell.edges[2][1]]
        if (edge.piece === null || edge.piece.color !== cell.piece.color) {
          possibleMoves.add(edge)
        }
      }

      let currEdge: Cell
      for (let i = 0; i < 2; i++) {
        if (i === 0) currEdge = board[cell.edges[0][0]][cell.edges[0][1]]
        else currEdge = board[cell.edges[1][0]][cell.edges[1][1]]
        while (currEdge !== cell) {
          if (currEdge.piece !== null) {
            if (currEdge.piece.color !== cell.piece.color) {
              possibleMoves.add(currEdge)
            }
            break
          } else possibleMoves.add(currEdge)
          if (i === 0)
            currEdge = board[currEdge.edges[0][0]][currEdge.edges[0][1]]
          else currEdge = board[currEdge.edges[1][0]][currEdge.edges[1][1]]
        }
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
    case "king": {
      for (const edgeTuple of Array.from(cell.edges)) {
        const edge = board[edgeTuple[0]][edgeTuple[1]]
        if (edge.piece === null || edge.piece.color !== cell.piece.color) {
          possibleMoves.add(edge)
        }
      }
      for (const vertexTuple of cell.vertices) {
        const vertex = board[vertexTuple[0]][vertexTuple[1]]
        if (vertex.color === cell.color) {
          if (vertex.piece !== null) {
            if (vertex.piece.color !== cell.piece.color) {
              possibleMoves.add(vertex)
            }
          } else possibleMoves.add(vertex)
        }
      }
      break
    }
    case "berolina-pawn-cw": {
      if (cell.edges.length === 3) {
        const sideEdge = board[cell.edges[2][0]][cell.edges[2][1]]
        if (
          sideEdge.piece !== null &&
          sideEdge.piece.color !== cell.piece.color
        ) {
          possibleMoves.add(sideEdge)
        }
      }

      const forwEdge = board[cell.edges[1][0]][cell.edges[1][1]]
      if (
        forwEdge.piece !== null &&
        forwEdge.piece.color !== cell.piece.color
      ) {
        possibleMoves.add(forwEdge)
      }

      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        if (vertex.color === cell.color && vertex.piece === null) {
          const forwForwEdge = board[forwEdge.edges[1][0]][forwEdge.edges[1][1]]
          const forwForwVertexIds = forwForwEdge.vertices.map(
            ([x, y]) => board[x][y].id
          )
          if (cell.x === 2) {
            if (cell.x === vertex.x) {
              if ((cell.y + 2) % 50 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else if (forwForwVertexIds.includes(vertex.id)) {
              possibleMoves.add(vertex)
            }
          } else if (cell.x === 1) {
            if (cell.x === vertex.x) {
              if ((cell.y + 2) % 30 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else if (forwForwVertexIds.includes(vertex.id)) {
              possibleMoves.add(vertex)
            }
          } else if (cell.x === vertex.x) {
            if ((cell.y + 2) % 10 !== vertex.y) {
              possibleMoves.add(vertex)
            }
          } else if (forwForwVertexIds.includes(vertex.id)) {
            possibleMoves.add(vertex)
          }
        }
      }
      if (forwEdge.edges.length === 3) {
        const forwSideEdge = board[forwEdge.edges[2][0]][forwEdge.edges[2][1]]
        possibleMoves.delete(forwSideEdge)
      }

      break
    }
    case "berolina-pawn-ccw": {
      if (cell.edges.length === 3) {
        const sideEdge = board[cell.edges[2][0]][cell.edges[2][1]]
        if (
          sideEdge.piece !== null &&
          sideEdge.piece.color !== cell.piece.color
        ) {
          possibleMoves.add(sideEdge)
        }
      }

      const forwEdge = board[cell.edges[0][0]][cell.edges[0][1]]
      if (
        forwEdge.piece !== null &&
        forwEdge.piece.color !== cell.piece.color
      ) {
        possibleMoves.add(forwEdge)
      }

      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        if (vertex.color === cell.color && vertex.piece === null) {
          const forwForwEdge = board[forwEdge.edges[0][0]][forwEdge.edges[0][1]]
          const forwForwVertexIds = forwForwEdge.vertices.map(
            ([x, y]) => board[x][y].id
          )
          if (cell.x === 2) {
            if (cell.x === vertex.x) {
              if ((cell.y + 48) % 50 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else if (forwForwVertexIds.includes(vertex.id)) {
              possibleMoves.add(vertex)
            }
          } else if (cell.x === 1) {
            if (cell.x === vertex.x) {
              if ((cell.y + 28) % 30 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else if (forwForwVertexIds.includes(vertex.id)) {
              possibleMoves.add(vertex)
            }
          } else if (cell.x === vertex.x) {
            if ((cell.y + 8) % 10 !== vertex.y) {
              possibleMoves.add(vertex)
            }
          } else if (forwForwVertexIds.includes(vertex.id)) {
            possibleMoves.add(vertex)
          }
        }
      }
      if (forwEdge.edges.length === 3) {
        const forwSideEdge = board[forwEdge.edges[2][0]][forwEdge.edges[2][1]]
        possibleMoves.delete(forwSideEdge)
      }

      break
    }
    case "pawn-cw": {
      // cell.edges.next = ccw direction, cell.edges.prev = cw direction

      if (cell.edges.length === 3) {
        const sideEdge = board[cell.edges[2][0]][cell.edges[2][1]]
        if (sideEdge.piece === null) {
          possibleMoves.add(sideEdge)
        }
      }

      const forwEdge = board[cell.edges[1][0]][cell.edges[1][1]]
      if (forwEdge.piece === null) {
        possibleMoves.add(forwEdge)
        if (!cell.piece.hasMoved) {
          const firstMoveEdge = board[cell.edges[1][0]][cell.edges[1][1] - 1]
          if (firstMoveEdge.piece === null) possibleMoves.add(firstMoveEdge)
        }
      }

      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        if (vertex.color === cell.color && vertex.piece !== null) {
          if (vertex.piece.color !== cell.piece.color) {
            const forwForwEdge =
              board[forwEdge.edges[1][0]][forwEdge.edges[1][1]]
            const forwForwVertexIds = forwForwEdge.vertices.map(
              ([x, y]) => board[x][y].id
            )
            if (cell.x === 2) {
              if (cell.x === vertex.x) {
                if ((cell.y + 2) % 50 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else if (forwForwVertexIds.includes(vertex.id)) {
                possibleMoves.add(vertex)
              }
            } else if (cell.x === 1) {
              if (cell.x === vertex.x) {
                if ((cell.y + 2) % 30 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else if (forwForwVertexIds.includes(vertex.id)) {
                possibleMoves.add(vertex)
              }
            } else if (cell.x === vertex.x) {
              if ((cell.y + 2) % 10 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else if (forwForwVertexIds.includes(vertex.id)) {
              possibleMoves.add(vertex)
            }
          }
        }
      }
      if (forwEdge.edges.length === 3) {
        const forwSideEdge = board[forwEdge.edges[2][0]][forwEdge.edges[2][1]]
        possibleMoves.delete(forwSideEdge)
      }

      break
    }
    case "pawn-ccw": {
      // cell.edges.next = ccw direction, cell.edges.prev = cw direction

      if (cell.edges.length === 3) {
        const sideEdge = board[cell.edges[2][0]][cell.edges[2][1]]
        if (sideEdge.piece === null) {
          possibleMoves.add(sideEdge)
        }
      }

      const forwEdge = board[cell.edges[0][0]][cell.edges[0][1]]
      if (forwEdge.piece === null) {
        possibleMoves.add(forwEdge)
        if (!cell.piece.hasMoved) {
          const firstMoveEdge = board[cell.edges[0][0]][cell.edges[0][1] + 1]
          if (firstMoveEdge.piece === null) possibleMoves.add(firstMoveEdge)
        }
      }

      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        if (vertex.color === cell.color && vertex.piece !== null) {
          if (vertex.piece.color !== cell.piece.color) {
            const forwForwEdge =
              board[forwEdge.edges[0][0]][forwEdge.edges[0][1]]
            const forwForwVertexIds = forwForwEdge.vertices.map(
              ([x, y]) => board[x][y].id
            )
            if (cell.x === 2) {
              if (cell.x === vertex.x) {
                if ((cell.y + 48) % 50 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else if (forwForwVertexIds.includes(vertex.id)) {
                possibleMoves.add(vertex)
              }
            } else if (cell.x === 1) {
              if (cell.x === vertex.x) {
                if ((cell.y + 28) % 30 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else if (forwForwVertexIds.includes(vertex.id)) {
                possibleMoves.add(vertex)
              }
            } else if (cell.x === vertex.x) {
              if ((cell.y + 8) % 10 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else if (forwForwVertexIds.includes(vertex.id)) {
              possibleMoves.add(vertex)
            }
          }
        }
      }
      if (forwEdge.edges.length === 3) {
        const forwSideEdge = board[forwEdge.edges[2][0]][forwEdge.edges[2][1]]
        possibleMoves.delete(forwSideEdge)
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
