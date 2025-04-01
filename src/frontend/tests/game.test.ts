import { describe, expect, it, beforeEach, vi } from "vitest"
import {
  createGameState,
  getNewStatus,
  moveHelper,
  displayTimeRemaining,
  isGameOver,
  createMove,
} from "@/features/game/utils"
import { gameReducer } from "@/features/game/reducer"
import type { Board } from "@/features/board/types"
import { getInvalidMoves } from "@/features/piece/utils"
import { getPossibleMoves, makePiece } from "@/features/piece/utils"
import type {
  GameState,
  Move,
  GameAction,
  Player,
  GameStatus,
} from "@/features/game/types"
import { initializeBoard } from "@/features/board/utils"
import { makeCell } from "@/features/board/cell"

const TEST_DATE = new Date("2025-01-01T00:00:00.000Z")

describe("createGameState", () => {
  it("should create a game state with the correct initial values", () => {
    const gameState = createGameState()
    expect(gameState).toEqual({
      player: { id: "1", color: "w", userId: "1", username: "Player 1" },
      opponent: { id: "2", color: "b", userId: "2", username: "Player 2" },
      turn: "w",
      check: null,
      status: "waiting",
      disabled: false,
      boardState: {
        board: initializeBoard(),
        selectedCell: null,
        overCell: null,
      },
      previousMoves: [],
      capturedPieces: { w: [], b: [] },
    })
  })
})

describe("createMove", () => {
  it("should create a moves with the correct values for basic moves", () => {
    const board = initializeBoard()
    const actualMove1: Move = {
      player: "w",
      from: board[1][4],
      to: board[1][6],
      check: false,
      notation: "P:b4-b6",
      piece: makePiece("pawn-ccw", "b"),
      pieceCaptured: null,
      piecePromoted: null,
      status: "playing",
      timestamp: TEST_DATE,
    }

    const move1 = createMove(
      actualMove1.player,
      actualMove1.from,
      actualMove1.to,
      actualMove1.piece,
      actualMove1.piecePromoted,
      null,
      actualMove1.status
    )

    move1.timestamp = TEST_DATE

    expect(move1).toEqual(actualMove1)

    const actualMove2: Move = {
      player: "b",
      from: board[1][14],
      to: board[1][12],
      check: false,
      notation: "P:b14-b12",
      piece: makePiece("pawn-cw", "b"),
      pieceCaptured: null,
      piecePromoted: null,
      status: "playing",
      timestamp: TEST_DATE,
    }

    const move2 = createMove(
      actualMove2.player,
      actualMove2.from,
      actualMove2.to,
      actualMove2.piece,
      actualMove2.piecePromoted,
      null,
      actualMove2.status
    )

    move2.timestamp = TEST_DATE

    expect(move2).toEqual(actualMove2)

    const actualMove3: Move = {
      player: "w",
      from: board[2][7],
      to: board[1][5],
      check: false,
      notation: "B:a7-b5",
      piece: makePiece("bishop", "w"),
      pieceCaptured: null,
      piecePromoted: null,
      status: "playing",
      timestamp: TEST_DATE,
    }

    const move3 = createMove(
      actualMove3.player,
      actualMove3.from,
      actualMove3.to,
      actualMove3.piece,
      actualMove3.piecePromoted,
      null,
      actualMove3.status
    )

    move3.timestamp = TEST_DATE

    expect(move3).toEqual(actualMove3)
  })

  it("should have correct notation for captures", () => {
    const from = makeCell(1, 5, 0)
    const to = makeCell(1, 6, 0)
    const piece = makePiece("pawn-ccw", "w")
    const pieceCaptured = makePiece("pawn-ccw", "b")
    to.piece = pieceCaptured

    const move = createMove("w", from, to, piece, null, null, "playing")

    expect(move.notation).toEqual("P:b5xb6")
  })

  it("should have correct notation for promotions", () => {
    const from = makeCell(1, 1, 0)
    const to = makeCell(2, 3, 0)
    const piece = makePiece("pawn-ccw", "b")
    const pieceCaptured = makePiece("pawn-ccw", "w")
    to.piece = pieceCaptured

    const move = createMove(
      "w",
      from,
      to,
      piece,
      makePiece("queen", "b"),
      null,
      "playing"
    )

    expect(move.notation).toEqual("P:b1xa3=Q")
  })

  it("should have correct notation for check", () => {
    const from = makeCell(1, 5, 0)
    const to = makeCell(1, 6, 0)
    const piece = makePiece("pawn-ccw", "w")
    const pieceCaptured = makePiece("pawn-ccw", "b")
    to.piece = pieceCaptured

    const move = createMove("w", from, to, piece, null, "w", "playing")

    expect(move.notation).toEqual("P:b5xb6+")
  })

  it("should have correct notation for checkmate", () => {
    const from = makeCell(1, 5, 0)
    const to = makeCell(1, 6, 0)
    const piece = makePiece("pawn-ccw", "w")
    const pieceCaptured = makePiece("pawn-ccw", "b")
    to.piece = pieceCaptured

    const move = createMove("w", from, to, piece, null, null, "checkmate")

    expect(move.notation).toEqual("P:b5xb6#")
  })
})
describe("displayTimeRemaining", () => {
  it("should format time correctly", () => {
    expect(displayTimeRemaining(65)).toBe("01:05")
    expect(displayTimeRemaining(3600)).toBe("60:00")
    expect(displayTimeRemaining(0)).toBe("00:00")
    expect(displayTimeRemaining(-10)).toBe("00:00")
  })
})

