"use client"

import { io, type Socket } from "socket.io-client"
import type { GameStatus, Player, SyncState } from "@/features/game/types"
import type { PieceColor } from "@/features/piece/types"

type GameEndData = { status: GameStatus; winner: PieceColor | "draw" }

export type ServerToClientEvents = {
  start: (data: { gameId: string; players: [Player, Player] }) => void
  move: (data: SyncState) => void
  end: (data: GameEndData) => void
  leave: () => void
}

export type ClientToServerEvents = {
  join: (data: { userId: string; username: string }) => void
  move: (data: SyncState) => void
  end: (data: GameEndData) => void
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.SERVER_URL ?? "http://localhost:8080"
)
