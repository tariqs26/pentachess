"use client"

import { io, Socket } from "socket.io-client"
import type { GameStatus, Player, SyncState } from "@/features/game/types"
import type { PieceColor } from "@/features/piece/types"

type GameEndState = {
  status: GameStatus
  winner: PieceColor | "draw"
}

export type ServerToClientEvents = {
  start: (data: { gameId: string; players: [Player, Player] }) => void
  move: (state: SyncState) => void
  end: (state: GameEndState) => void
  leave: () => void
}

export type ClientToServerEvents = {
  join: (data: { userId: string; username: string }) => void
  move: (data: SyncState) => void
  end: (data: GameEndState) => void
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.SERVER_URL ?? "http://localhost:8080"
)
