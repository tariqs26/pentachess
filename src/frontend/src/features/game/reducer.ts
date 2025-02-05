import { getPossibleMoves, canPromote } from "../piece/utils"
import { pieceNames } from "../piece/constants"
import type { LocalGameAction, LocalGameState, Move } from "./types"

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
      const { to, from, piece } = action.payload;
      const capturedPiece = to.piece

      piece.hasMoved = true

      state.boardState.board[to.x][to.y].piece = piece
      state.boardState.board[from.x][from.y].piece = null
      
      const rows = ["C", "B", "A"];
      const notation = `${state.turn === "w" ? "Y: " : "O: "} ${pieceNames[piece.type]} ${rows[to.x] + to.y}`

      const newMove: Move = {
        from,
        to,
        piece,
        pieceCaptured: capturedPiece,
        check: false,
        checkmate: false,
        piecePromoted: null,
        notation,
        timestamp: new Date(),
      }

      return {
        ...state,
        turn: state.turn === "w" ? "b" : "w",
        boardState: {
          ...state.boardState,
          selectedCell: null,
          overCell: null,
        },
        capturedPieces: capturedPiece
          ? {
          ...state.capturedPieces,
          [piece.color]: [...state.capturedPieces[piece.color], capturedPiece],
        }
          : state.capturedPieces,
        previousMoves: [newMove, ...state.previousMoves],
        startTimeForMove: Date.now(),
        ...(canPromote(piece, to) && {
          status: "promoting",
          promotionCoordinates: [to.x, to.y],
          turn: state.turn,
        }),
      }
    }
    case "PROMOTE_PAWN": {
      if (state.promotionCoordinates) {
        const [x, y] = state.promotionCoordinates
        state.boardState.board[x][y].piece = action.payload
      }

      return {
        ...state,
        boardState: { ...state.boardState },
        status: "playing",
        promotionCoordinates: undefined,
        turn: state.turn === "w" ? "b" : "w",
      }
    }
    case "START_GAME": {
      return {
        ...state,
        status: "playing",
        startTimeForMove: Date.now(),
      }
    }
    default:
      return state
  }
}
