import type { Board, Cell } from "../board/types"
import { PIECE_DATA } from "./constants"
import type { Piece, PieceColor, PieceType } from "./types"
import { getEdgeList } from "../board/cell"

export function makePiece(type: PieceType, color: PieceColor): Piece {
  return {
    type,
    color,
    value: PIECE_DATA[type].value,
    image: PIECE_DATA[type].image[color],
  }
}

// TODO: Demo MVP
export function getPossibleMoves(cell: Cell, board: Board): Set<Cell> {
  if (cell.piece === null) return new Set<Cell>()

  let possibleMoves = new Set<Cell>()

  switch (cell.piece.type) {
    case "knight": {
      possibleMoves = new Set(cell.vertices.filter(vertex =>
        vertex.color !== cell.color &&
        (vertex.piece === null || vertex.piece.color !== cell.piece.color)))
      break
    }
    case "queen": {
      // get rook moves
      const rookMoves = getPossibleMoves(
        { ...cell, piece: makePiece("rook", cell.piece.color) },
        board
      )
      // get bishop moves
      const bishopMoves = getPossibleMoves(
        { ...cell, piece: makePiece("bishop", cell.piece.color) },
        board
      )
      possibleMoves = possibleMoves.union(bishopMoves.union(rookMoves))
      break
    }
    case "rook": {
      if (cell.edges.inout !== null) {
        const edge = cell.edges.inout
        if (edge.piece === null || edge.piece.color !== cell.piece.color) {
          possibleMoves.add(edge)
        }
      }

      let currEdge: Cell
      for (let i = 0; i < 2; i++) {
        if (i == 0) currEdge = cell.edges.next as Cell
        else currEdge = cell.edges.prev as Cell
        while (currEdge != cell) {
          if (currEdge.piece != null) {
            if (currEdge.piece.color != cell.piece.color) {
              possibleMoves.add(currEdge)
            }
            break
          } else possibleMoves.add(currEdge)
          if (i == 0)
            currEdge = currEdge.edges.next as Cell
          else currEdge = currEdge.edges.prev as Cell
        }
      }
      break
    }
    case "bishop": {
      for (const vertex of cell.vertices) {
        if (
          vertex.color === cell.color &&
          (vertex.piece === null || vertex.piece.color !== cell.piece.color)
        ) {
          possibleMoves.add(vertex)

          if (vertex.angle === cell.angle && vertex.piece === null) {
            for (const attachedVertex of vertex.vertices) {
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
                    (attachedVertex.y + 48) % 5 !== 0 &&
                    (attachedVertex.y + 47) % 5 !== 0
                  ) {
                    possibleMoves.add(attachedVertex)
                    break
                  }
                } else {
                  // cell.x = 2
                  if (
                    attachedVertex.x === 0 &&
                    (cell.y + 48) % 5 !== 0 &&
                    (cell.y + 47) % 5 !== 0
                  ) {
                    possibleMoves.add(attachedVertex)
                    break
                  }
                }
              }
            }
          }
        }
      }

      // cycles for center and outer ring
      if (cell.x === 1) {
        // counter clockwise check
        let counter = 30
        if (possibleMoves.has(board[cell.x][(cell.y + 2) % 30])) {
          counter = 4
        }

        while (counter < 28) {
          const currVertex = board[cell.x][(cell.y + counter) % 30]
          if (currVertex.piece === null) {
            possibleMoves.add(currVertex)
          } else {
            if (currVertex.piece.color !== cell.piece?.color) {
              possibleMoves.add(currVertex)
            }
            break
          }
          counter += 2
        }

        if (possibleMoves.has(board[cell.x][(cell.y + 28) % 30])) {
          counter = 4
        } else {
          counter = 30
        }
        // clockwise check
        if (counter < 28) {
          while (counter < 28) {
            const currVertex = board[cell.x][(cell.y - counter + 30) % 30]
            if (possibleMoves.has(currVertex)) {
              break
            }

            if (currVertex.piece === null) {
              possibleMoves.add(currVertex)
            } else {
              if (currVertex.piece.color !== cell.piece?.color) {
                possibleMoves.add(currVertex)
              }
              break
            }
            counter += 2
          }
        }
      } else if (cell.x === 2) {
        // counter clockwise check
        let counter = 50
        if (possibleMoves.has(board[cell.x][(cell.y + 2) % 50])) {
          counter = 4
        }

        while (counter < 48) {
          const currVertex = board[cell.x][(cell.y + counter) % 50]
          if (currVertex.piece === null) {
            possibleMoves.add(currVertex)
          } else {
            if (currVertex.piece.color !== cell.piece?.color) {
              possibleMoves.add(currVertex)
            }
            break
          }
          counter += 2
        }

        if (possibleMoves.has(board[cell.x][(cell.y + 48) % 50])) {
          counter = 4
        } else {
          counter = 50
        }

        // clockwise check
        if (counter < 48) {
          while (counter < 48) {
            const currVertex = board[cell.x][(cell.y - counter + 50) % 50]
            if (possibleMoves.has(currVertex)) {
              break
            }

            if (currVertex.piece === null) {
              possibleMoves.add(currVertex)
            } else {
              if (currVertex.piece.color !== cell.piece?.color) {
                possibleMoves.add(currVertex)
              }
              break
            }
            counter += 2
          }
        }
      }
      break
    }
    case "king": {
      // Need to prevent moves that put the king in danger (for demo this is good enough though) - Karl
      const edges = getEdgeList(cell.edges)
      
      for (const edge of edges) {
        if (edge.piece === null || edge.piece.color != cell.piece.color) {
          possibleMoves.add(edge)
        }
      }
      for (const vertex of cell.vertices) {
        if (vertex.color == cell.color) {
          if (vertex.piece != null) {
            if (vertex.piece.color != cell.piece.color) {
              possibleMoves.add(vertex)
            }
          } else possibleMoves.add(vertex)
        }
      }
      break
    }
    case "berolina-pawn-cw": {
      for (const vertex of cell.vertices) {
        if (vertex.color === cell.color && vertex.piece === null) {
          if (cell.x === 2) {
            if (cell.x === vertex.x) {
              if ((cell.y + 2) % 50 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else possibleMoves.add(vertex)
          } else if (cell.x === 1) {
            if (cell.x === vertex.x) {
              if ((cell.y + 2) % 30 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else possibleMoves.add(vertex)
          } else {
            if (cell.x === vertex.x) {
              if ((cell.y + 2) % 10 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else possibleMoves.add(vertex)
          }
        }
      }

      if (cell.edges.inout !== null) {
        const edge = cell.edges.inout
        if (edge.piece !== null && edge.piece.color !== cell.piece.color) {
          possibleMoves.add(edge)
        }
      }

      const edge = cell.edges.prev as Cell
      if (edge.piece !== null && edge.piece.color !== cell.piece.color) {
        possibleMoves.add(edge)
      }

      break
    }
    case "berolina-pawn-ccw": {
      for (const vertex of cell.vertices) {
        if (vertex.color === cell.color && vertex.piece === null) {
          if (cell.x === 2) {
            if (cell.x === vertex.x) {
              if ((cell.y + 48) % 50 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else possibleMoves.add(vertex)
          } else if (cell.x === 1) {
            if (cell.x === vertex.x) {
              if ((cell.y + 28) % 30 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else possibleMoves.add(vertex)
          } else {
            if (cell.x === vertex.x) {
              if ((cell.y + 8) % 10 !== vertex.y) {
                possibleMoves.add(vertex)
              }
            } else possibleMoves.add(vertex)
          }
        }
      }

      if (cell.edges.inout !== null) {
        const edge = cell.edges.inout
        if (edge.piece !== null && edge.piece.color !== cell.piece.color) {
          possibleMoves.add(edge)
        }
      }

      const edge = cell.edges.next as Cell
      if (edge.piece !== null && edge.piece.color !== cell.piece.color) {
        possibleMoves.add(edge)
      }

      break
    }
    case "pawn-cw": {
      // cell.edges.next = ccw direction, cell.edges.prev = cw direction
      // TODO: implement first Move
      // if (cell.piece.firstMove) {
      //   // stuff
      //   cell.piece.firstMove = false
      // } else { stuff below
      // }

      if (cell.edges.inout !== null) {
        const edge = cell.edges.inout
        if (edge.piece === null) {
          possibleMoves.add(edge)
        }
      }

      const edge = cell.edges.prev as Cell
      if (edge.piece === null) {
        possibleMoves.add(edge)
      }

      for (const vertex of cell.vertices) {
        if (vertex.color === cell.color && vertex.piece !== null) {
          if (vertex.piece.color !== cell.piece.color) {
            if (cell.x === 2) {
              if (cell.x === vertex.x) {
                if ((cell.y + 2) % 50 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else possibleMoves.add(vertex)
            } else if (cell.x === 1) {
              if (cell.x === vertex.x) {
                if ((cell.y + 2) % 30 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else possibleMoves.add(vertex)
            } else {
              if (cell.x === vertex.x) {
                if ((cell.y + 2) % 10 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else possibleMoves.add(vertex)
            }
          }
        }
      }

      break
    }
    case "pawn-ccw": {
      // cell.edges.next = ccw direction, cell.edges.prev = cw direction
      // TODO: implement first Move
      // if (cell.piece.firstMove) {
      //   // stuff
      //   cell.piece.firstMove = false
      // } else { stuff below
      // }

      if (cell.edges.inout !== null) {
        const edge = cell.edges.inout
        if (edge.piece === null) {
          possibleMoves.add(edge)
        }
      }

      const edge = cell.edges.next as Cell
      if (edge.piece === null) {
        possibleMoves.add(edge)
      }

      for (const vertex of cell.vertices) {
        if (vertex.color === cell.color && vertex.piece !== null) {
          if (vertex.piece.color !== cell.piece.color) {
            if (cell.x === 2) {
              if (cell.x === vertex.x) {
                if ((cell.y + 48) % 50 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else possibleMoves.add(vertex)
            } else if (cell.x === 1) {
              if (cell.x === vertex.x) {
                if ((cell.y + 28) % 30 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else possibleMoves.add(vertex)
            } else {
              if (cell.x === vertex.x) {
                if ((cell.y + 8) % 10 !== vertex.y) {
                  possibleMoves.add(vertex)
                }
              } else possibleMoves.add(vertex)
            }
          }
        }
      }

      break
    }
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