describe("isGameOver", () => {
  it("should correctly identify when game is over", () => {
    expect(isGameOver("checkmate")).toBe(true)
    expect(isGameOver("draw-stalemate")).toBe(true)
    expect(isGameOver("draw-agreement")).toBe(true)
    expect(isGameOver("resignation")).toBe(true)
    expect(isGameOver("time-expired")).toBe(true)
    expect(isGameOver("opponent-left")).toBe(true)
    expect(isGameOver("draw-threefold")).toBe(true)
    expect(isGameOver("draw-fifty-move")).toBe(true)
    expect(isGameOver("draw-insufficient")).toBe(true)
  })

  it("should correctly identify when game is not over", () => {
    expect(isGameOver("playing")).toBe(false)
    expect(isGameOver("waiting")).toBe(false)
  })
})

describe("getNewStatus", () => {
  it("should update game status to playing", () => {
    const board = initializeBoard()
    const moves: Move[] = []
    const nextMove = {
      from: board[1][4],
      to: board[1][6],
      piece: makePiece("pawn-ccw", "w"),
      piecePromoted: null,
    }
    expect(getNewStatus(false, board, "w", moves, nextMove)).toBe("playing")
  })

  it("should update game status to checkmate", () => {
    const board = initializeBoard()
    const moves: Move[] = []
    const nextMove = {
      from: board[1][4],
      to: board[1][6],
      piece: makePiece("pawn-ccw", "w"),
      piecePromoted: null,
    }
    expect(getNewStatus(true, board, "w", moves, nextMove)).toBe("checkmate")
  })

  it("should update game status to draw-stalemate", () => {
    const board = initializeBoard(false)

    board[2][30].piece = makePiece("king", "w")
    board[2][31].piece = makePiece("pawn-cw", "w")
    board[2][29].piece = makePiece("pawn-ccw", "w")

    board[2][4].piece = makePiece("rook", "b")
    board[1][4].piece = makePiece("rook", "b")

    const moves: Move[] = []
    const nextMove = {
      from: board[1][4],
      to: board[1][6],
      piece: makePiece("pawn-ccw", "w"),
      piecePromoted: null,
    }
    expect(getNewStatus(false, board, "w", moves, nextMove)).toBe(
      "draw-stalemate"
    )
  })

  it("should update game status to draw-threefold", () => {
    const board = initializeBoard()

    const moves: Move[] = []

    // Create a few cells for testing
    const cell1 = makeCell(0, 0, 0)
    const cell2 = makeCell(0, 1, 36)
    const piece = makePiece("knight", "w")

    // Add moves to simulate repetition (three times, each time has 4 moves)
    for (let i = 0; i < 3; i++) {
      const move1 = createMove("w", cell1, cell2, piece, null, null, "playing")
      const move2 = createMove("w", cell2, cell1, piece, null, null, "playing")
      moves.push(move1)
      moves.push(move2)
      moves.push(move1)
      moves.push(move2)
    }

    const nextMove = {
      from: cell1,
      to: cell2,
      piece: makePiece("knight", "w"),
      piecePromoted: null,
    }
    expect(getNewStatus(false, board, "w", moves, nextMove)).toBe(
      "draw-threefold"
    )
  })

  it("should update game status to draw-fifty-move", () => {
    const board = initializeBoard(true)

    const moves: Move[] = []
    const cell = makeCell(0, 0, 0)
    const piece = makePiece("knight", "w")

    for (let i = 0; i < 50; i++) {
      const move = createMove("w", cell, cell, piece, null, null, "playing")
      moves.push(move)
    }

    const nextMove = {
      from: cell,
      to: cell,
      piece: makePiece("bishop", "w"),
      piecePromoted: null,
    }
    expect(getNewStatus(false, board, "w", moves, nextMove)).toBe(
      "draw-fifty-move"
    )
  })

  it("should update game status to draw-insufficient", () => {
    const board: Board = initializeBoard()

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].piece?.type !== "king") {
          board[i][j].piece = null
        }
      }
    }

    const moves: Move[] = []
    const from = makeCell(2, 3, 0)
    const to = makeCell(2, 4, 0)
    const piece = makePiece("king", "w")

    const nextMove = { from, to, piece, piecePromoted: null }
    expect(getNewStatus(false, board, "w", moves, nextMove)).toBe(
      "draw-insufficient"
    )
  })
})

