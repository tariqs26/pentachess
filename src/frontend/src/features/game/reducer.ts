import { checkForCheckOrMate, checkForStalemate } from "../board/utils"
import { canPromote, getPossibleMoves } from "../piece/utils"
import type { LocalGameAction, LocalGameState } from "./types"
import { createNewGameState, getMove } from "./utils"

export function localGameReducer(
  state: LocalGameState,
  action: LocalGameAction
): LocalGameState {
  switch (action.type) {
    case "SELECT_CELL": {
      return {
        ...state,
        boardState: {
          ...state.boardState,
          selectedCell: action.cell
            ? {
                cell: action.cell,
                availableMoves: getPossibleMoves(
                  action.cell,
                  state.boardState.board
                ),
              }
            : null,
        },
      }
    }
    case "SET_OVER_CELL": {
      return {
        ...state,
        boardState: { ...state.boardState, overCell: action.cell },
      }
    }
    case "DISABLE_BOARD": {
      return {
        ...state,
        boardState: { ...state.boardState, disabled: true },
      }
    }
    case "MOVE_PIECE": {
      const { to, from, piece } = action.move
      const capturedPiece = to.piece
      piece.hasMoved = true

      state.boardState.board[to.x][to.y].piece = piece
      state.boardState.board[from.x][from.y].piece = null

      const turn = state.turn === "w" ? "b" : "w"

      const [checkedColor, isCheckmate] = checkForCheckOrMate(
        state.boardState.board,
        turn
      )

      const status = isCheckmate
        ? "checkmate"
        : checkForStalemate(state.boardState.board, turn)
          ? "draw-stalemate"
          : "playing"

      const newMove = getMove(
        state.turn,
        from,
        to,
        piece,
        null,
        checkedColor,
        status
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
        previousMoves: [...state.previousMoves, newMove],
        ...(canPromote(piece, to) && {
          status: "promoting",
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

      const turn = state.turn === "w" ? "b" : "w"

      const [checkedColor, isCheckmate] = checkForCheckOrMate(
        state.boardState.board,
        turn
      )

      const status = isCheckmate
        ? "checkmate"
        : checkForStalemate(state.boardState.board, turn)
          ? "draw-stalemate"
          : "playing"

      const { from, to, piece } = state.promotionCoordinates
      const { x, y } = to

      state.boardState.board[x][y].piece = action.piece

      const newMove = getMove(
        state.turn,
        from,
        to,
        piece,
        action.piece,
        checkedColor,
        status
      )

      return {
        ...state,
        status,
        turn,
        boardState: { ...state.boardState },
        previousMoves: [...state.previousMoves, newMove],
        promotionCoordinates: undefined,
        check: checkedColor,
      }
    }
    case "START_GAME": {
      const duration = action.duration ?? 1200
      return {
        ...state,
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
        boardState: { ...state.boardState, disabled: true },
      }
    }
    case "RESET_GAME": {
      return createNewGameState()
    }
    default:
      return state
  }
}
