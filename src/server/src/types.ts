type PieceColor = "w" | "b"

export type Player = {
  id: string
  color: PieceColor
  userId: string
  username: string
}

type SyncState = {} // temporary placeholder

type GameEndState = { status: string; winner: PieceColor | "draw" }

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
