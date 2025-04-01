import {
  makePiece,
  canPromote,
  getPossibleMoves,
  getInvalidMoves,
} from "@/features/piece/utils"
import type { PieceType } from "@/features/piece/types"
import { describe, it, expect } from "vitest"
import kingW from "/public/pieces/king-w.png"
import rookB from "/public/pieces/rook-b.png"
import queenW from "/public/pieces/queen-w.png"
import pawnBCcw from "/public/pieces/pawn-b-ccw.png"
import { initializeBoard } from "@/features/board/utils"

describe("makePiece", () => {
  it("should create a white king with correct properties", () => {
    const piece = makePiece("king", "w")
    const actualPiece = {
      type: "king",
      abbr: "K",
      color: "w",
      value: 9999,
      image: kingW,
      hasMoved: false,
      canPromote: true
    }
    expect(piece).toEqual(actualPiece)
  })

  it("should create a black rook with correct properties", () => {
    const piece = makePiece("rook", "b")
    const actualPiece = {
      type: "rook",
      abbr: "R",
      color: "b",
      value: 5,
      image: rookB,
      hasMoved: false,
      canPromote: true
    }
    expect(piece).toEqual(actualPiece)
  })

  it("should create a white queen with correct properties", () => {
    const piece = makePiece("queen", "w")
    const actualPiece = {
      type: "queen",
      abbr: "Q",
      color: "w",
      value: 9,
      image: queenW,
      hasMoved: false,
      canPromote: true
    }
    expect(piece).toEqual(actualPiece)
  })

  it("should create a black pawn with correct properties", () => {
    const piece = makePiece("pawn-ccw", "b")
    const actualPiece = {
      type: "pawn-ccw",
      abbr: "P",
      color: "b",
      value: 1,
      image: pawnBCcw,
      hasMoved: false,
      canPromote: true
    }
    expect(piece).toEqual(actualPiece)
  })
})

describe("canPromote", () => {
  it("should return true for white pawns at promotion squares", () => {
    const pawns: PieceType[] = [
      "pawn-cw",
      "pawn-ccw",
      "berolina-pawn-cw",
      "berolina-pawn-ccw",
    ]

    for (let y = 25; y <= 32; y++) {
      pawns.forEach((type) => {
        const piece = makePiece(type, "w")
        expect(canPromote(piece, { x: 2, y })).toBe(true)
      })
    }
  })

  it("should return true for black pawns at promotion squares", () => {
    const pawns: PieceType[] = [
      "pawn-cw",
      "pawn-ccw",
      "berolina-pawn-cw",
      "berolina-pawn-ccw",
    ]

    for (let y = 0; y <= 7; y++) {
      pawns.forEach((type) => {
        const piece = makePiece(type, "b")
        expect(canPromote(piece, { x: 2, y })).toBe(true)
      })
    }
  })

  it("should return false for any other black piece at promotion squares", () => {
    const pieces: PieceType[] = ["king", "queen", "rook", "bishop", "knight"]

    for (let y = 0; y <= 7; y++) {
      pieces.forEach((type) => {
        const piece = makePiece(type, "b")
        expect(canPromote(piece, { x: 2, y })).toBe(false)
      })
    }
  })

  it("should return false for any other white piece at promotion squares", () => {
    const pieces: PieceType[] = ["king", "queen", "rook", "bishop", "knight"]

    for (let y = 25; y <= 32; y++) {
      pieces.forEach((type) => {
        const piece = makePiece(type, "w")
        expect(canPromote(piece, { x: 2, y })).toBe(false)
      })
    }
  })
})

