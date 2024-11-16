import { DECAGON_SIDES, RING_SIZES } from "@/features/board/constants"
import type { Piece } from "@/features/piece/types"
import { Board } from "./types"

function getReverseMidOutEdges() {
  let mid_x = 0
  let out_y = 1
  let count_x = 2
  let count_y = 2

  const midOutEdges: { [key: number]: number } = { 0: 1 }

  for (let i = 0; i < 19; i++) {
    midOutEdges[mid_x + count_x] = out_y + count_y

    mid_x += count_x
    out_y += count_y

    count_x = count_x === 2 ? 1 : 2
    count_y = count_y === 2 ? 3 : 2
  }

  const reverseMidOutEdges: { [key: number]: number } = {}
  for (const key in midOutEdges) {
    reverseMidOutEdges[midOutEdges[key]] = Number(key)
  }
  return [midOutEdges, reverseMidOutEdges]
}

const [MID_OUT_EDGES, REVERSE_MID_OUT_EDGES] = getReverseMidOutEdges()

export class Cell {
  id: string
  color: string
  x: number
  y: number
  side: number
  angle: number
  piece: Piece | null
  edges: Array<[number, number]>
  vertices: Array<[number, number]>

  constructor(ring: number, tile: number, angle: number) {
    this.piece = null
    this.color = tile % 2 === 0 ? "b" : "w" // 'b' for black, 'w' for white
    this.id = `${"ABC"[ring]}${tile}`
    this.side = Math.floor(tile / (RING_SIZES[ring] / DECAGON_SIDES)) + 1
    this.x = ring
    this.y = tile
    this.angle = angle
    this.edges = []
    this.vertices = []

    // edges - [front, back, side(if exists)]
    if (this.x === 0) {
      // inner ring
      this.edges.push([this.x, (this.y + 1) % 10])
      this.edges.push([this.x, (this.y + 9) % 10])
      this.edges.push([this.x + 1, 3 * this.y + 1])
    } else if (this.x === 1) {
      // middle ring
      this.edges.push([this.x, (this.y + 1) % 30])
      this.edges.push([this.x, (this.y + 29) % 30])

      if ((this.y - 1) % 3 === 0) {
        this.edges.push([this.x - 1, Math.floor((this.y - 1) / 3)])
      } else {
        this.edges.push([this.x + 1, MID_OUT_EDGES[this.y]])
      }
    } else {
      // outer ring
      this.edges.push([this.x, (this.y + 1) % 50])
      this.edges.push([this.x, (this.y + 49) % 50])

      const possibleEdge = REVERSE_MID_OUT_EDGES[this.y]
      if (possibleEdge !== undefined) {
        this.edges.push([this.x - 1, possibleEdge])
      }
    }
  }

  setVertices(board: Board) {
    // iterate through the edges and collect the vertices based on the rules
    for (const edge of this.edges) {
      for (const coords of board[edge[0]][edge[1]].edges) {
        if (!(coords[0] === this.x && coords[1] === this.y)) {
          this.vertices.push(coords)
        }
      }
    }

    if (this.x === 0) {
      let i = 3
      for (let _ = 0; _ < 5; _++) {
        this.vertices.push([0, (this.y + i) % 10])
        i += 1
      }
      this.vertices.push([1, (this.vertices[3][1] + 1) % 30])
      this.vertices.push([1, (this.vertices[4][1] + 1) % 30])
    }

    if (this.x === 1) {
      if (this.y % 3 === 0) {
        let tmp = board[this.x][(this.y + 28) % 30].edges[2]
        this.vertices.push([tmp[0], tmp[1]])

        tmp = board[this.x][(this.y + 29) % 30].edges[2]
        this.vertices.push([tmp[0], (tmp[1] + 1) % 50])

        tmp = board[this.x][(this.y + 29) % 30].edges[2]
        this.vertices.push([tmp[0], (tmp[1] + 5) % 50])
      } else if ((this.y - 1) % 3 === 0) {
        this.vertices.push([1, (this.y + 3) % 30])
        this.vertices.push([1, (this.y + 27) % 30])

        const tmp = board[this.x][(this.y + 1) % 30].edges[2]
        this.vertices.push([tmp[0], (tmp[1] + 29) % 30])
      } else {
        let tmp = board[this.x][(this.y + 2) % 30].edges[2]
        this.vertices.push([tmp[0], tmp[1]])

        tmp = board[this.x][(this.y + 28) % 30].edges[2]
        this.vertices.push([tmp[0], tmp[1]])

        tmp = board[this.x][(this.y + 28) % 30].edges[2]
        this.vertices.push([tmp[0], (tmp[1] + 4) % 50])
      }
    }

    if (this.x === 2) {
      if (this.y % 5 === 0) {
        const tmp = board[this.x][(this.y + 48) % 50].edges[2]
        this.vertices.push([tmp[0], tmp[1]])
      } else if ((this.y - 1) % 5 === 0) {
        this.vertices.push([this.x, (this.y + 47) % 50])

        const tmp = board[this.x][(this.y + 2) % 50].edges[2]
        this.vertices.push([tmp[0], tmp[1]])
      } else if ((this.y - 2) % 5 === 0) {
        const tmp = board[this.x][(this.y + 1) % 50].edges[2]
        this.vertices.push([tmp[0], (tmp[1] + 29) % 30])
      } else if ((this.y - 3) % 5 === 0) {
        this.vertices.push([this.x, (this.y + 3) % 50])

        const tmp = board[this.x][(this.y + 48) % 50].edges[2]
        this.vertices.push([tmp[0], tmp[1]])
      } else {
        const tmp = board[this.x][(this.y + 2) % 50].edges[2]
        this.vertices.push([tmp[0], tmp[1]])
      }
    }
  }
}
