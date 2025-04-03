import { beforeEach, describe, expect, it } from "vitest"

import { makeCell } from "@/features/board/cell"
import type { Board, Cell } from "@/features/board/types"
import { initializeBoard } from "@/features/board/utils"
import { gameReducer } from "@/features/game/reducer"
import type {
  GameAction,
  GameState,
  GameStatus,
  Move,
} from "@/features/game/types"
import {
  createGameState,
  createMove,
  displayTimeRemaining,
  getNewStatus,
  isGameOver,
  moveHelper,
} from "@/features/game/utils"
import type { Piece, PieceColor, PieceType } from "@/features/piece/types"
import {
  getInvalidMoves,
  getPossibleMoves,
  makePiece,
} from "@/features/piece/utils"

import { TEST_TIMESTAMP } from "./constants"
import {
  createPromotionState,
  createTestMove,
  createTestPlayers,
  measureDispatchTime,
  mockDispatch,
} from "./utils"

describe("Game Utility Functions", () => {
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
        },
        previousMoves: [],
        capturedPieces: { w: [], b: [] },
      })
    })
  })

  describe("createMove", () => {
    let board: Board

    beforeEach(() => {
      board = initializeBoard()
    })

    it("should create basic moves with correct values", () => {
      const testCases = [
        {
          player: "w",
          from: board[1][4],
          to: board[1][6],
          piece: makePiece("pawn-ccw", "b"),
          notation: "P:b4-b6",
        },
        {
          player: "b",
          from: board[1][14],
          to: board[1][12],
          piece: makePiece("pawn-cw", "b"),
          notation: "P:b14-b12",
        },
        {
          player: "w",
          from: board[2][7],
          to: board[1][5],
          piece: makePiece("bishop", "w"),
          notation: "B:a7-b5",
        },
      ] as const

      testCases.forEach(({ player, from, to, piece, notation }) => {
        const move = createMove(player, from, to, piece, null, null, "playing")
        move.timestamp = TEST_TIMESTAMP

        expect(move).toEqual({
          player,
          from,
          to,
          piece,
          check: false,
          notation,
          pieceCaptured: null,
          piecePromoted: null,
          status: "playing",
          timestamp: TEST_TIMESTAMP,
        })
      })
    })

    it("should format notation correctly for special moves", () => {
      const testCases = [
        {
          description: "captures",
          from: makeCell(1, 5, 0),
          to: makeCell(1, 6, 0),
          piece: makePiece("pawn-ccw", "w"),
          pieceCaptured: makePiece("pawn-ccw", "b"),
          piecePromoted: null,
          check: null,
          status: "playing",
          expectedNotation: "P:b5xb6",
        },
        {
          description: "promotions",
          from: makeCell(1, 1, 0),
          to: makeCell(2, 3, 0),
          piece: makePiece("pawn-ccw", "b"),
          pieceCaptured: makePiece("pawn-ccw", "w"),
          piecePromoted: makePiece("queen", "b"),
          check: null,
          status: "playing",
          expectedNotation: "P:b1xa3=Q",
        },
        {
          description: "check",
          from: makeCell(1, 5, 0),
          to: makeCell(1, 6, 0),
          piece: makePiece("pawn-ccw", "w"),
          pieceCaptured: makePiece("pawn-ccw", "b"),
          piecePromoted: null,
          check: "w",
          status: "playing",
          expectedNotation: "P:b5xb6+",
        },
        {
          description: "checkmate",
          from: makeCell(1, 5, 0),
          to: makeCell(1, 6, 0),
          piece: makePiece("pawn-ccw", "w"),
          pieceCaptured: makePiece("pawn-ccw", "b"),
          piecePromoted: null,
          check: null,
          status: "checkmate",
          expectedNotation: "P:b5xb6#",
        },
      ] as const

      testCases.forEach(
        ({
          from,
          to,
          piece,
          pieceCaptured,
          piecePromoted,
          check,
          status,
          expectedNotation,
        }) => {
          to.piece = pieceCaptured
          const move = createMove(
            "w",
            from,
            to,
            piece,
            piecePromoted,
            check,
            status
          )
          expect(move.notation).toEqual(expectedNotation)
        }
      )
    })
  })

  describe("displayTimeRemaining", () => {
    it("should format time correctly", () => {
      const testCases = [
        { input: 65, expected: "01:05" },
        { input: 3600, expected: "60:00" },
        { input: 0, expected: "00:00" },
        { input: -10, expected: "00:00" },
      ]

      testCases.forEach(({ input, expected }) => {
        expect(displayTimeRemaining(input)).toBe(expected)
      })
    })
  })

  describe("isGameOver", () => {
    it("should correctly identify game-over statuses", () => {
      const gameOverStatuses: GameStatus[] = [
        "checkmate",
        "draw-stalemate",
        "draw-agreement",
        "resignation",
        "time-expired",
        "opponent-left",
        "draw-threefold",
        "draw-fifty-move",
        "draw-insufficient",
      ]

      gameOverStatuses.forEach((status) => {
        expect(isGameOver(status)).toBe(true)
      })
    })

    it("should correctly identify non-game-over statuses", () => {
      const nonGameOverStatuses: GameStatus[] = ["playing", "waiting"]

      nonGameOverStatuses.forEach((status) => {
        expect(isGameOver(status)).toBe(false)
      })
    })
  })

  describe("getNewStatus", () => {
    let board: Board
    let moves: Move[]

    beforeEach(() => {
      board = initializeBoard()
      moves = []
    })

    it("should return 'playing' when game continues normally", () => {
      const nextMove = createTestMove(
        board[1][4],
        board[1][6],
        makePiece("pawn-ccw", "w")
      )

      expect(getNewStatus(false, board, "w", moves, nextMove)).toBe("playing")
    })

    it("should return 'checkmate' when king is in checkmate", () => {
      const nextMove = createTestMove(
        board[1][4],
        board[1][6],
        makePiece("pawn-ccw", "w")
      )

      expect(getNewStatus(true, board, "w", moves, nextMove)).toBe("checkmate")
    })

    it("should return 'draw-stalemate' when king is not in check but has no legal moves", () => {
      // Setup stalemate position
      board = initializeBoard(false)
      board[2][30].piece = makePiece("king", "w")
      board[2][31].piece = makePiece("pawn-cw", "w")
      board[2][29].piece = makePiece("pawn-ccw", "w")
      board[2][4].piece = makePiece("rook", "b")
      board[1][4].piece = makePiece("rook", "b")

      const nextMove = createTestMove(
        board[1][4],
        board[1][6],
        makePiece("pawn-ccw", "w")
      )

      expect(getNewStatus(false, board, "w", moves, nextMove)).toBe(
        "draw-stalemate"
      )
    })

    it("should return 'draw-threefold' when position repeats three times", () => {
      // Create cells for repetition
      const cell1 = makeCell(0, 0, 0)
      const cell2 = makeCell(0, 1, 36)
      const piece = makePiece("knight", "w")

      // Simulate repetition (three times, each with 4 moves)
      for (let i = 0; i < 3; i++) {
        const move1 = createMove(
          "w",
          cell1,
          cell2,
          piece,
          null,
          null,
          "playing"
        )
        const move2 = createMove(
          "w",
          cell2,
          cell1,
          piece,
          null,
          null,
          "playing"
        )
        moves.push(move1, move2, move1, move2)
      }

      const nextMove = createTestMove(cell1, cell2, makePiece("knight", "w"))

      expect(getNewStatus(false, board, "w", moves, nextMove)).toBe(
        "draw-threefold"
      )
    })

    it("should return 'draw-fifty-move' after 50 moves without captures or pawn moves", () => {
      board = initializeBoard(true)
      const cell = makeCell(0, 0, 0)
      const piece = makePiece("knight", "w")

      // Add 50 moves with no captures or pawn moves
      for (let i = 0; i < 50; i++) {
        moves.push(createMove("w", cell, cell, piece, null, null, "playing"))
      }

      const nextMove = createTestMove(cell, cell, makePiece("bishop", "w"))

      expect(getNewStatus(false, board, "w", moves, nextMove)).toBe(
        "draw-fifty-move"
      )
    })

    it("should return 'draw-insufficient' when neither player has enough material to checkmate", () => {
      // Clear the board except for kings
      board = initializeBoard(false)
      board[2][3].piece = makePiece("king", "w")
      board[2][28].piece = makePiece("king", "b")

      const from = makeCell(2, 3, 0)
      const to = makeCell(2, 4, 0)
      const nextMove = createTestMove(from, to, makePiece("king", "w"))

      expect(getNewStatus(false, board, "w", moves, nextMove)).toBe(
        "draw-insufficient"
      )
    })
  })

  describe("moveHelper", () => {
    // Helper function to set up tests
    const setupMoveHelperTest = (
      turn: PieceColor,
      pieceType: PieceType,
      pieceColor: PieceColor,
      from: Cell,
      promotedPiece: Piece | null = null
    ) => {
      const board = initializeBoard()
      const moves: Move[] = []
      const to = makeCell(1, 6, 0)
      const piece = makePiece(pieceType, pieceColor)
      const promotionCoordinates = { from, to, piece }

      const expectedMove = createMove(
        turn,
        from,
        to,
        piece,
        promotedPiece,
        null,
        "playing"
      )

      const result = moveHelper(
        turn,
        board,
        moves,
        promotionCoordinates,
        promotedPiece
      )

      // Update timestamps for comparison
      expectedMove.timestamp = TEST_TIMESTAMP
      result.move.timestamp = TEST_TIMESTAMP

      return {
        result,
        expectedMove,
        resultMove: result.move,
      }
    }

    it("should handle basic pawn move correctly", () => {
      const { result, expectedMove, resultMove } = setupMoveHelperTest(
        "b",
        "pawn-ccw",
        "w",
        makeCell(1, 4, 0)
      )

      expect(result.turn).toBe("w")
      expect(result.status).toBe("playing")
      expect(result.checkedColor).toBeNull()
      expect(resultMove).toEqual(expectedMove)
    })

    it("should handle king move correctly", () => {
      const { result, expectedMove, resultMove } = setupMoveHelperTest(
        "w",
        "king",
        "b",
        makeCell(0, 5, 0)
      )

      expect(result.turn).toBe("b")
      expect(result.status).toBe("playing")
      expect(result.checkedColor).toBeNull()
      expect(resultMove).toEqual(expectedMove)
    })

    it("should handle pawn promotion correctly", () => {
      const promotedPiece = makePiece("queen", "w")
      const { result, expectedMove, resultMove } = setupMoveHelperTest(
        "w",
        "pawn-ccw",
        "b",
        makeCell(0, 5, 0),
        promotedPiece
      )

      expect(result.turn).toBe("b")
      expect(result.status).toBe("playing")
      expect(result.checkedColor).toBeNull()
      expect(resultMove).toEqual(expectedMove)
    })
  })
})

