import type { Board } from "../board/types"
import type { Cell } from "@/features/board/cell"
import { Piece, PieceColor, PieceType } from "./types"
import { PIECE_DATA } from "./constants"
import { count } from "console"

export function makePiece(type: PieceType, color: PieceColor): Piece {
  return {
    type,
    color,
    value: PIECE_DATA[type].value,
    image: PIECE_DATA[type].image[color],
  }
}

export function removeDups(list: Cell[]): Cell[] {
  return Array.from(new Set(list.map((list) => JSON.stringify(list)))).map(
    (str) => JSON.parse(str)
  )
}

// TODO: Demo MVP
export function getPossibleMoves(cell: Cell, board: Board): Cell[] {
  let possibleMoves: Cell[] = []

  if (cell.piece == null) return []

  let next_cell
  let capt_cell
  let temp_cell

  switch (cell.piece.type) {
    case "knight":
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

    case "queen":
      // Rook Moves
      let rook_swap: Board = board
      rook_swap[cell.x][cell.y].piece = makePiece("rook", cell.piece.color)
      possibleMoves = possibleMoves.concat(
        getPossibleMoves(rook_swap[cell.x][cell.y], rook_swap)
      )
      // Bishop Moves
      let bishop_swap: Board = board
      bishop_swap[cell.x][cell.y].piece = makePiece("bishop", cell.piece.color)
      possibleMoves = possibleMoves.concat(
        getPossibleMoves(bishop_swap[cell.x][cell.y], bishop_swap)
      )
      break

    case "rook":
      if (cell.edges.length == 3) {
        temp_cell = board[cell.edges[2][0]][cell.edges[2][1]]
        if (temp_cell.piece != null) {
          if (temp_cell.piece.color != cell.piece.color) {
            possibleMoves.push(temp_cell)
          }
        } else possibleMoves.push(temp_cell)
      }
      for (let i = 0; i < 2; i++) {
        if (i == 0) temp_cell = board[cell.edges[0][0]][cell.edges[0][1]]
        else temp_cell = board[cell.edges[1][0]][cell.edges[1][1]]
        while (temp_cell != cell) {
          if (temp_cell.piece != null) {
            if (temp_cell.piece.color != cell.piece.color) {
              possibleMoves.push(temp_cell)
            }
            break
          } else possibleMoves.push(temp_cell)
          if (i == 0)
            temp_cell = board[temp_cell.edges[0][0]][temp_cell.edges[0][1]]
          else temp_cell = board[temp_cell.edges[1][0]][temp_cell.edges[1][1]]
        }
      }
      break

    case "bishop":
      for (const [x, y] of cell.vertices) {
        const vertex = board[x][y]
        if (
          vertex.color === cell.color &&
          (vertex.piece?.color !== cell.piece?.color || vertex.piece === null)
        ) {
          possibleMoves.push(vertex)

          if (vertex.angle === cell.angle && vertex.piece === null) {
            for (const [x, y] of vertex.vertices) {
              const attached_vertex = board[x][y]
              if (
                attached_vertex.angle === vertex.angle &&
                attached_vertex.color === vertex.color &&
                (attached_vertex.piece?.color !== cell.piece?.color ||
                  vertex.piece === null) &&
                cell.x !== 1
              ) {
                if (cell.x === 0) {
                  if (
                    attached_vertex.x === 2 &&
                    (attached_vertex.y + 48) % 5 !== 0 &&
                    (attached_vertex.y + 47) % 5 !== 0
                  ) {
                    possibleMoves.push(attached_vertex)
                    break
                  }
                } else {
                  // cell.x = 2
                  if (
                    attached_vertex.x === 0 &&
                    (cell.y + 48) % 5 !== 0 &&
                    (cell.y + 47) % 5 !== 0
                  ) {
                    possibleMoves.push(attached_vertex)
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
          const current_cell = board[cell.x][(cell.y + counter) % 30]
          if (current_cell.piece === null) {
            possibleMoves.push(current_cell)
          } else {
            if (current_cell.piece.color !== cell.piece?.color) {
              possibleMoves.push(current_cell)
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
            const current_cell = board[cell.x][(cell.y - counter + 30) % 30]
            if (possibleMoves.includes(current_cell)) {
              break
            }

            if (current_cell.piece === null) {
              possibleMoves.push(current_cell)
            } else {
              if (current_cell.piece.color !== cell.piece?.color) {
                possibleMoves.push(current_cell)
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
          const current_cell = board[cell.x][(cell.y + counter) % 50]
          if (current_cell.piece === null) {
            possibleMoves.push(current_cell)
          } else {
            if (current_cell.piece.color !== cell.piece?.color) {
              possibleMoves.push(current_cell)
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
            const current_cell = board[cell.x][(cell.y - counter + 50) % 50]
            if (possibleMoves.includes(current_cell)) {
              break
            }

            if (current_cell.piece === null) {
              possibleMoves.push(current_cell)
            } else {
              if (current_cell.piece.color !== cell.piece?.color) {
                possibleMoves.push(current_cell)
              }
              break
            }
            counter += 2
          }
        }
      }
      break

    case "king":
      // Need to prevent moves that put the king in danger (for demo this is good enough though) - Karl
      for (const [x, y] of cell.edges) {
        temp_cell = board[x][y]
        if (temp_cell.piece != null) {
          if (temp_cell.piece.color != cell.piece.color) {
            possibleMoves.push(temp_cell)
          }
        } else possibleMoves.push(temp_cell)
      }
      for (const [x, y] of cell.vertices) {
        temp_cell = board[x][y]
        if (temp_cell.color == cell.color) {
          if (temp_cell.piece != null) {
            if (temp_cell.piece.color != cell.piece.color) {
              possibleMoves.push(temp_cell)
            }
          } else possibleMoves.push(temp_cell)
        }
      }
      break

    case "berolina-pawn-cw":
      // cell.edges[0] = ccw direction, cell.edges[1] = cw direction
      // TODO: implement first Move
      // if (cell.piece.firstMove) {
      //   // stuff
      //   cell.piece.firstMove = false
      // } else { stuff below
      // }
      capt_cell = board[cell.edges[1][0]][cell.edges[1][1]] // coords of next cell in cw direction
      if (capt_cell.piece != null) {
        if (capt_cell.piece.color != cell.piece.color) {
          possibleMoves.push(capt_cell)
        }
      }
      if (cell.edges.length == 3) {
        next_cell = board[cell.edges[2][0]][cell.edges[2][1]] // coords of edge adjacent cell in different decagon
        if (next_cell.piece != null) {
          if (next_cell.piece.color != cell.piece.color) {
            possibleMoves.push(next_cell)
          }
        }
      }
      next_cell = board[cell.x][(cell.y - 2) % board[cell.x].length] // next vertex adjacent cell in the same decagon in the cw direction
      if (next_cell.piece == null) {
        possibleMoves.push(next_cell)
      }
      for (const [x, y] of cell.vertices) {
        // vertex adjacent
        next_cell = board[x][y]
        if (next_cell.x != cell.x) {
          if (next_cell.piece == null) {
            possibleMoves.push(next_cell)
          }
        }
      }
      break

    case "berolina-pawn-ccw":
      // cell.edges[0] = ccw direction, cell.edges[1] = cw direction
      // TODO: implement first Move
      // if (cell.piece.firstMove) {
      //   // stuff
      //   cell.piece.firstMove = false
      // } else { stuff below
      // }
      capt_cell = board[cell.edges[0][0]][cell.edges[0][1]] // coords of next cell in cw direction
      if (capt_cell.piece != null) {
        if (capt_cell.piece.color != cell.piece.color) {
          possibleMoves.push(capt_cell)
        }
      }
      if (cell.edges.length == 3) {
        next_cell = board[cell.edges[2][0]][cell.edges[2][1]] // coords of edge adjacent cell in different decagon
        if (next_cell.piece != null) {
          if (next_cell.piece.color != cell.piece.color) {
            possibleMoves.push(next_cell)
          }
        }
      }
      next_cell = board[cell.x][(cell.y + 2) % board[cell.x].length] // next vertex adjacent cell in the same decagon in the cw direction
      if (next_cell.piece == null) {
        possibleMoves.push(next_cell)
      }
      for (const [x, y] of cell.vertices) {
        // vertex adjacent
        next_cell = board[x][y]
        if (next_cell.x != cell.x) {
          if (next_cell.piece == null) {
            possibleMoves.push(next_cell)
          }
        }
      }
      break

    case "pawn-cw":
      // cell.edges[0] = ccw direction, cell.edges[1] = cw direction
      // TODO: implement first Move
      // if (cell.piece.firstMove) {
      //   // stuff
      //   cell.piece.firstMove = false
      // } else { stuff below
      // }
      next_cell = board[cell.edges[1][0]][cell.edges[1][1]] // coords of next cell in cw direction
      if (next_cell.piece == null) {
        possibleMoves.push(next_cell)
      }
      if (cell.edges.length == 3) {
        next_cell = board[cell.edges[2][0]][cell.edges[2][1]] // coords of edge adjacent cell in different decagon
        if (next_cell.piece == null) {
          possibleMoves.push(next_cell)
        }
      }
      capt_cell = board[cell.x][(cell.y - 2) % board[cell.x].length] // next vertex adjacent cell in the same decagon in the cw direction
      if (capt_cell.piece != null) {
        if (capt_cell.piece.color != cell.piece.color) {
          possibleMoves.push(capt_cell)
        }
      }
      for (const [x, y] of cell.vertices) {
        // vertex adjacent
        capt_cell = board[x][y]
        if (capt_cell.x != cell.x) {
          if (capt_cell.piece != null) {
            if (capt_cell.piece.color != cell.piece.color) {
              possibleMoves.push(capt_cell)
            }
          }
        }
      }
      break

    case "pawn-ccw":
      // cell.edges[0] = ccw direction, cell.edges[1] = cw direction
      // TODO: implement first Move
      // if (cell.piece.firstMove) {
      //   // stuff
      //   cell.piece.firstMove = false
      // } else { stuff below
      // }
      next_cell = board[cell.edges[0][0]][cell.edges[0][1]] // coords of next cell in cw direction
      if (next_cell.piece == null) {
        possibleMoves.push(next_cell)
      }
      if (cell.edges.length == 3) {
        next_cell = board[cell.edges[2][0]][cell.edges[2][1]] // coords of edge adjacent cell in different decagon
        if (next_cell.piece == null) {
          possibleMoves.push(next_cell)
        }
      }
      capt_cell = board[cell.x][(cell.y + 2) % board[cell.x].length] // next vertex adjacent cell in the same decagon in the cw direction
      if (capt_cell.piece != null) {
        if (capt_cell.piece.color != cell.piece.color) {
          possibleMoves.push(capt_cell)
        }
      }
      for (const [x, y] of cell.vertices) {
        // vertex adjacent
        capt_cell = board[x][y]
        if (capt_cell.x != cell.x) {
          if (capt_cell.piece != null) {
            if (capt_cell.piece.color != cell.piece.color) {
              possibleMoves.push(capt_cell)
            }
          }
        }
      }
      break
  }
  return removeDups(possibleMoves)
}

// TODO
export function capturePiece(board: Board, from: Cell, to: Cell) {
  console.info(board, from, to)
}

// TODO
export function promotePawn(board: Board, cell: Cell) {
  console.info(board, cell)
}
