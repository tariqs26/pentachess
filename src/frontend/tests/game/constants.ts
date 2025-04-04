import { Player } from "@/features/game/types"

export const TEST_TIMESTAMP = new Date("2025-01-01T00:00:00.000Z")

export const TEST_PLAYERS: [Player, Player] = [
  { id: "1", color: "w", userId: "1", username: "Test Player 1" },
  { id: "2", color: "b", userId: "2", username: "Test Player 2" },
]
