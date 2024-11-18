import type { LocalGameAction, LocalGameState } from "./types"
import { getPossibleMoves } from "../piece/utils"

export function localGameReducer(
  state: LocalGameState,
  action: LocalGameAction
): LocalGameState {
  switch (action.type) {
    case "SELECT_CELL":
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
    case "SET_OVER_CELL":
      return {
        ...state,
        boardState: {
          ...state.boardState,
          overCell: action.payload,
        },
      }
    case "MOVE_PIECE":
      const { to, from, piece } = action.payload

      const capturedPiece = to.piece

      state.boardState.board[to.x][to.y].piece = piece
      state.boardState.board[from.x][from.y].piece = null

      return {
        ...state,
        turn: state.turn === "w" ? "b" : "w",
        boardState: {
          ...state.boardState,
          selectedCell: null,
          overCell: null,
        },
        capturedPieces:
          capturedPiece === null
            ? state.capturedPieces
            : {
                ...state.capturedPieces,
                [piece.color]: [
                  ...state.capturedPieces[piece.color],
                  capturedPiece,
                ],
              },
      }

    default:
      return state
  }
}
