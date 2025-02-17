import { checkForCheckOrMate } from "../board/utils"
import { canPromote, getPossibleMoves } from "../piece/utils"
import type { LocalGameAction, LocalGameState } from "./types"
import { getMove, isGameOver } from "./utils"

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
          selectedCell: action.payload
            ? {
                cell: action.payload,
                availableMoves: getPossibleMoves(
                  action.payload,
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
        boardState: { ...state.boardState, overCell: action.payload },
      }
    }
    case "MOVE_PIECE": {
      const { to, from, piece } = action.payload
      const capturedPiece = to.piece
      piece.hasMoved = true

      state.boardState.board[to.x][to.y].piece = piece
      state.boardState.board[from.x][from.y].piece = null

      const [checkedColor, isCheckmate] = checkForCheckOrMate(
        state.boardState.board,
        state.turn === "w" ? "b" : "w"
      )

      const status = isCheckmate ? "checkmate" : "playing"

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
        turn: state.turn === "w" ? "b" : "w",
        status,
        boardState: {
          ...state.boardState,
          selectedCell: null,
          overCell: null,
          disabled: isGameOver(status),
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

      const status = isCheckmate ? "checkmate" : "playing"
      const { from, to, piece } = state.promotionCoordinates
      const { x, y } = to

      state.boardState.board[x][y].piece = action.payload

      const newMove = getMove(
        state.turn,
        from,
        to,
        piece,
        action.payload,
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
      const duration = action.payload ? action.payload : 1200
      return {
        ...state,
        status: "playing",
        timer: { w: duration, b: duration },
      }
    }
    case "UPDATE_STATUS": {
      return {
        ...state,
        boardState: {
          ...state.boardState,
          disabled: isGameOver(action.payload),
        },
        status: action.payload,
      }
    }
    case "DECREMENT_TIMER": {
      return {
        ...state,
        timer: {
          ...state.timer,
          [action.payload]: state.timer[action.payload] - 1,
        },
      }
    }
    default:
      return state
  }
}
