import type { Cell } from "@/features/board/types"
import type { Player } from "@/features/game/types"
import type { Piece } from "@/features/piece/types"

export const createTestMove = (from: Cell, to: Cell, piece: Piece) => ({
  from,
  to,
  piece,
  piecePromoted: null,
})

export const createTestPlayers = (): [Player, Player] => [
  { id: "1", color: "w", userId: "1", username: "Test Player 1" },
  { id: "2", color: "b", userId: "2", username: "Test Player 2" },
]
