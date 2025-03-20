import { createServer } from "node:http"
import dotenv from "dotenv"
import { Server } from "socket.io"
import type {
  ClientToServerEvents,
  Player,
  ServerToClientEvents,
} from "./types.ts"

if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const server = createServer()

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

const games = new Map<string, [Player, Player | null]>()
const gamesQueue: string[] = []

io.on("connection", (socket) => {
  let gameId: string | null = null

  socket.on("join", (data) => {
    console.info(`[join] player joined: ${data.username}`)
    for (const players of games.values()) {
      if (players.some((p) => p?.userId === data.userId)) {
        console.warn("[join] player already in game")
        return
      }
    }

    const nextGameInQueue = gamesQueue.shift()
    if (nextGameInQueue) {
      gameId = nextGameInQueue
      const opponent = games.get(gameId)?.[0]

      if (!opponent || opponent.userId === data.userId) return

      const player: Player = {
        id: socket.id,
        userId: data.userId,
        username: data.username,
        color: opponent.color === "w" ? "b" : "w",
      }

      games.set(gameId, [opponent, player])
      socket.join(gameId)
      console.info(
        `[join] game started: ${gameId}, players: (${player.username}, ${opponent.username})`
      )
      io.to(gameId).emit("start", { gameId, players: [opponent, player] })
    } else {
      gameId = socket.id
      gamesQueue.push(gameId)

      const player: Player = {
        id: socket.id,
        color: Math.random() > 0.5 ? "w" : "b",
        userId: data.userId,
        username: data.username,
      }

      games.set(gameId, [player, null])
      socket.join(gameId)
    }
  })

  socket.on("move", (data) => {
    if (!gameId) return
    const players = games.get(gameId)
    if (!players || !players[1]) return
    io.to(gameId).emit("move", data)
  })

  socket.on("end", (data) => {
    if (!gameId) return
    const players = games.get(gameId)
    if (!players || !players[1]) return

    console.info(
      `[end] game ended: ${gameId}, winner: ${data.winner}, status: ${data.status}`
    )
    io.to(gameId).emit("end", data)
    games.delete(gameId)
  })

  socket.on("disconnect", () => {
    console.info(`[disconnect] disconnected: ${socket.id}, game: ${gameId}`)
    if (!gameId) return

    const players = games.get(gameId)
    if (!players) return
    if (players[1] !== null) io.to(gameId).emit("leave")

    socket.leave(gameId)
    games.delete(gameId)

    // remove game from queue
    const index = gamesQueue.indexOf(gameId)
    if (index !== -1) gamesQueue.splice(index, 1)
  })
})

const port = process.env.PORT ?? 8080

server
  .listen(port, () => {
    console.info(`🚀 server is listening on: http://localhost:${port}`)
  })
  .on("error", (error) => {
    console.error(`💥 server error: ${error}`)
  })
