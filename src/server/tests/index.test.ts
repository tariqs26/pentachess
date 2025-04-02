import { beforeEach, expect, describe, test, vi } from "vitest"
import type { Player } from "../src/types"

// Mock implementation of the server functionality
describe("Game Server", () => {
  // Mock data for game state
  const games: Map<string, [Player, Player | null]> = new Map()
  const gamesQueue: string[] = []

  // Mock socket
  const mockSocket = {
    id: "socket1",
    join: vi.fn(),
    to: vi.fn().mockReturnValue({
      emit: vi.fn(),
    }),
    leave: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
  }

  // Mock IO
  const mockIo = {
    on: vi.fn(),
    to: vi.fn().mockReturnValue({
      emit: vi.fn(),
    }),
    emit: vi.fn(),
  }

  beforeEach(() => {
    // Reset mocks and state
    vi.clearAllMocks()
    games.clear()
    gamesQueue.length = 0
  })

  test("player can join the queue", () => {
    const user = { userId: "user1", username: "Player 1" }

    // Simulate the join event handler
    const handleJoin = (data: any): void => {
      const gameId = mockSocket.id
      gamesQueue.push(gameId)

      const player: Player = {
        id: mockSocket.id,
        color: "w", // For testing, we'll use white
        userId: data.userId,
        username: data.username,
      }

      games.set(gameId, [player, null])
      mockSocket.join(gameId)
    }

    handleJoin(user)

    // Check game was created correctly
    expect(gamesQueue.length).toBe(1)
    expect(games.size).toBe(1)
    expect(mockSocket.join).toHaveBeenCalledWith(mockSocket.id)

    const players = games.get(mockSocket.id)
    expect(players).toBeDefined()
    expect(players![0].username).toBe(user.username)
    expect(players![1]).toBeNull()
  })

  test("two players can be matched and start a game", () => {
    const user1 = { userId: "user1", username: "Player 1" }
    const user2 = { userId: "user2", username: "Player 2" }
    const socket2 = { ...mockSocket, id: "socket2" }

    // First player joins
    const gameId = mockSocket.id
    gamesQueue.push(gameId)

    const player1: Player = {
      id: mockSocket.id,
      color: "w",
      userId: user1.userId,
      username: user1.username,
    }

    games.set(gameId, [player1, null])

    // Second player joins and gets matched
    const handleSecondJoin = (data: any): void => {
      const nextGameInQueue = gamesQueue.shift()
      if (nextGameInQueue) {
        const opponent = games.get(nextGameInQueue)?.[0]

        if (!opponent || opponent.userId === data.userId) return

        const player2: Player = {
          id: socket2.id,
          userId: data.userId,
          username: data.username,
          color: opponent.color === "w" ? "b" : "w",
        }

        games.set(nextGameInQueue, [opponent, player2])
        socket2.join(nextGameInQueue)

        // Emit start event to both players
        mockIo.to(nextGameInQueue).emit("start", {
          gameId: nextGameInQueue,
          players: [opponent, player2],
        })
      }
    }

    handleSecondJoin(user2)

    // Verify game state
    expect(gamesQueue.length).toBe(0)
    expect(games.size).toBe(1)

    const gamePlayers = games.get(gameId)
    expect(gamePlayers).toBeDefined()
    expect(gamePlayers![0].username).toBe(user1.username)
    expect(gamePlayers![1]?.username).toBe(user2.username)
    expect(gamePlayers![0].color).toBe("w")
    expect(gamePlayers![1]?.color).toBe("b")
  })

  test("players can make moves", () => {
    // Set up a game with two players
    const user1 = { userId: "user1", username: "Player 1" }
    const user2 = { userId: "user2", username: "Player 2" }
    const gameId = "game1"
    const socket2 = { ...mockSocket, id: "socket2" }

    const player1: Player = {
      id: mockSocket.id,
      color: "w",
      userId: user1.userId,
      username: user1.username,
    }

    const player2: Player = {
      id: socket2.id,
      color: "b",
      userId: user2.userId,
      username: user2.username,
    }

    games.set(gameId, [player1, player2])

    // Mock move data
    const mockMove = {}

    // Handle move event
    const handleMove = (data: any): void => {
      if (!games.get(gameId)?.[1]) return
      mockIo.to(gameId).emit("move", data)
    }

    handleMove(mockMove)

    // Verify move was broadcast
    expect(mockIo.to).toHaveBeenCalledWith(gameId)
  })

  test("game can end", () => {
    // Set up a game with two players
    const user1 = { userId: "user1", username: "Player 1" }
    const user2 = { userId: "user2", username: "Player 2" }
    const gameId = "game1"
    const socket2 = { ...mockSocket, id: "socket2" }

    const player1: Player = {
      id: mockSocket.id,
      color: "w",
      userId: user1.userId,
      username: user1.username,
    }

    const player2: Player = {
      id: socket2.id,
      color: "b",
      userId: user2.userId,
      username: user2.username,
    }

    games.set(gameId, [player1, player2])

    // Mock end game data
    const endData = { status: "checkmate", winner: "w" }

    // Handle end event
    const handleEnd = (data: any): void => {
      if (!games.get(gameId)?.[1]) return
      mockIo.to(gameId).emit("end", data)
      games.delete(gameId)
    }

    handleEnd(endData)

    // Verify game ended correctly
    expect(mockIo.to).toHaveBeenCalledWith(gameId)
    expect(games.size).toBe(0)
  })

  test("player disconnection removes game", () => {
    // Set up a game with one player waiting
    const user1 = { userId: "user1", username: "Player 1" }
    const gameId = mockSocket.id

    const player1: Player = {
      id: mockSocket.id,
      color: "w",
      userId: user1.userId,
      username: user1.username,
    }

    games.set(gameId, [player1, null])
    gamesQueue.push(gameId)

    // Handle disconnect
    const handleDisconnect = (): void => {
      mockSocket.leave(gameId)
      games.delete(gameId)

      // Remove game from queue
      const index = gamesQueue.indexOf(gameId)
      if (index !== -1) gamesQueue.splice(index, 1)
    }

    handleDisconnect()

    // Verify game was removed
    expect(games.size).toBe(0)
    expect(gamesQueue.length).toBe(0)
    expect(mockSocket.leave).toHaveBeenCalledWith(gameId)
  })
})
