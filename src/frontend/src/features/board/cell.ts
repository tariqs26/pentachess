import { DECAGON_SIDES, RING_SIZES } from "@/features/board/constants"
import type { Board, Cell } from "./types"

export function cellId(x: number, y: number) {
  return `${"cba"[x]}${y}`
}

export function makeCell(x: number, y: number, angle: number): Cell {
  const id = cellId(x, y)
  const color = y % 2 === 0 ? "b" : "w"
  const side = Math.floor(y / (RING_SIZES[x] / DECAGON_SIDES))

  return { id, color, x, y, side, angle, piece: null, edges: [], vertices: [] }
}

export function setCellEdges({ x, y, edges }: Cell) {
  // saved in the form of [next (ccw), prev (cw), side]
  if (x === 0) {
    // inner ring - only 1 type of cell
    // type 1 inner edges
    edges.push([x, (y + 1) % 10])
    edges.push([x, (y + 9) % 10])
    // type 1 middle edges
    edges.push([x + 1, (3 * (y + 1)) % 30])
  } else if (x === 1) {
    // middle ring - type 1: y = 3k, type 2: y = 3k + 1, type 3: y = 3k + 2
    // type 1, 2, or 3 middle edges
    edges.push([x, (y + 1) % 30])
    edges.push([x, (y + 29) % 30])
    if (y % 3 === 0) {
      // type 1 inner edges
      edges.push([x - 1, (y / 3 - 1 + 10) % 10])
    } else if ((y - 1) % 3 === 0) {
      // type 2 outer edges
      edges.push([x + 1, ((5 * y + 1) / 3) % 50])
    } else {
      // type 3 outer edges
      edges.push([x + 1, ((5 * y + 5) / 3) % 50])
    }
  } else {
    // outer ring - type 1: y = 5k, type 2: y = 5k + 1, type 3: y = 5k + 2, type 4: y = 5k + 3, type 5: y = 5k + 4
    // type 1, 2, 3, 4, or 5 outer edges
    edges.push([x, (y + 1) % 50])
    edges.push([x, (y + 49) % 50])
    if (y % 5 === 0) {
      // type 1 middle edges
      edges.push([x - 1, ((3 * y - 5) / 5 + 30) % 30])
    } else if ((y - 2) % 5 === 0) {
      // type 3 middle edges
      edges.push([x - 1, ((3 * y - 1) / 5) % 30])
    }
  }
}

export function setCellVertices({ x, y, edges, vertices }: Cell, board: Board) {
  if (x === 0) {
    // inner ring - only 1 type of cell
    // type 1 inner vertices
    for (const i of [2, 3, 4, 5, 6, 7, 8]) {
      vertices.push([x, (y + i) % 10])
    }
    // type 1 middle vertices
    for (const i of [-3, -2, -1, 1, 2, 3]) {
      vertices.push([x + 1, (edges[2][1] + i + 30) % 30])
    }
  } else if (x === 1) {
    // middle ring - type 1: y = 3k, type 2: y = 3k + 1, type 3: y = 3k + 2
    if (y % 3 === 0) {
      // type 1 middle cell middle vertices
      for (const i of [-3, -2, 2, 3]) {
        vertices.push([x, (y + i + 30) % 30])
      }
      // type 1 inner cell inner vertices
      for (const i of [-1, 1]) {
        vertices.push([x - 1, (edges[2][1] + i + 10) % 10])
      }
      // type 1 middle cell outer vertices
      for (const i of [-2, -1, 0]) {
        vertices.push([x + 1, (board[x][edges[0][1]].edges[2][1] + i) % 50])
      }
    } else {
      // type 2 or 3 middle cell middle vertices
      for (const i of [-2, 2]) {
        vertices.push([x, (y + i + 30) % 30])
      }
      // type 2 or 3 middle cell outer vertices
      for (const i of [-2, -1, 1, 2]) {
        vertices.push([x + 1, (edges[2][1] + i + 50) % 50])
      }
      if ((y - 1) % 3 === 0) {
        // type 2 middle cell inner vertices
        vertices.push([x + 1, (edges[2][1] + 3) % 50])
        for (const i of [0, 1]) {
          vertices.push([x - 1, (board[x][edges[1][1]].edges[2][1] + i) % 10])
        }
      } else {
        // type 3 middle cell inner vertices
        vertices.push([x + 1, (edges[2][1] - 3 + 50) % 50])
        for (const i of [-1, 0]) {
          vertices.push([
            x - 1,
            (board[x][edges[0][1]].edges[2][1] + i + 10) % 10,
          ])
        }
      }
    }
    // outer ring - type 1: y = 5k, type 2: y = 5k + 1, type 3: y = 5k + 2, type 4: y = 5k + 3, type 5: y = 5k + 4
  } else if (y % 5 === 0) {
    // type 1 outer vertices
    for (const i of [-3, -2, 2]) {
      vertices.push([x, (y + i + 50) % 50])
    }
    // type 1 middle vertices
    for (const i of [-1, 1, 2]) {
      vertices.push([x - 1, (edges[2][1] + i + 30) % 30])
    }
  } else if ((y - 2) % 5 === 0) {
    // type 3 outer vertices
    for (const i of [-2, 2, 3]) {
      vertices.push([x, (y + i + 50) % 50])
    }
    // type 3 middle vertices
    for (const i of [-2, -1, 1]) {
      vertices.push([x - 1, (edges[2][1] + i + 30) % 30])
    }
  } else {
    // type 2, 4, or 5 outer vertices
    for (const i of [-2, 2]) {
      vertices.push([x, (y + i + 50) % 50])
    }
    if ((y - 1) % 5 === 0) {
      // type 2 middle vertices
      for (const i of [0, 1, 2]) {
        vertices.push([x - 1, (board[x][(y + 49) % 50].edges[2][1] + i) % 30])
      }
    } else if ((y - 3) % 5 === 0) {
      // type 4 middle vertices
      for (const i of [0, 1]) {
        vertices.push([x - 1, (board[x][(y + 49) % 50].edges[2][1] + i) % 30])
      }
    } else {
      // type 5 middle vertices
      for (const i of [-1, 0]) {
        vertices.push([x - 1, (board[x][(y + 1) % 50].edges[2][1] + i) % 30])
      }
    }
  }
}

export function cloneCell(cell: Cell): Cell {
  return {
    ...cell,
    edges: cell.edges.map((edge) => [...edge]),
    vertices: cell.vertices.map((vertex) => [...vertex]),
  }
}