describe("Game Reducer", () => {
  let initialState: GameState

  beforeEach(() => {
    initialState = createGameState()
  })

  describe("START_GAME action", () => {
    // Setup test data
    const [player, opponent] = createTestPlayers()
    const duration = 10
    const status = "playing"
    const timer: Record<PieceColor, number> = { w: 10, b: 10 }

    it("should handle with duration and players", () => {
      const action: GameAction = {
        type: "START_GAME",
        duration,
        players: [player, opponent],
      }

      const newState = gameReducer(initialState, action)

      expect(newState).toEqual({
        ...initialState,
        player,
        opponent,
        status,
        timer,
      })
    })

    it("should handle with duration only", () => {
      const action: GameAction = { type: "START_GAME", duration }
      const newState = gameReducer(initialState, action)
      expect(newState).toEqual({ ...initialState, status, timer })
    })

    it("should handle with players only", () => {
      const action: GameAction = {
        type: "START_GAME",
        players: [player, opponent],
      }

      const newState = gameReducer(initialState, action)

      expect(newState).toEqual({
        ...initialState,
        player,
        opponent,
        status,
      })
    })

    it("should handle with no parameters", () => {
      const action: GameAction = { type: "START_GAME" }
      const newState = gameReducer(initialState, action)
      expect(newState).toEqual({ ...initialState, status })
    })
  })

  describe("SET_STATUS action", () => {
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

    it("should set the game status correctly for all possible statuses", () => {
      statuses.forEach((status) => {
        const action: GameAction = { type: "SET_STATUS", status }
        const newState = gameReducer(initialState, action)
        expect(newState.status).toBe(status)
      })
    })
  })

  describe("PROMOTE_PAWN action", () => {
    const piece: Piece = makePiece("queen", "w")

    it("should not change state when promotion coordinates are not set", () => {
      const action: GameAction = { type: "PROMOTE_PAWN", piece }
      const newState = gameReducer(initialState, action)
      expect(newState).toEqual(initialState)
    })

    it("should handle pawn promotion when coordinates are set", () => {
      const action: GameAction = { type: "PROMOTE_PAWN", piece }

      const to = makeCell(0, 0, 0)
      const from = makeCell(0, 0, 0)

      const promotionState = {
        ...initialState,
        promotionCoordinates: {
          from,
          to,
          piece: makePiece("pawn-ccw", "w"),
        },
      }

      const { turn, status, checkedColor, move } = moveHelper(
        promotionState.turn,
        promotionState.boardState.board,
        promotionState.previousMoves,
        promotionState.promotionCoordinates,
        piece
      )

      move.timestamp = TEST_TIMESTAMP

      const newState = gameReducer(promotionState, action)
      newState.previousMoves[0].timestamp = TEST_TIMESTAMP

      expect(newState).toEqual({
        ...promotionState,
        status,
        turn,
        boardState: { ...promotionState.boardState },
        previousMoves: [...promotionState.previousMoves, move],
        promotionCoordinates: undefined,
        check: checkedColor,
      })
    })
  })

  describe("DECREMENT_TIMER action", () => {
    it("should not change state when timer is not set", () => {
      const action: GameAction = { type: "DECREMENT_TIMER", player: "w" }
      const newState = gameReducer(initialState, action)
      expect(newState).toEqual(initialState)
    })

    it("should decrement the timer for the specified player", () => {
      const state = { ...initialState, timer: { w: 10, b: 10 } }
      const action: GameAction = { type: "DECREMENT_TIMER", player: "w" }
      const newState = gameReducer(state, action)
      expect(newState.timer).toEqual({ w: 9, b: 10 })
    })
  })

  describe("SET_WINNER action", () => {
    it("should set the winner correctly", () => {
      const action: GameAction = { type: "SET_WINNER", player: "w" }
      const newState = gameReducer(initialState, action)
      expect(newState.winner).toBe("w")
    })
  })

  describe("END_GAME action", () => {
    const disabled = true

    it("should set disabled to true when winner is already set", () => {
      const state = { ...initialState, winner: "w" as const }
      const action: GameAction = { type: "END_GAME" }
      const newState = gameReducer(state, action)
      expect(newState).toEqual({ ...state, disabled })
    })

    it("should set winner to 'draw' for draw game statuses", () => {
      const drawStatuses: GameStatus[] = [
        "draw-stalemate",
        "draw-agreement",
        "draw-threefold",
        "draw-fifty-move",
        "draw-insufficient",
      ]

      drawStatuses.forEach((status) => {
        const state = { ...initialState, status }
        const action: GameAction = { type: "END_GAME" }
        const newState = gameReducer(state, action)
        expect(newState).toEqual({ ...state, winner: "draw", disabled })
      })
    })

    it("should set current player as winner when opponent left", () => {
      const state = { ...initialState, status: "opponent-left" as const }
      const action: GameAction = { type: "END_GAME" }
      const newState = gameReducer(state, action)
      expect(newState).toEqual({ ...state, winner: "w", disabled })
    })
  })

  describe("RESET_GAME action", () => {
    it("should reset the game state to initial values", () => {
      const modifiedState = {
        ...initialState,
        status: "playing" as const,
        winner: "w" as const,
      }
      const action: GameAction = { type: "RESET_GAME" }
      const newState = gameReducer(modifiedState, action)
      expect(newState).toEqual(createGameState())
    })
  })

  describe("SYNC_GAME action", () => {
    it("should synchronize the game state with provided state", () => {
      const syncedState = { ...initialState, winner: "w" as const }
      const action: GameAction = { type: "SYNC_GAME", state: syncedState }
      const newState = gameReducer(initialState, action)
      expect(newState).toEqual(syncedState)
    })
  })

  describe("SET_SELECTED_CELL action", () => {
    it("should set selected cell with available and invalid moves", () => {
      const board = initializeBoard(false)
      const cell = board[0][0]
      board[0][0].piece = makePiece("pawn-ccw", "w")

      const state = {
        ...initialState,
        boardState: { ...initialState.boardState, board },
      }

      const availableMoves = getPossibleMoves(cell, board)
      const invalidMoves = getInvalidMoves(cell, board, availableMoves)

      const action: GameAction = {
        type: "SET_SELECTED_CELL",
        cell,
      }

      const newState = gameReducer(state, action)

      expect(newState.boardState.selectedCell).toEqual({
        cell,
        availableMoves,
        invalidMoves,
      })
    })

    it("should clear selected cell when cell is null", () => {
      const action: GameAction = { type: "SET_SELECTED_CELL", cell: null }
      const newState = gameReducer(initialState, action)
      expect(newState.boardState.selectedCell).toBeUndefined()
    })
  })

  describe("Board Move Actions", () => {
    // Setup common test data
    let board: Board
    let piece: Piece
    let from: Cell
    let to: Cell

    beforeEach(() => {
      board = initializeBoard(false)
      piece = makePiece("king", "w")
      from = board[0][0]
      to = board[0][1]
      from.piece = piece
    })

    describe("SET_PENDING_MOVE action", () => {
      it("should set pending move without capturing", () => {
        const state = {
          ...initialState,
          boardState: { ...initialState.boardState, board },
        }

        const action: GameAction = {
          type: "SET_PENDING_MOVE",
          pendingMove: {
            to,
            from,
            piece,
            capturedPiece: to.piece,
          },
        }

        const newState = gameReducer(state, action)

        expect(newState).toEqual({
          ...initialState,
          disabled: true,
          boardState: {
            ...initialState.boardState,
            board,
            pendingMove: action.pendingMove,
          },
        })
      })

      it("should set pending move with capturing", () => {
        const capturedPiece = makePiece("bishop", "b")
        to.piece = capturedPiece

        const state = {
          ...initialState,
          boardState: { ...initialState.boardState, board },
        }

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

        // update the actual board
        to.piece = piece
        from.piece = null

        expect(newState).toEqual({
          ...initialState,
          disabled: true,
          boardState: {
            ...initialState.boardState,
            board,
            pendingMove: action.pendingMove,
          },
        })
      })
    })

    describe("CANCEL_MOVE action", () => {
      it("should revert the pending move", () => {
        const capturedPiece = makePiece("bishop", "b")
        to.piece = piece

        const state = {
          ...initialState,
          disabled: true,
          boardState: {
            ...initialState.boardState,
            board,
            pendingMove: {
              to,
              from,
              piece,
              capturedPiece,
            },
          },
        }

        const action: GameAction = { type: "CANCEL_MOVE" }

        const newState = gameReducer(state, action)

        from.piece = piece
        to.piece = capturedPiece

        expect(newState).toEqual({
          ...initialState,
          disabled: false,
          boardState: {
            ...initialState.boardState,
            board,
            selectedCell: undefined,
            pendingMove: undefined,
          },
        })
      })
    })

    describe("CONFIRM_MOVE action", () => {
      it("should confirm the pending move and update game state", () => {
        to.piece = piece // Already moved by SET_PENDING_MOVE

        const state = {
          ...initialState,
          disabled: true,
          boardState: {
            ...initialState.boardState,
            board,
            pendingMove: {
              to,
              from,
              piece,
              capturedPiece: null,
            },
          },
        }

        const action: GameAction = { type: "CONFIRM_MOVE" }

        const newState = gameReducer(state, action)

        newState.previousMoves[0].timestamp = TEST_TIMESTAMP

        const { turn, checkedColor, status, move } = moveHelper(
          state.turn,
          state.boardState.board,
          state.previousMoves,
          { to, from, piece },
          null
        )

        move.timestamp = TEST_TIMESTAMP

        expect(newState).toEqual({
          ...state,
          turn,
          status,
          disabled: false,
          boardState: {
            ...state.boardState,
            board,
            selectedCell: undefined,
            pendingMove: undefined,
          },
          capturedPieces: { w: [piece], b: [] },
          check: checkedColor,
          previousMoves: [...state.previousMoves, move],
        })
      })
    })
  })
})

