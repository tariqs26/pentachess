import { DECAGON_SIDES, RING_SIZES } from "./constants"
import type { Board, Cell } from "./types"

export const cellId = (x: number, y: number) => `${"cba"[x]}${y}`

export const createCell = (x: number, y: number, angle: number): Cell => {
  const id = cellId(x, y)
  const color = y % 2 === 0 ? "b" : "w"
  const side = Math.floor(y / (RING_SIZES[x] / DECAGON_SIDES))

  return { id, color, x, y, side, angle, piece: null, edges: [], vertices: [] }
}

export const setCellEdges = ({ x, y, edges }: Cell) => {
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

export const setCellVertices = (
  { x, y, edges, vertices }: Cell,
  board: Board
) => {
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

export const cloneCell = (cell: Cell): Cell => ({
  ...cell,
  edges: cell.edges.map((edge) => [...edge]),
  vertices: cell.vertices.map((vertex) => [...vertex]),
})

export const getSideEdge = (cell: Cell, board: Board) =>
  board[cell.edges[2][0]][cell.edges[2][1]]

export const getCWEdge = (cell: Cell, board: Board) =>
  board[cell.edges[1][0]][cell.edges[1][1]]

export const getCCWEdge = (cell: Cell, board: Board) =>
  board[cell.edges[0][0]][cell.edges[0][1]]

export const cellRotation = (cell: Cell) => {
  if (cell.x === 0) return cell.y % 2 === 0 ? -70.5 : -109
  if (cell.side % 2 !== 0) return cell.y % 2 === 0 ? -73.5 : -109.5
  return cell.y % 2 === 0 ? -109.5 : -73.5
}

export const cellMarginLeft = (cell: Cell) => {
  // key = the ith cell in the side, value = margin value
  const leftMarginsForRing1 = { 0: -70, 1: -69, 2: -69.5 }
  const leftMarginsForRing2 = { 0: -70, 1: -69, 2: -69.5, 3: -69, 4: -69.5 }

  if (cell.x === 1) {
    const ithCell = (cell.y - cell.side * 3) as keyof typeof leftMarginsForRing1
    return leftMarginsForRing1[ithCell]
  }

  if (cell.x === 2) {
    const ithCell = (cell.y - cell.side * 5) as keyof typeof leftMarginsForRing2
    return leftMarginsForRing2[ithCell]
  }
  // default margins for ring 0
  return cell.side % 2 !== 0 ? -70.1 : -70.5
}

export const cellMarginTop = (cell: Cell) => {
  // key = the ith cell in the side, value = margin value
  const topMarginsForRing1 = { 0: 0, 1: 4.5, 2: -1.5 }
  const topMarginsForRing2 = { 0: 0, 1: 4.5, 2: -1.6, 3: 2.9, 4: -3.2 }

  if (cell.x === 1) {
    const ithCell = (cell.y - cell.side * 3) as keyof typeof topMarginsForRing1
    return topMarginsForRing1[ithCell]
  }

  if (cell.x === 2) {
    const ithCell = (cell.y - cell.side * 5) as keyof typeof topMarginsForRing2
    return topMarginsForRing2[ithCell]
  }

  // default margins for ring 0
  return cell.side % 2 !== 0 ? -30 : -10
}
