import { Cell } from "../board/types";
import { PIECE_DATA } from "../piece/constants";
import { Piece, PieceColor } from "../piece/types";
import { Move } from "./types";

export const getMove = (from: Cell, to: Cell, piece: Piece, player: PieceColor): Move => {
  const pieceAbrev = PIECE_DATA[piece.type].abbr;
  const capturedPieceAbrev = to.piece ? PIECE_DATA[piece.type].abbr : "";
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