describe("Performance Tests", () => {
  it("should dispatch START_GAME within 5ms", () => {
    // Setup test data
    const [player, opponent] = createTestPlayers()
    const duration = 10
    const averageExecTime = measureDispatchTime(() => {
      mockDispatch({
        type: "START_GAME",
        duration,
        players: [player, opponent],
      })
    })

    console.log(`START_GAME dispatch time: ${averageExecTime.toFixed(2)}ms`)
    expect(averageExecTime).toBeLessThan(5)
  })

  it("should dispatch PROMOTE_PAWN within 5ms", () => {
    const state = createPromotionState()

    const averageExecTime = measureDispatchTime(() => {
      mockDispatch(
        { type: "PROMOTE_PAWN", piece: makePiece("pawn-ccw", "w") },
        state
      )
    })

    console.log(`PROMOTE_PAWN dispatch time: ${averageExecTime.toFixed(2)}ms`)
    expect(averageExecTime).toBeLessThan(5)
  })

  it("should dispatch END_GAME within 5ms", () => {
    const averageExecTime = measureDispatchTime(() => {
      mockDispatch({ type: "END_GAME" })
    })

    console.log(`END_GAME dispatch time: ${averageExecTime.toFixed(2)}ms`)
    expect(averageExecTime).toBeLessThan(5)
  })

  it("should dispatch RESET_GAME within 5ms", () => {
    const averageExecTime = measureDispatchTime(() => {
      mockDispatch({ type: "RESET_GAME" })
    })

    console.log(`RESET_GAME dispatch time: ${averageExecTime.toFixed(2)}ms`)
    expect(averageExecTime).toBeLessThan(5)
  })
})
