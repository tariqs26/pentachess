import { canPromote, getInvalidMoves, getPossibleMoves } from "../piece/utils"
import type { LocalGameAction, LocalGameState } from "./types"
import { createLocalGameState, moveHelper } from "./utils"

export function localGameReducer(
  state: LocalGameState,
  action: LocalGameAction
): LocalGameState {
  switch (action.type) {
    case "SELECT_CELL": {
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
        boardState: { ...state.boardState, selectedCell: null },
      }
    }
    case "SET_OVER_CELL": {
      return {
        ...state,
        boardState: { ...state.boardState, overCell: action.cell },
      }
    }
    case "MOVE_PIECE": {
      const { to, from, piece } = action.move
      const capturedPiece = to.piece
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

      return {
        ...state,
        turn,
        status,
        boardState: { ...state.boardState, selectedCell: null, overCell: null },
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
          previousMoves: state.previousMoves, // remove the new move, as it will be added after promotion
          turn: state.turn,
        }),
      }
    }
    case "PROMOTE_PAWN": {
      if (!state.promotionCoordinates) {
        return state
      }

      const { to, from, piece } = state.promotionCoordinates
      state.boardState.board[to.x][to.y].piece = action.piece

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
      const duration = action.duration ?? 1200
      return {
        ...state,
        player: action.players ? action.players[0] : state.player,
        opponent: action.players ? action.players[1] : state.opponent,
        status: "playing",
        timer: { w: duration, b: duration },
      }
    }
    case "SET_STATUS": {
      return { ...state, status: action.status }
    }
    case "DECREMENT_TIMER": {
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
            : state.turn === "w"
              ? "b"
              : "w"),
        disabled: true,
      }
    }
    case "RESET_GAME": {
      return createLocalGameState()
    }
    case "SYNC_GAME": {
      return { ...state, ...action.state }
    }
    default:
      return state
  }
}
