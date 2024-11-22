import type { Board, Cell } from "../board/types"
import { cloneBoard } from "../board/utils"
import { PIECE_DATA } from "./constants"
import type { Piece, PieceColor, PieceType } from "./types"

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
  if (cell.piece == null) return new Set<Cell>()

  let possibleMoves: Set<Cell> = new Set<Cell>()

  switch (cell.piece.type) {
    case "knight": {
      for (const vertex of cell.vertices) {
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
        board
      )
      possibleMoves = possibleMoves.union(rookMoves)
      // get bishop moves
      const bishopMoves = getPossibleMoves(
        { ...cell, piece: makePiece("bishop", cell.piece.color) },
        board
      )
      possibleMoves = possibleMoves.union(bishopMoves)
      break
    }
    case "rook": {
      if (cell.edges.length == 3) {
        const tempCell = cell.edges[2]
        if (tempCell.piece != null) {
          if (tempCell.piece.color != cell.piece.color) {
            possibleMoves.add(tempCell)
          }
        } else possibleMoves.add(tempCell)
      }
      let tempCell: Cell
      for (let i = 0; i < 2; i++) {
        if (i == 0) tempCell = cell.edges[0]
        else tempCell = cell.edges[1]
        while (tempCell != cell) {
          if (tempCell.piece != null) {
            if (tempCell.piece.color != cell.piece.color) {
              possibleMoves.add(tempCell)
            }
            break
          } else possibleMoves.add(tempCell)
          if (i == 0)
            tempCell = tempCell.edges[0]
          else tempCell = tempCell.edges[1]
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
          const currentCell = board[cell.x][(cell.y + counter) % 30]
          if (currentCell.piece === null) {
            possibleMoves.add(currentCell)
          } else {
            if (currentCell.piece.color !== cell.piece?.color) {
              possibleMoves.add(currentCell)
            }
            break
          }
          counter += 2
        }

        // clockwise check
        if (counter < 28) {
          if (possibleMoves.has(board[cell.x][(cell.y - 2 + 30) % 30])) {
            counter = 4
          } else {
            counter = 30
          }

          while (counter < 28) {
            const currentCell = board[cell.x][(cell.y - counter + 30) % 30]
            if (possibleMoves.has(currentCell)) {
              break
            }

            if (currentCell.piece === null) {
              possibleMoves.add(currentCell)
            } else {
              if (currentCell.piece.color !== cell.piece?.color) {
                possibleMoves.add(currentCell)
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
          const currentCell = board[cell.x][(cell.y + counter) % 50]
          if (currentCell.piece === null) {
            possibleMoves.add(currentCell)
          } else {
            if (currentCell.piece.color !== cell.piece?.color) {
              possibleMoves.add(currentCell)
            }
            break
          }
          counter += 2
        }

        // clockwise check
        if (counter < 48) {
          if (possibleMoves.has(board[cell.x][(cell.y - 2 + 50) % 50])) {
            counter = 4
          } else {
            counter = 50
          }

          while (counter < 48) {
            const currentCell = board[cell.x][(cell.y - counter + 50) % 50]
            if (possibleMoves.has(currentCell)) {
              break
            }

            if (currentCell.piece === null) {
              possibleMoves.add(currentCell)
            } else {
              if (currentCell.piece.color !== cell.piece?.color) {
                possibleMoves.add(currentCell)
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
      for (const tempCell of cell.edges) {
        if (tempCell.piece != null) {
          if (tempCell.piece.color != cell.piece.color) {
            possibleMoves.add(tempCell)
          }
        } else possibleMoves.add(tempCell)
      }
      for (const tempCell of cell.vertices) {
        if (tempCell.color == cell.color) {
          if (tempCell.piece != null) {
            if (tempCell.piece.color != cell.piece.color) {
              possibleMoves.add(tempCell)
            }
          } else possibleMoves.add(tempCell)
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

      if (cell.edges.length === 3) {
        const curr_edge = cell.edges[2]
        if (curr_edge.piece !== null) {
          if (curr_edge.piece.color !== cell.piece.color) {
            possibleMoves.add(curr_edge)
          }
        }
      }

      const curr_edge = cell.edges[1]
      if (curr_edge.piece !== null) {
        if (curr_edge.piece.color !== cell.piece.color) {
          possibleMoves.add(curr_edge)
        }
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

      if (cell.edges.length === 3) {
        const currEdge = cell.edges[2]
        if (currEdge.piece !== null) {
          if (currEdge.piece.color !== cell.piece.color) {
            possibleMoves.add(currEdge)
          }
        }
      }

      const curr_edge = cell.edges[0]
      if (curr_edge.piece !== null) {
        if (curr_edge.piece.color !== cell.piece.color) {
          possibleMoves.add(curr_edge)
        }
      }

      break
    }
    case "pawn-cw": {
      // cell.edges[0] = ccw direction, cell.edges[1] = cw direction
      // TODO: implement first Move
      // if (cell.piece.firstMove) {
      //   // stuff
      //   cell.piece.firstMove = false
      // } else { stuff below
      // }

      if (cell.edges.length === 3) {
        const curr_edge = cell.edges[2]
        if (curr_edge.piece === null) {
          possibleMoves.add(curr_edge)
        }
      }

      const curr_edge = cell.edges[1]
      if (curr_edge.piece === null) {
        possibleMoves.add(curr_edge)
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
      // cell.edges[0] = ccw direction, cell.edges[1] = cw direction
      // TODO: implement first Move
      // if (cell.piece.firstMove) {
      //   // stuff
      //   cell.piece.firstMove = false
      // } else { stuff below
      // }

      if (cell.edges.length === 3) {
        const curr_edge = cell.edges[2]
        if (curr_edge.piece === null) {
          possibleMoves.add(curr_edge)
        }
      }

      const curr_edge = cell.edges[0]
      if (curr_edge.piece === null) {
        possibleMoves.add(curr_edge)
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
