import { createServer, type Server as HTTPServer } from "node:http"
import { Server } from "socket.io"
import type {
  ClientToServerEvents,
  Player,
  ServerToClientEvents,
} from "./types.ts"

export class GameServer {
  private server: HTTPServer
  private io: Server<ClientToServerEvents, ServerToClientEvents>
  private games = new Map<string, [Player, Player | null]>()
  private gamesQueue: string[] = []

  constructor(origin = process.env.CORS_ORIGIN ?? "http://localhost:3000") {
    this.server = createServer()
    this.io = new Server<ClientToServerEvents, ServerToClientEvents>(
      this.server,
      { cors: { origin, methods: ["GET", "POST"] } }
    )
    this.setupSocketHandlers()
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      let gameId: string | null = null

      socket.on("join", (data) => {
        console.info(`[join] player joined: ${data.username}`)
        for (const players of this.games.values()) {
          if (players.some((p) => p?.userId === data.userId)) {
            console.warn("[join] player already in game")
            return
          }
        }

        const nextGameInQueue = this.gamesQueue.shift()
        if (nextGameInQueue) {
          gameId = nextGameInQueue
          const opponent = this.games.get(gameId)?.[0]

          if (!opponent || opponent.userId === data.userId) return

          const player: Player = {
            id: socket.id,
            userId: data.userId,
            username: data.username,
            color: opponent.color === "w" ? "b" : "w",
          }

          this.games.set(gameId, [opponent, player])
          socket.join(gameId)
          console.info(
            `[join] game started: ${gameId}, players: (${player.username}, ${opponent.username})`
          )
          this.io
            .to(gameId)
            .emit("start", { gameId, players: [opponent, player] })
        } else {
          gameId = socket.id
          this.gamesQueue.push(gameId)

          const player: Player = {
            id: socket.id,
            color: Math.random() > 0.5 ? "w" : "b",
            userId: data.userId,
            username: data.username,
          }

          this.games.set(gameId, [player, null])
          socket.join(gameId)
        }
      })

      socket.on("move", (data) => {
        if (!gameId) return
        const players = this.games.get(gameId)
        if (!players || !players[1]) return
        this.io.to(gameId).emit("move", data)
      })

      socket.on("end", (data) => {
        if (!gameId) return
        const players = this.games.get(gameId)
        if (!players || !players[1]) return

        console.info(
          `[end] game ended: ${gameId}, winner: ${data.winner}, status: ${data.status}`
        )
        this.io.to(gameId).emit("end", data)
        this.games.delete(gameId)
      })

      socket.on("disconnect", () => {
        console.info(`[disconnect] disconnected: ${socket.id}, game: ${gameId}`)
        if (!gameId) return

        const players = this.games.get(gameId)
        if (!players) return
        if (players[1] !== null) this.io.to(gameId).emit("leave")

        socket.leave(gameId)
        this.games.delete(gameId)

        // remove game from queue
        const index = this.gamesQueue.indexOf(gameId)
        if (index !== -1) this.gamesQueue.splice(index, 1)
      })
    })
  }

  get gamesCount() {
    return this.games.size
  }

  get queue() {
    return this.gamesQueue
  }

  public start(port = process.env.PORT ?? "8080") {
    this.server
      .listen(port, () => {
        console.info(`🚀 server is listening on: http://localhost:${port}`)
      })
      .on("error", (error) => {
        console.error(`💥 server error: ${error}`)
      })
  }

  public stop() {
    return new Promise<void>((resolve) => {
      this.io.close(() => {
        this.server.close(() => {
          this.games.clear()
          this.gamesQueue.length = 0
          resolve()
        })
      })
    })
  }
}
