import { useEffect, useState } from "react"
import { useLocalGame } from "@/features/game/useLocalGame"
import { isGameOver } from "@/features/game/utils"
import type { Piece } from "@/features/piece/types"
import { type ServerToClientEvents, socket } from "@/lib/socket"

export function useGame(userId: string, username: string) {
  const { state, dispatch } = useLocalGame()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const onConnect = () => {
      console.info("Connected as:", { userId, username })
      setConnected(true)
      socket.emit("join", { userId, username })
    }

    if (socket.connected) onConnect()

    const onDisconnect = () => {
      console.info("Disconnected")
      setConnected(false)
    }

    if (socket.disconnected) setConnected(false)

    const onStartGame: ServerToClientEvents["start"] = (data) => {
      console.info("Game started:", data)
      const players = data.players
      if (players[0].userId !== userId) {
        // eslint-disable-next-line no-extra-semi
        ;[players[0], players[1]] = [players[1], players[0]]
      }
      dispatch({ type: "START_GAME", players })
    }

    const onMove: ServerToClientEvents["move"] = (newState) => {
      if (newState.turn !== state.player.color) return
      console.info("📥 Received move", newState)
      dispatch({ type: "SYNC_GAME", state: newState })
    }

    const onLeave = () => {
      if (state.status === "playing") {
        console.info("Opponent left the game")
        dispatch({ type: "SET_WINNER", player: state.player.color })
        dispatch({ type: "SET_STATUS", status: "opponent-left" })
      } else {
        console.info("Rejoining queue as:", { userId, username })
        dispatch({ type: "RESET_GAME" })
        socket.emit("join", { userId, username })
      }
    }

    const onGameEnd: ServerToClientEvents["end"] = (data) => {
      console.info("📥 Received game end:", data)
      if (data.winner !== "draw")
        dispatch({ type: "SET_WINNER", player: data.winner })
      dispatch({ type: "SET_STATUS", status: data.status })
      dispatch({ type: "END_GAME" })
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("start", onStartGame)
    socket.on("move", onMove)
    socket.on("leave", onLeave)
    socket.on("end", onGameEnd)

    if (!socket.connected) {
      console.info("Attempting to connect...")
      socket.connect()
    }

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("start", onStartGame)
      socket.off("move", onMove)
      socket.off("leave", onLeave)
      socket.off("end", onGameEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.player.color, state.status, userId, username])

  useEffect(() => {
    if (state.status !== "playing") return

    const interval = setInterval(() => {
      dispatch({ type: "DECREMENT_TIMER", player: state.turn })

      if (state.timer[state.turn] <= 0) {
        dispatch({ type: "SET_WINNER", player: state.turn === "w" ? "b" : "w" })
        dispatch({ type: "SET_STATUS", status: "time-expired" })
      }
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.turn])

  useEffect(() => {
    if (state.status !== "playing") return

    const lastMove = state.previousMoves[state.previousMoves.length - 1]
    if (!lastMove) return

    if (lastMove.player === state.player.color) {
      console.info("Sending move:", lastMove)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { opponent, player, promotionCoordinates, ...syncState } = state

      socket.emit("move", syncState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.previousMoves.length])

  useEffect(() => {
    if (isGameOver(state.status)) {
      if (state.status === "resignation") {
        socket.emit("end", {
          status: "resignation",
          winner: state.player.color === "w" ? "b" : "w",
        })
      }
      dispatch({ type: "END_GAME" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status])

  const handlePlayAgain = () => {
    socket.emit("join", { userId, username })
    dispatch({ type: "RESET_GAME" })
  }

  const handleResign = () => {
    dispatch({ type: "SET_STATUS", status: "resignation" })
  }

  const handlePromotion = (piece: Piece) => {
    dispatch({ type: "PROMOTE_PAWN", piece })
  }

  return {
    state,
    connected,
    handlePlayAgain,
    handleResign,
    handlePromotion,
  }
}
