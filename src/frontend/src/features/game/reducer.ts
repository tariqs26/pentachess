import { canPromote, getInvalidMoves, getPossibleMoves } from "../piece/utils"
import type { GameAction, GameState } from "./types"
import { createGameState, moveHelper } from "./utils"
import { resetBoard } from "../board/utils"

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_SELECTED_CELL": {
      if (action.cell) {
        const possibleMoves = getPossibleMoves(
          action.cell,
          state.boardState.board
        )

        const invalidMoves = getInvalidMoves(
          action.cell,
          state.boardState.board,
          possibleMoves
        )

        return {
          ...state,
          boardState: {
            ...state.boardState,
            selectedCell: {
              cell: action.cell,
              availableMoves: possibleMoves,
              invalidMoves,
            },
          },
        }
      }

      return {
        ...state,
        boardState: { ...state.boardState, selectedCell: undefined },
      }
    }
    case "SET_PENDING_MOVE": {
      const { to, from, piece } = action.pendingMove
      state.boardState.board[to.x][to.y].piece = piece
      state.boardState.board[from.x][from.y].piece = null

      return {
        ...state,
        disabled: true,
        boardState: { ...state.boardState, pendingMove: action.pendingMove },
      }
    }
    case "CANCEL_MOVE": {
      if (!state.boardState.pendingMove) {
        return state
      }

      const { to, from, piece, capturedPiece } = state.boardState.pendingMove
      state.boardState.board[to.x][to.y].piece = capturedPiece
      state.boardState.board[from.x][from.y].piece = piece

      return {
        ...state,
        disabled: false,
        boardState: {
          ...state.boardState,
          selectedCell: undefined,
          pendingMove: undefined,
        },
      }
    }
    case "CONFIRM_MOVE": {
      if (!state.boardState.pendingMove) {
        return state
      }

      const { to, from, piece } = state.boardState.pendingMove
      const capturedPiece = to.piece
      piece.hasMoved = true

      if (to.x !== 2) {
        piece.canPromote = true
      }

      state.boardState.board[to.x][to.y].piece = piece
      state.boardState.board[from.x][from.y].piece = null

      const { turn, checkedColor, status, move } = moveHelper(
        state.turn,
        state.boardState.board,
        state.previousMoves,
        { to, from, piece },
        null
      )

      return {
        ...state,
        turn,
        status,
        disabled: false,
        boardState: {
          ...state.boardState,
          selectedCell: undefined,
          pendingMove: undefined,
        },
        capturedPieces: capturedPiece
          ? {
              ...state.capturedPieces,
              [piece.color]: [
                ...state.capturedPieces[piece.color],
                capturedPiece,
              ],
            }
          : state.capturedPieces,
        check: checkedColor,
        previousMoves: [...state.previousMoves, move],
        ...(canPromote(piece, to) && {
          check: state.check,
          promotionCoordinates: { from, to, piece },
          previousMoves: state.previousMoves,
          turn: state.turn,
        }),
      }
    }
    case "PROMOTE_PAWN": {
      if (!state.promotionCoordinates) {
        return state
      }

      const { to, from, piece } = state.promotionCoordinates
      if (action.piece.type !== "pawn-cw") {
        state.boardState.board[to.x][to.y].piece = action.piece
      }

      const target = state.boardState.board[to.x][to.y].piece
      if (target) {
        target.canPromote = false
      }

      const { turn, checkedColor, status, move } = moveHelper(
        state.turn,
        state.boardState.board,
        state.previousMoves,
        { to, from, piece },
        action.piece
      )

      return {
        ...state,
        status,
        turn,
        boardState: { ...state.boardState },
        previousMoves: [...state.previousMoves, move],
        promotionCoordinates: undefined,
        check: checkedColor,
      }
    }
    case "START_GAME": {
      const duration = action.duration
      return {
        ...state,
        player: action.players ? action.players[0] : state.player,
        opponent: action.players ? action.players[1] : state.opponent,
        status: "playing",
        timer: duration ? { w: duration, b: duration } : undefined,
      }
    }
    case "SET_STATUS": {
      return { ...state, status: action.status }
    }
    case "DECREMENT_TIMER": {
      if (!state.timer) return state
      return {
        ...state,
        timer: {
          ...state.timer,
          [action.player]: state.timer[action.player] - 1,
        },
      }
    }
    case "SET_WINNER": {
      return { ...state, winner: action.player }
    }
    case "END_GAME": {
      return {
        ...state,
        winner:
          state.winner ??
          (state.status.startsWith("draw")
            ? "draw"
            : state.status === "opponent-left"
              ? state.player.color
              : state.turn === "w"
                ? "b"
                : "w"),
        disabled: true,
      }
    }
    case "RESET_GAME": {
      return createGameState()
    }
    case "SYNC_GAME": {
      return { ...state, ...action.state }
    }
    case "RESET_BOARD": {
      const entire: boolean = action.entire
      return {
        ...state,
        turn: "w",
        boardState: {
          ...state.boardState,
          board: resetBoard(state.boardState.board, entire),
        },
      }
    }
    case "SET_PIECE": {
      const { to } = action.move
      if (to !== null && state.testPiece !== undefined)
        state.boardState.board[to.x][to.y].piece = state.testPiece
      if (to !== null && state.testPiece === undefined)
        state.boardState.board[to.x][to.y].piece = null
      return {
        ...state,
        boardState: { ...state.boardState },
      }
    }
    default:
      return state
  }
}
