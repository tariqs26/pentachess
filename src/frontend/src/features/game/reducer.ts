import { checkForCheckOrMate } from "../board/utils"
import { canPromote, getPossibleMoves } from "../piece/utils"
import type { LocalGameAction, LocalGameState } from "./types"

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

      return {
        ...state,
        turn: state.turn === "w" ? "b" : "w",
        status: isCheckmate ? "checkmate" : "playing",
        boardState: {
          ...state.boardState,
          selectedCell: null,
          overCell: null,
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
        ...(canPromote(piece, to) && {
          status: "promoting",
          promotionCoordinates: [to.x, to.y],
          check: state.check,
          turn: state.turn,
        }),
      }
    }
    case "PROMOTE_PAWN": {
      if (state.promotionCoordinates) {
        const [x, y] = state.promotionCoordinates
        state.boardState.board[x][y].piece = action.payload
      }

      const turn = state.turn === "w" ? "b" : "w"

      const [checkedColor, isCheckmate] = checkForCheckOrMate(
        state.boardState.board,
        turn
      )

      return {
        ...state,
        status: isCheckmate ? "checkmate" : "playing",
        turn,
        boardState: { ...state.boardState },
        promotionCoordinates: undefined,
        check: checkedColor,
      }
    }
    case "START_GAME": {
      return {
        ...state,
        status: "playing",
        timer: action.payload
          ? { w: action.payload, b: action.payload }
          : state.timer,
      }
    }
    default:
      return state
  }
}
