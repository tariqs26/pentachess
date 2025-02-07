import { getPossibleMoves, canPromote } from "../piece/utils"
import { pieceNames } from "../piece/constants"
import type { LocalGameAction, LocalGameState, Move } from "./types"
import { Piece, PieceColor } from "../piece/types"
import { Cell } from "../board/types"


const getMove = (from: Cell, to: Cell, piece: Piece, player: PieceColor): Move => {
  const pieceAbrev = pieceNames[piece.type];
  const capturedPieceAbrev = to.piece ? pieceNames[to.piece.type] : "";
  const rows = ["C", "B", "A"];
  const fromPosition = `${rows[from.x]}${from.y}`;
  const toPosition = `${rows[to.x]}${to.y}`;
  const captureNotation = capturedPieceAbrev ? `(${capturedPieceAbrev})` : "";
  const notation = `${pieceAbrev}: ${fromPosition} → ${toPosition} ${captureNotation}`;

  return {
    player,
    from,
    to,
    piece,
    pieceCaptured: to.piece,
    check: false,
    checkmate: false,
    piecePromoted: null,
    notation,
    timestamp: new Date(),
  };
};

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

      const newMove = getMove(from, to, piece, state.turn)

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
        previousMoves: [...state.previousMoves, newMove],
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
      const duration = action.payload ? action.payload : 1200
      return {
        ...state,
        status: "playing",
        timer: {
          w: duration,
          b: duration,
        },
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
