import { io, type Socket } from "socket.io-client"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest"
import { GameServer } from "../src/game-server"
import type { ClientToServerEvents, ServerToClientEvents } from "../src/types"

const TEST_PORT = process.env.TEST_PORT ?? "8081"

describe("GameServer", () => {
  let gameServer: GameServer
  let client1: Socket<ServerToClientEvents, ClientToServerEvents>
  let client2: Socket<ServerToClientEvents, ClientToServerEvents>

  beforeAll(() => {
    gameServer = new GameServer(`http://localhost:${TEST_PORT}`)
    gameServer.start(TEST_PORT)
  })

  afterAll(async () => {
    await gameServer.stop()
  })

  beforeEach(() => {
    client1 = io(`http://localhost:${TEST_PORT}`)
    client2 = io(`http://localhost:${TEST_PORT}`)
  })

  afterEach(() => {
    client1.disconnect()
    client2.disconnect()
  })

  it("should put new player in game queue", () =>
    new Promise<void>((done) => {
      client1.emit("join", { userId: "user1", username: "Player 1" })

      setTimeout(() => {
        expect(gameServer.queue.length).toBe(1)
        expect(gameServer.queue[0]).toBe(client1.id)
        expect(gameServer.gamesCount).toBe(1)
        done()
      }, 200)
    }))

  it("should not put player in queue if already in a game", () =>
    new Promise<void>((done) => {
      client1.emit("join", { userId: "user1", username: "Player 1" })

      setTimeout(() => {
        client1.emit("join", { userId: "user1", username: "Player 1" })
      }, 200)

      setTimeout(() => {
        expect(gameServer.queue.length).toBe(1)
        expect(gameServer.queue[0]).toBe(client1.id)
        expect(gameServer.gamesCount).toBe(1)
        done()
      }, 400)
    }))

  it("should start a game when two players join", () =>
    new Promise<void>((done) => {
      let gameStarted = false

      client1.emit("join", { userId: "user1", username: "Player 1" })

      setTimeout(() => {
        if (!gameStarted) {
          client2.emit("join", { userId: "user2", username: "Player 2" })
        }
      }, 200)

      client2.on("start", (data) => {
        gameStarted = true
        expect(data.gameId).toBe(client1.id)
        expect(data.players.length).toBe(2)
        expect(data.players[0].id).toBe(client1.id)
        expect(data.players[0].userId).toBe("user1")
        expect(data.players[0].username).toBe("Player 1")
        expect(data.players[1].id).toBe(client2.id)
        expect(data.players[1].userId).toBe("user2")
        expect(data.players[1].username).toBe("Player 2")
        expect(data.players[0].color !== data.players[1].color).toBe(true)
        expect(gameServer.queue.length).toBe(0)
        expect(gameServer.gamesCount).toBe(1)
        done()
      })
    }))

  it("should sync moves between players", () =>
    new Promise<void>((done) => {
      client1.emit("join", { userId: "user1", username: "Player 1" })
      client2.emit("join", { userId: "user2", username: "Player 2" })

      const moveData = { from: "e2", to: "e4" }

      setTimeout(() => {
        client1.emit("move", moveData)
      }, 200)

      client2.on("move", (data) => {
        expect(data).toEqual(moveData)
        done()
      })
    }))

  it("should remove the game and sync end data to other player", () =>
    new Promise<void>((done) => {
      client1.emit("join", { userId: "user1", username: "Player 1" })
      client2.emit("join", { userId: "user2", username: "Player 2" })

      const endData = { winner: "w", status: "checkmate" } as const

      setTimeout(() => {
        expect(gameServer.gamesCount).toBe(1)
        client1.emit("end", endData)
      }, 200)

      client2.on("end", (data) => {
        expect(data).toEqual(endData)
        expect(gameServer.gamesCount).toBe(0)
        done()
      })
    }))

  it("should remove the game and notify the other player on disconnect", () =>
    new Promise<void>((done) => {
      client1.emit("join", { userId: "user1", username: "Player 1" })
      client2.emit("join", { userId: "user2", username: "Player 2" })

      setTimeout(() => {
        expect(gameServer.gamesCount).toBe(1)
        client1.disconnect()
      }, 200)

      client2.on("leave", () => {
        expect(gameServer.gamesCount).toBe(0)
        done()
      })
    }))
})
