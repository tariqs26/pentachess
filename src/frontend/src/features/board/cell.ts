import { DECAGON_SIDES, RING_SIZES } from "@/features/board/constants"
import type { Board, Cell } from "./types"

function getReverseMidOutEdges() {
  let midX = 0
  let outY = 1
  let countX = 2
  let countY = 2

  const midOutEdges: { [key: number]: number } = { 0: 1 }

  for (let i = 0; i < 19; i++) {
    midOutEdges[midX + countX] = outY + countY

    midX += countX
    outY += countY

    countX = countX === 2 ? 1 : 2
    countY = countY === 2 ? 3 : 2
  }

  const reverseMidOutEdges: { [key: number]: number } = {}
  for (const key in midOutEdges) {
    reverseMidOutEdges[midOutEdges[key]] = Number(key)
  }
  return [midOutEdges, reverseMidOutEdges]
}

const [MID_OUT_EDGES, REVERSE_MID_OUT_EDGES] = getReverseMidOutEdges()

export function cellId(x: number, y: number): string {
  return `${"CBA"[x]}${y}`
}

export function cellCoords(id: string): [number, number] {
  return [id.charCodeAt(0) - 65, Number.parseInt(id.slice(1))]
}

export function makeCell(x: number, y: number, angle: number): Cell {
  const id = cellId(x, y)
  const color = y % 2 === 0 ? "b" : "w"
  const edges = {
    next: null,
    prev: null,
    inout: null
  }
  const side = Math.floor(y / (RING_SIZES[x] / DECAGON_SIDES))

  return { id, color, x, y, side, angle, piece: null, edges, vertices: [] }
}

export function setCellEdges({ x, y, edges}: Cell, board: Board) {

  // edges - [front, back, side(if exists)]
  if (x === 0) {
    // inner ring
    edges.next = board[x][(y + 1) % 10]
    edges.prev = board[x][(y + 9) % 10]
    edges.inout = board[x + 1][3 * y + 1]
  } else if (x === 1) {
    // middle ring
    edges.next = board[x][(y + 1) % 30]
    edges.prev = board[x][(y + 29) % 30]

    if ((y - 1) % 3 === 0) {
      edges.inout = board[x - 1][Math.floor((y - 1) / 3)]
    } else {
      edges.inout = board[x + 1][MID_OUT_EDGES[y]]
    }
  } else {
    // outer ring
    edges.next = board[x][(y + 1) % 50]
    edges.prev = board[x][(y + 49) % 50]

    const possibleEdge = REVERSE_MID_OUT_EDGES[y]
    if (possibleEdge !== undefined) {
      edges.inout = board[x - 1][possibleEdge]
    }
  }

}

export function setCellVertices({ x, y, edges, vertices }: Cell, board: Board) {
  // iterate through the edges and collect the vertices based on the rules
  const edgeList = [edges.next as Cell, edges.prev as Cell]
  if (edges.inout !== null) {
    edgeList.push(edges.inout)
  }
  for (const edge of edgeList) {
    const edgeEdgeList = [edge.edges.next as Cell, edge.edges.prev as Cell]
    if (edge.edges.inout !== null) {
      edgeEdgeList.push(edge.edges.inout)
    }
    for (const edgeEdge of edgeEdgeList) {
      if (!(edgeEdge.x === x && edgeEdge.y === y)) {
        vertices.push(edgeEdge)
      }
    }
  }

  if (x === 0) {
    let i = 3
    for (let _ = 0; _ < 5; _++) {
      vertices.push(board[0][(y + i) % 10])
      vertices.push(board[0][(y + i) % 10])
      i += 1
    }
    vertices.push(board[1][(vertices[3].y + 1) % 30])
    vertices.push(board[1][(vertices[4].y + 1) % 30])
    vertices.push(board[1][(vertices[3].y + 1) % 30])
    vertices.push(board[1][(vertices[4].y + 1) % 30])
  }

  if (x === 1) {
    if (y % 3 === 0) {
      vertices.push(board[x][(y + 28) % 30].edges.inout as Cell)

      let tmp = board[x][(y + 29) % 30].edges.inout as Cell
      vertices.push(board[tmp.x][(tmp.y + 1) % 50])

      tmp = board[x][(y + 29) % 30].edges.inout as Cell
      vertices.push(board[tmp.x][(tmp.y + 5) % 50])
    } else if ((y - 1) % 3 === 0) {
      vertices.push(board[1][(y + 3) % 30])
      vertices.push(board[1][(y + 27) % 30])
      vertices.push(board[1][(y + 3) % 30])
      vertices.push(board[1][(y + 27) % 30])

      const tmp = board[x][(y + 1) % 30].edges.inout as Cell
      vertices.push(board[tmp.x][(tmp.y + 29) % 30])
    } else {
      vertices.push(board[x][(y + 2) % 30].edges.inout as Cell)
      vertices.push(board[x][(y + 28) % 30].edges.inout as Cell)

      const tmp = board[x][(y + 28) % 30].edges.inout as Cell
      vertices.push(board[tmp.x][(tmp.y + 4) % 50])
    }
  }

  if (x === 2) {
    if (y % 5 === 0) {
      vertices.push(board[x][(y + 48) % 50].edges.inout as Cell)
    } else if ((y - 1) % 5 === 0) {
      vertices.push(board[x][(y + 47) % 50])
      vertices.push(board[x][(y + 2) % 50].edges.inout as Cell)
    } else if ((y - 2) % 5 === 0) {
      const tmp = board[x][(y + 1) % 50].edges.inout as Cell
      vertices.push(board[tmp.x][(tmp.y + 29) % 30])
    } else if ((y - 3) % 5 === 0) {
      vertices.push(board[x][(y + 3) % 50])
      vertices.push(board[x][(y + 48) % 50].edges.inout as Cell)
    } else {
      vertices.push(board[x][(y + 2) % 50].edges.inout as Cell)
    }
  }
}

export function cloneCell(cell: Cell): Cell {
  return { ...cell, edges: {...cell.edges}, vertices: [...cell.vertices] }
}
