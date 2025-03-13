import dotenv from "dotenv"
import { createServer } from "node:http"
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
  cors: { origin: "*" },
})

const gamesMap = new Map<string, [Player, Player | null]>()
const gamesQueue: string[] = []

io.on("connection", (socket) => {
  let gameId: string | null = null

  console.info("Connected:", socket.id)

  socket.on("join", (data) => {
    console.info("Player joined:", data)
    for (const players of gamesMap.values()) {
      if (players.some((p) => p?.userId === data.userId)) {
        console.info("⚠️ User already in game")
        return
      }
    }

    const nextGameInQueue = gamesQueue.shift()
    if (nextGameInQueue) {
      gameId = nextGameInQueue
      const opponent = gamesMap.get(gameId)?.[0]

      if (!opponent || opponent.userId === data.userId) {
        console.error("❌ Invalid opponent state")
        return
      }

      const player: Player = {
        id: socket.id,
        userId: data.userId,
        username: data.username,
        color: opponent.color === "w" ? "b" : "w",
      }

      gamesMap.set(gameId, [opponent, player])
      socket.join(gameId)
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

      gamesMap.set(gameId, [player, null])
      socket.join(gameId)
    }
  })

  socket.on("move", (data) => {
    if (!gameId) return

    const players = gamesMap.get(gameId)
    if (!players || !players[1]) {
      console.error("❌ Move rejected: Game not started")
      return
    }

    io.to(gameId).emit("move", data)
  })

  socket.on("end", (data) => {
    if (!gameId) return

    const players = gamesMap.get(gameId)
    if (!players || !players[1]) {
      console.error("❌ Game end rejected: Game not started")
      return
    }

    io.to(gameId).emit("end", data)
    gamesMap.delete(gameId)
  })

  socket.on("disconnect", () => {
    console.info("\n❌ Disconnected:", { socketId: socket.id, gameId })
    if (!gameId) return

    const players = gamesMap.get(gameId)
    if (!players) return
    if (players[1] !== null) io.to(gameId).emit("leave")

    socket.leave(gameId)
    gamesMap.delete(gameId)

    const index = gamesQueue.indexOf(gameId)
    if (index !== -1) {
      console.info("🗑️ Removing from queue:", gameId)
      gamesQueue.splice(index, 1)
    }
  })
})

const port = process.env.PORT ?? 8080

server
  .listen(port, () => {
    console.info(`🚀 Server is listening on: http://localhost:${port}`)
  })
  .on("error", (error) => {
    console.error(`💥 Server error: ${error}`)
  })
