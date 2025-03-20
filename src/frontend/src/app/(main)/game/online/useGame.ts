import { useEffect, useState } from "react"
import { useLocalGame } from "@/features/game/useLocalGame"
import { isGameOver } from "@/features/game/utils"
import type { Piece } from "@/features/piece/types"
import { type ServerToClientEvents, socket } from "@/lib/socket"
import { sleep } from "@/lib/utils"

export function useGame(userId: string, username: string) {
  const { state, dispatch } = useLocalGame()
  const [connected, setConnected] = useState(false)

  // effect: socket connection/disconnection
  useEffect(() => {
    socket.connect()

    const onConnect = async () => {
      setConnected(true)
      await sleep(1000)
      socket.emit("join", { userId, username })
    }

    const onDisconnect = () => {
      setConnected(false)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // effect: socket events
  useEffect(() => {
    const onStartGame: ServerToClientEvents["start"] = (data) => {
      if (data.players[0].id !== socket.id) data.players.reverse()
      dispatch({ type: "RESET_GAME" })
      dispatch({ type: "START_GAME", players: data.players })
    }

    const onMove: ServerToClientEvents["move"] = (newState) => {
      if (newState.turn !== state.player.color) return
      dispatch({ type: "SYNC_GAME", state: newState })
    }

    const onLeave: ServerToClientEvents["leave"] = () => {
      if (state.status !== "playing") return
      dispatch({ type: "SET_STATUS", status: "opponent-left" })
    }

    const onGameEnd: ServerToClientEvents["end"] = (data) => {
      if (data.winner !== "draw" && data.status === "resignation") {
        dispatch({ type: "SET_WINNER", player: data.winner })
        dispatch({ type: "SET_STATUS", status: data.status })
      }
    }

    socket.on("start", onStartGame)
    socket.on("move", onMove)
    socket.on("leave", onLeave)
    socket.on("end", onGameEnd)

    return () => {
      socket.off("start", onStartGame)
      socket.off("move", onMove)
      socket.off("leave", onLeave)
      socket.off("end", onGameEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.player.color, state.status, state.winner])

  // effect: timer
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
  }, [state.status, state.turn, state.timer])

  // effect: sync game state between players
  useEffect(() => {
    const lastMove = state.previousMoves[state.previousMoves.length - 1]
    if (!lastMove) return
    if (lastMove.player === state.player.color) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { opponent, player, promotionCoordinates, ...syncState } = state
      socket.emit("move", syncState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.previousMoves.length])

  // effect: end game
  useEffect(() => {
    if (isGameOver(state.status)) {
      const winner =
        state.winner ??
        (state.status.startsWith("draw")
          ? "draw"
          : (state.status === "resignation"
                ? state.player.color
                : state.turn) === "w"
            ? "b"
            : "w")
      socket.emit("end", { status: state.status, winner })
      dispatch({ type: "END_GAME" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status])

  const handlePlayAgain = async () => {
    dispatch({ type: "RESET_GAME" })
    await sleep(1000)
    socket.emit("join", { userId, username })
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
