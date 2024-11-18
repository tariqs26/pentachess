import type { Board } from "../board/types"
import type { Cell } from "@/features/board/cell"
import { Piece, PieceColor, PieceType } from "./types"
import { PIECE_DATA } from "./constants"

export function makePiece(type: PieceType, color: PieceColor): Piece {
  return {
    type,
    color,
    value: PIECE_DATA[type].value,
    image: PIECE_DATA[type].image[color],
  }
}

export function removeDuplicates(list: Cell[]): Cell[] {
  const seen = new Set<string>()

  return list.filter((cell) => {
    if (seen.has(cell.id)) return false
    seen.add(cell.id)
    return true
  })
}

// TODO: Demo MVP
export function getPossibleMoves(cell: Cell, board: Board): Cell[] {
  let possibleMoves: Cell[] = []

  if (cell.piece == null) return []

  switch (cell.piece.type) {
    case "knight": {
      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]

        if (
          vertex.color !== cell.color &&
          (vertex.piece?.color !== cell.piece.color || vertex.piece === null)
        ) {
          possibleMoves.push(vertex)
        }
      }
      break
    }
    case "queen": {
      // Rook Moves
      const rookSwap: Board = board
      rookSwap[cell.x][cell.y].piece = makePiece("rook", cell.piece.color)
      possibleMoves = possibleMoves.concat(
        getPossibleMoves(rookSwap[cell.x][cell.y], rookSwap)
      )
      // Bishop Moves
      const bishopSwap: Board = board
      bishopSwap[cell.x][cell.y].piece = makePiece("bishop", cell.piece.color)
      possibleMoves = possibleMoves.concat(
        getPossibleMoves(bishopSwap[cell.x][cell.y], bishopSwap)
      )
      break
    }
    case "rook": {
      if (cell.edges.length == 3) {
        const tempCell = board[cell.edges[2][0]][cell.edges[2][1]]
        if (tempCell.piece != null) {
          if (tempCell.piece.color != cell.piece.color) {
            possibleMoves.push(tempCell)
          }
        } else possibleMoves.push(tempCell)
      }
      let tempCell: Cell
      for (let i = 0; i < 2; i++) {
        if (i == 0) tempCell = board[cell.edges[0][0]][cell.edges[0][1]]
        else tempCell = board[cell.edges[1][0]][cell.edges[1][1]]
        while (tempCell != cell) {
          if (tempCell.piece != null) {
            if (tempCell.piece.color != cell.piece.color) {
              possibleMoves.push(tempCell)
            }
            break
          } else possibleMoves.push(tempCell)
          if (i == 0)
            tempCell = board[tempCell.edges[0][0]][tempCell.edges[0][1]]
          else tempCell = board[tempCell.edges[1][0]][tempCell.edges[1][1]]
        }
      }
      break
    }
    case "bishop": {
      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        if (
          vertex.color === cell.color &&
          (vertex.piece?.color !== cell.piece?.color || vertex.piece === null)
        ) {
          possibleMoves.push(vertex)

          if (vertex.angle === cell.angle && vertex.piece === null) {
            for (const [x, y] of vertex.vertices) {
              const attachedVertex = board[x][y]
              if (
                attachedVertex.angle === vertex.angle &&
                attachedVertex.color === vertex.color &&
                (attachedVertex.piece?.color !== cell.piece?.color ||
                  vertex.piece === null) &&
                cell.x !== 1
              ) {
                if (cell.x === 0) {
                  if (
                    attachedVertex.x === 2 &&
                    (attachedVertex.y + 48) % 5 !== 0 &&
                    (attachedVertex.y + 47) % 5 !== 0
                  ) {
                    possibleMoves.push(attachedVertex)
                    break
                  }
                } else {
                  // cell.x = 2
                  if (
                    attachedVertex.x === 0 &&
                    (cell.y + 48) % 5 !== 0 &&
                    (cell.y + 47) % 5 !== 0
                  ) {
                    possibleMoves.push(attachedVertex)
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
        if (possibleMoves.includes(board[cell.x][(cell.y + 2) % 30])) {
          counter = 4
        }

        while (counter < 28) {
          const currentCell = board[cell.x][(cell.y + counter) % 30]
          if (currentCell.piece === null) {
            possibleMoves.push(currentCell)
          } else {
            if (currentCell.piece.color !== cell.piece?.color) {
              possibleMoves.push(currentCell)
            }
            break
          }
          counter += 2
        }

        // clockwise check
        if (counter < 28) {
          if (possibleMoves.includes(board[cell.x][(cell.y - 2 + 30) % 30])) {
            counter = 4
          } else {
            counter = 30
          }

          while (counter < 28) {
            const currentCell = board[cell.x][(cell.y - counter + 30) % 30]
            if (possibleMoves.includes(currentCell)) {
              break
            }

            if (currentCell.piece === null) {
              possibleMoves.push(currentCell)
            } else {
              if (currentCell.piece.color !== cell.piece?.color) {
                possibleMoves.push(currentCell)
              }
              break
            }
            counter += 2
          }
        }
      } else if (cell.x === 2) {
        // counter clockwise check
        let counter = 50
        if (possibleMoves.includes(board[cell.x][(cell.y + 2) % 50])) {
          counter = 4
        }

        while (counter < 48) {
          const currentCell = board[cell.x][(cell.y + counter) % 50]
          if (currentCell.piece === null) {
            possibleMoves.push(currentCell)
          } else {
            if (currentCell.piece.color !== cell.piece?.color) {
              possibleMoves.push(currentCell)
            }
            break
          }
          counter += 2
        }

        // clockwise check
        if (counter < 48) {
          if (possibleMoves.includes(board[cell.x][(cell.y - 2 + 50) % 50])) {
            counter = 4
          } else {
            counter = 50
          }

          while (counter < 48) {
            const currentCell = board[cell.x][(cell.y - counter + 50) % 50]
            if (possibleMoves.includes(currentCell)) {
              break
            }

            if (currentCell.piece === null) {
              possibleMoves.push(currentCell)
            } else {
              if (currentCell.piece.color !== cell.piece?.color) {
                possibleMoves.push(currentCell)
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
      for (const [x, y] of cell.edges) {
        const tempCell = board[x][y]
        if (tempCell.piece != null) {
          if (tempCell.piece.color != cell.piece.color) {
            possibleMoves.push(tempCell)
          }
        } else possibleMoves.push(tempCell)
      }
      for (const [x, y] of cell.vertices) {
        const tempCell = board[x][y]
        if (tempCell.color == cell.color) {
          if (tempCell.piece != null) {
            if (tempCell.piece.color != cell.piece.color) {
              possibleMoves.push(tempCell)
            }
          } else possibleMoves.push(tempCell)
        }
      }
      break
    }
    case "berolina-pawn-cw": {
      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]

        if (vertex.color === cell.color && vertex.piece === null) {
          if (cell.x === 2) {
            if ((cell.y + 2) % 50 !== vertex.y) {
              possibleMoves.push(vertex)
            }
          } else if (cell.x === 1) {
            if ((cell.y + 2) % 30 !== vertex.y) {
              possibleMoves.push(vertex)
            }
          } else {
            if ((cell.y + 2) % 10 !== vertex.y) {
              possibleMoves.push(vertex)
            }
          }
        }
      }

      if (cell.edges.length === 3) {
        const [x, y] = cell.edges[2]
        const curr_edge = board[x][y]
        if (curr_edge.piece !== null) {
          if (curr_edge.piece.color !== cell.piece.color) {
            possibleMoves.push(curr_edge)
          }
        }
      }

      const [x, y] = cell.edges[1]
      const curr_edge = board[x][y]
      if (curr_edge.piece !== null) {
        if (curr_edge.piece.color !== cell.piece.color) {
          possibleMoves.push(curr_edge)
        }
      }

      break
    }
    case "berolina-pawn-ccw": {
      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]

        if (vertex.color === cell.color && vertex.piece === null) {
          if (cell.x === 2) {
            if ((cell.y + 48) % 50 !== vertex.y) {
              possibleMoves.push(vertex)
            }
          } else if (cell.x === 1) {
            if ((cell.y + 28) % 30 !== vertex.y) {
              possibleMoves.push(vertex)
            }
          } else {
            if ((cell.y + 8) % 10 !== vertex.y) {
              possibleMoves.push(vertex)
            }
          }
        }
      }

      if (cell.edges.length === 3) {
        const [x, y] = cell.edges[2]
        const curr_edge = board[x][y]
        if (curr_edge.piece !== null) {
          if (curr_edge.piece.color !== cell.piece.color) {
            possibleMoves.push(curr_edge)
          }
        }
      }

      const [x, y] = cell.edges[0]
      const curr_edge = board[x][y]
      if (curr_edge.piece !== null) {
        if (curr_edge.piece.color !== cell.piece.color) {
          possibleMoves.push(curr_edge)
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
        const [x, y] = cell.edges[2]
        const curr_edge = board[x][y]
        if (curr_edge.piece === null) {
          possibleMoves.push(curr_edge)
        }
      }

      const [x, y] = cell.edges[1]
      const curr_edge = board[x][y]
      if (curr_edge.piece === null) {
        possibleMoves.push(curr_edge)
      }

      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]

        if (vertex.color === cell.color && vertex.piece !== null) {
          if (vertex.piece.color !== cell.piece.color) {
            if (cell.x === 2) {
              if ((cell.y + 2) % 50 !== vertex.y) {
                possibleMoves.push(vertex)
              }
            } else if (cell.x === 1) {
              if ((cell.y + 2) % 30 !== vertex.y) {
                possibleMoves.push(vertex)
              }
            } else {
              if ((cell.y + 2) % 10 !== vertex.y) {
                possibleMoves.push(vertex)
              }
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
        const [x, y] = cell.edges[2]
        const curr_edge = board[x][y]
        if (curr_edge.piece === null) {
          possibleMoves.push(curr_edge)
        }
      }

      const [x, y] = cell.edges[0]
      const curr_edge = board[x][y]
      if (curr_edge.piece === null) {
        possibleMoves.push(curr_edge)
      }

      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]

        if (vertex.color === cell.color && vertex.piece !== null) {
          if (vertex.piece.color !== cell.piece.color) {
            if (cell.x === 2) {
              if ((cell.y + 48) % 50 !== vertex.y) {
                possibleMoves.push(vertex)
              }
            } else if (cell.x === 1) {
              if ((cell.y + 28) % 30 !== vertex.y) {
                possibleMoves.push(vertex)
              }
            } else {
              if ((cell.y + 8) % 10 !== vertex.y) {
                possibleMoves.push(vertex)
              }
            }
          }
        }
      }

      break
    }
  }
  return removeDuplicates(possibleMoves)
}

// TODO
export function capturePiece(board: Board, from: Cell, to: Cell) {
  console.info(board, from, to)
}

// TODO
export function promotePawn(board: Board, cell: Cell) {
  console.info(board, cell)
}