describe("moveHelper", () => {
  it("should return the correct move with pawn", () => {
    const oldTurn = "b"
    const board = initializeBoard()
    const moves: Move[] = []
    const from = makeCell(1, 4, 0)
    const to = makeCell(1, 6, 0)
    const piece = makePiece("pawn-ccw", "w")
    const promotionCoordinates = { from, to, piece }
    const { timestamp: val1, ...actualMove } = createMove(
      "b",
      from,
      to,
      piece,
      null,
      null,
      "playing"
    )
    const {
      turn,
      status,
      checkedColor,
      move: { timestamp: val2, ...move },
    } = moveHelper(oldTurn, board, moves, promotionCoordinates, null)
    expect(turn).toBe("w")
    expect(status).toBe("playing")
    expect(checkedColor).toBe(null)
    expect(move).toEqual(actualMove)
  })

  it("should return the correct move with king", () => {
    const oldTurn = "w"
    const board = initializeBoard()
    const moves: Move[] = []
    const from = makeCell(0, 5, 0)
    const to = makeCell(1, 6, 0)
    const piece = makePiece("king", "b")
    const promotionCoordinates = { from, to, piece }
    const { timestamp: val1, ...actualMove } = createMove(
      "w",
      from,
      to,
      piece,
      null,
      null,
      "playing"
    )
    const {
      turn,
      status,
      checkedColor,
      move: { timestamp: val2, ...move },
    } = moveHelper(oldTurn, board, moves, promotionCoordinates, null)
    expect(turn).toBe("b")
    expect(status).toBe("playing")
    expect(checkedColor).toBe(null)
    expect(move).toEqual(actualMove)
  })

  it("should return the correct move with pawn promotion", () => {
    const oldTurn = "w"
    const board = initializeBoard()
    const moves: Move[] = []
    const from = makeCell(0, 5, 0)
    const to = makeCell(1, 6, 0)
    const piece = makePiece("pawn-ccw", "b")
    const promotionCoordinates = { from, to, piece }
    const { timestamp: val1, ...actualMove } = createMove(
      "w",
      from,
      to,
      piece,
      makePiece("queen", "w"),
      null,
      "playing"
    )
    const {
      turn,
      status,
      checkedColor,
      move: { timestamp: val2, ...move },
    } = moveHelper(
      oldTurn,
      board,
      moves,
      promotionCoordinates,
      makePiece("queen", "w")
    )
    expect(turn).toBe("b")
    expect(status).toBe("playing")
    expect(checkedColor).toBe(null)
    expect(move).toEqual(actualMove)
  })
})