describe("getPossibleMoves", () => {
  it("should return set of moves for a pawn", () => {
    const board = initializeBoard()

    expect(getPossibleMoves(board[1][0], board)).toEqual(new Set([board[0][9]]))
    expect(getPossibleMoves(board[2][48], board)).toEqual(
      new Set([board[2][46], board[2][47]])
    )

    expect(getPossibleMoves(board[1][19], board)).toEqual(
      new Set([board[1][20], board[1][21]])
    )
    expect(getPossibleMoves(board[2][24], board)).toEqual(
      new Set([board[2][22]])
    )
  })

  it("should return set of moves for a bishop", () => {
    const board = initializeBoard()

    expect(getPossibleMoves(board[2][0], board)).toEqual(
      new Set([board[1][28]])
    )

    expect(getPossibleMoves(board[2][25], board)).toEqual(
      new Set([board[1][13]])
    )
  })

  it("should return empty set for empty cell", () => {
    const board = initializeBoard()

    for (let ring = 0; ring < 3; ring++) {
      for (let cell = 0; cell < 3; cell++) {
        if (board[ring][cell].piece === null) {
          expect(getPossibleMoves(board[ring][cell], board)).toEqual(new Set())
        }
      }
    }
  })

  it("should return empty set for pieces that are blocked", () => {
    const board = initializeBoard()

    for (let ring = 1; ring < 3; ring++) {
      for (let cell = 0; cell < 3; cell++) {
        if (
          ring == 2 &&
          ((1 <= cell && cell <= 6) || (26 <= cell && cell <= 31))
        ) {
          expect(getPossibleMoves(board[ring][cell], board)).toEqual(new Set())
        }
        if (
          ring == 1 &&
          ((1 <= cell && cell <= 2) || (16 <= cell && cell <= 17))
        ) {
          expect(getPossibleMoves(board[ring][cell], board)).toEqual(new Set())
        }
      }
    }
  })
})

describe("getInvalidMoves", () => {
  it("should return empty set when cell is empty", () => {
    const board = initializeBoard()

    for (let ring = 0; ring < 3; ring++) {
      for (let cell = 0; cell < 3; cell++) {
        if (board[ring][cell].piece === null) {
          expect(
            getInvalidMoves(
              board[ring][cell],
              board,
              getPossibleMoves(board[ring][cell], board)
            )
          ).toEqual(new Set())
        }
      }
    }
  })

  it("should return empty set for pieces that are blocked", () => {
    const board = initializeBoard()

    for (let ring = 1; ring < 3; ring++) {
      for (let cell = 0; cell < 3; cell++) {
        if (
          ring == 2 &&
          ((1 <= cell && cell <= 6) || (26 <= cell && cell <= 31))
        ) {
          expect(
            getInvalidMoves(
              board[ring][cell],
              board,
              getPossibleMoves(board[ring][cell], board)
            )
          ).toEqual(new Set())
        }
        if (
          ring == 1 &&
          ((1 <= cell && cell <= 2) || (16 <= cell && cell <= 17))
        ) {
          expect(
            getInvalidMoves(
              board[ring][cell],
              board,
              getPossibleMoves(board[ring][cell], board)
            )
          ).toEqual(new Set())
        }
      }
    }
  })

  it("should return set of invalid moves for checkmate", () => {
    const board = initializeBoard()

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].piece = null
      }
    }

    board[2][9].piece = makePiece("queen", "b")
    board[2][4].piece = makePiece("king", "b")
    board[2][29].piece = makePiece("king", "w")
    board[1][5].piece = makePiece("rook", "b")
    board[2][40].piece = makePiece("pawn-cw", "w")

    expect(
      getInvalidMoves(
        board[2][29],
        board,
        getPossibleMoves(board[2][29], board)
      )
    ).toEqual(
      new Set([
        board[2][30],
        board[2][31],
        board[2][28],
        board[2][27],
        board[1][17],
      ])
    )
  })

  it("should return empty set for pieces that only have valid moves", () => {
    const board = initializeBoard()

    expect(
      getInvalidMoves(board[2][0], board, getPossibleMoves(board[2][0], board))
    ).toEqual(new Set())
    expect(
      getInvalidMoves(
        board[2][25],
        board,
        getPossibleMoves(board[2][25], board)
      )
    ).toEqual(new Set())
    expect(
      getInvalidMoves(board[1][0], board, getPossibleMoves(board[1][0], board))
    ).toEqual(new Set())
    expect(
      getInvalidMoves(
        board[2][48],
        board,
        getPossibleMoves(board[2][48], board)
      )
    ).toEqual(new Set())
    expect(
      getInvalidMoves(
        board[1][19],
        board,
        getPossibleMoves(board[1][19], board)
      )
    ).toEqual(new Set())
    expect(
      getInvalidMoves(
        board[2][24],
        board,
        getPossibleMoves(board[2][24], board)
      )
    ).toEqual(new Set())
  })
})