describe("gameReducer", () => {
  let state: GameState = createGameState()

  beforeEach(() => {
    vi.clearAllMocks()
    state = createGameState()
  })

  it("should handle START_GAME action with duration and players", () => {
    const player: Player = {
      id: "1",
      color: "w",
      userId: "1",
      username: "Test Player 1",
    }
    const opponent: Player = {
      id: "2",
      color: "b",
      userId: "2",
      username: "Test Player 2",
    }
    const action: GameAction = {
      type: "START_GAME",
      duration: 10,
      players: [player, opponent],
    }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({
      ...state,
      player,
      opponent,
      status: "playing",
      timer: { w: 10, b: 10 },
    })
  })

  it("should handle START_GAME action with duration and no players", () => {
    const action: GameAction = { type: "START_GAME", duration: 10 }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({
      ...state,
      status: "playing",
      timer: { w: 10, b: 10 },
    })
  })

  it("should handle START_GAME action with players and no duration", () => {
    const player: Player = {
      id: "1",
      color: "w",
      userId: "1",
      username: "Test Player 1",
    }
    const opponent: Player = {
      id: "2",
      color: "b",
      userId: "2",
      username: "Test Player 2",
    }
    const action: GameAction = {
      type: "START_GAME",
      players: [player, opponent],
    }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({
      ...state,
      player,
      opponent,
      status: "playing",
    })
  })

  it("should handle START_GAME action with no duration and players", () => {
    const action: GameAction = { type: "START_GAME" }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({
      ...state,
      status: "playing",
    })
  })

  it("should handle SET_STATUS action", () => {
    const statuses: GameStatus[] = [
      "waiting",
      "playing",
      "checkmate",
      "draw-stalemate",
      "draw-agreement",
      "draw-threefold",
      "draw-fifty-move",
      "draw-insufficient",
      "resignation",
      "time-expired",
      "opponent-left",
    ]

    for (const status of statuses) {
      const action: GameAction = { type: "SET_STATUS", status }

      const newState = gameReducer(state, action)

      expect(newState).toEqual({
        ...state,
        status,
      })
    }
  })

  it("should handle PROMOTE_PAWN action when promotion coordinates are not set", () => {
    const action: GameAction = {
      type: "PROMOTE_PAWN",
      piece: makePiece("queen", "w"),
    }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({ ...state })
  })

  it("should handle PROMOTE_PAWN action when promotion coordinates are set", () => {
    const to = makeCell(0, 0, 0)
    const from = makeCell(0, 0, 0)
    const piece = makePiece("queen", "w")

    const action: GameAction = { type: "PROMOTE_PAWN", piece }
    state.promotionCoordinates = { from, to, piece: makePiece("pawn-ccw", "w") }
    const { turn, status, checkedColor, move } = moveHelper(
      state.turn,
      state.boardState.board,
      state.previousMoves,
      state.promotionCoordinates,
      piece
    )
    move.timestamp = TEST_DATE

    const newState = gameReducer(state, action)
    newState.previousMoves[0].timestamp = TEST_DATE

    expect(newState).toEqual({
      ...state,
      status,
      turn,
      boardState: { ...state.boardState },
      previousMoves: [...state.previousMoves, move],
      promotionCoordinates: undefined,
      check: checkedColor,
    })
  })

  it("should handle DECREMENT_TIMER action when timer is not set", () => {
    const action: GameAction = { type: "DECREMENT_TIMER", player: "w" }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({ ...state })
  })

  it("should handle DECREMENT_TIMER action when timer is set", () => {
    const action: GameAction = { type: "DECREMENT_TIMER", player: "w" }

    state.timer = { w: 10, b: 10 }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({ ...state, timer: { w: 9, b: 10 } })
  })

  it("should handle SET_WINNER action", () => {
    const action: GameAction = { type: "SET_WINNER", player: "w" }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({ ...state, winner: "w" })
  })

  it("should handle END_GAME action when winner is set", () => {
    const action: GameAction = { type: "END_GAME" }

    state.winner = "w"

    const newState = gameReducer(state, action)

    expect(newState).toEqual({ ...state, winner: "w", disabled: true })
  })

  it("should handle END_GAME action when winner is not set", () => {
    const action: GameAction = { type: "END_GAME" }

    const drawStates: GameStatus[] = [
      "draw-stalemate",
      "draw-agreement",
      "draw-threefold",
      "draw-fifty-move",
      "draw-insufficient",
    ]

    // When the game is a draw
    for (const status of drawStates) {
      state.status = status

      const newState = gameReducer(state, action)

      expect(newState).toEqual({ ...state, winner: "draw", disabled: true })
    }

    // When the opponent left
    state.status = "opponent-left"

    const newState = gameReducer(state, action)

    expect(newState).toEqual({ ...state, winner: "w", disabled: true })
  })

  it("should handle RESET_GAME action", () => {
    const action: GameAction = { type: "RESET_GAME" }
    const actualState = createGameState()
    const newState = gameReducer(state, action)

    expect(newState).toEqual(actualState)
  })

  it("should handle SYNC_GAME action", () => {
    const action: GameAction = {
      type: "SYNC_GAME",
      state: { ...state, winner: "w" },
    }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({ ...state, winner: "w" })
  })

  it("should handle SELECT_CELL action when cell is set", () => {
    state.boardState.board = initializeBoard(false)
    state.boardState.board[0][0].piece = makePiece("pawn-ccw", "w")

    const action: GameAction = {
      type: "SELECT_CELL",
      cell: state.boardState.board[0][0],
    }

    const newState = gameReducer(state, action)

    const possibleMoves = getPossibleMoves(
      state.boardState.board[0][0],
      state.boardState.board
    )
    const invalidMoves = getInvalidMoves(
      state.boardState.board[0][0],
      state.boardState.board,
      possibleMoves
    )

    expect(newState).toEqual({
      ...state,
      boardState: {
        ...state.boardState,
        selectedCell: {
          cell: state.boardState.board[0][0],
          availableMoves: possibleMoves,
          invalidMoves: invalidMoves,
        },
      },
    })
  })

  it("should handle SELECT_CELL action when cell is not set", () => {
    const action: GameAction = { type: "SELECT_CELL", cell: null }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({ ...state })
  })

  it("should handle SET_OVER_CELL action", () => {
    const action: GameAction = {
      type: "SET_OVER_CELL",
      cell: state.boardState.board[0][0],
    }

    const newState = gameReducer(state, action)

    expect(newState).toEqual({
      ...state,
      boardState: {
        ...state.boardState,
        overCell: state.boardState.board[0][0],
      },
    })
  })

  it("should handle SET_PENDING_MOVE action with no capturing", () => {
    state.boardState.board = initializeBoard(false)
    const piece = makePiece("king", "w")
    const from = makeCell(0, 0, 0)
    const to = makeCell(0, 1, 0)
    const capturedPiece = to.piece

    state.boardState.board[0][0].piece = piece

    const action: GameAction = {
      type: "SET_PENDING_MOVE",
      pendingMove: {
        to,
        from,
        piece,
        capturedPiece,
      },
    }

    const newState = gameReducer(state, action)

    state.boardState.board[to.x][to.y].piece = piece
    state.boardState.board[from.x][from.y].piece = null

    expect(newState).toEqual({
      ...state,
      disabled: true,
      boardState: { ...state.boardState, pendingMove: action.pendingMove },
    })
  })

  it("should handle SET_PENDING_MOVE action with capturing", () => {
    state.boardState.board = initializeBoard(false)
    const piece = makePiece("king", "w")
    const from = makeCell(0, 0, 0)
    const to = makeCell(0, 1, 0)

    to.piece = makePiece("bishop", "b")

    const capturedPiece = to.piece
    state.boardState.board[0][0].piece = piece

    const action: GameAction = {
      type: "SET_PENDING_MOVE",
      pendingMove: {
        to,
        from,
        piece,
        capturedPiece,
      },
    }

    const newState = gameReducer(state, action)

    state.boardState.board[to.x][to.y].piece = piece
    state.boardState.board[from.x][from.y].piece = null

    expect(newState).toEqual({
      ...state,
      disabled: true,
      boardState: { ...state.boardState, pendingMove: action.pendingMove },
    })
  })

  it("should handle CANCEL_MOVE action", () => {
    state.boardState.board = initializeBoard(false)
    const piece = makePiece("king", "w")
    const from = makeCell(0, 0, 0)
    const to = makeCell(0, 1, 0)
    const capturedPiece = to.piece

    state.boardState.board[0][0].piece = piece

    const pending_move_action: GameAction = {
      type: "SET_PENDING_MOVE",
      pendingMove: {
        to,
        from,
        piece,
        capturedPiece,
      },
    }

    state = gameReducer(state, pending_move_action)

    const action: GameAction = {
      type: "CANCEL_MOVE",
    }

    const newState = gameReducer(state, action)

    state.boardState.board[to.x][to.y].piece = capturedPiece
    state.boardState.board[from.x][from.y].piece = piece

    expect(newState).toEqual({
      ...state,
      disabled: false,
      boardState: {
        ...state.boardState,
        selectedCell: null,
        overCell: null,
        pendingMove: undefined,
      }
    })
  })

  it("should handle CONFIRM_MOVE action", () => {
    state.boardState.board = initializeBoard(false)
    const piece = makePiece("king", "w")
    const from = makeCell(0, 0, 0)
    const to = makeCell(0, 1, 0)
    const capturedPiece = to.piece

    state.boardState.board[0][0].piece = piece

    const pending_move_action: GameAction = {
      type: "SET_PENDING_MOVE",
      pendingMove: {
        to,
        from,
        piece,
        capturedPiece,
      },
    }

    state = gameReducer(state, pending_move_action)

    const action: GameAction = {
      type: "CONFIRM_MOVE",
    }

    const newState = gameReducer(state, action)
    newState.previousMoves[0].timestamp = TEST_DATE


    piece.hasMoved = true

    state.boardState.board[to.x][to.y].piece = piece
    state.boardState.board[from.x][from.y].piece = null

    const { turn, checkedColor, status, move } = moveHelper(
      state.turn,
      state.boardState.board,
      state.previousMoves,
      { to, from, piece },
      null
    )

    move.timestamp = TEST_DATE

    expect(newState).toEqual({
      ...state,
      turn,
      status,
      disabled: false,
      boardState: {
        ...state.boardState,
        selectedCell: null,
        overCell: null,
        pendingMove: undefined,
      },
      capturedPieces: {"w": [], "b": []},
      check: checkedColor,
      previousMoves: [...state.previousMoves, move]
    })
  })
})
