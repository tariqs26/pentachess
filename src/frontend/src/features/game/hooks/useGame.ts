import { useContext } from "react"
import { GameContext } from "../components/GameProvider"

export const useGame = () => {
  const context = useContext(GameContext)

  if (context === null) {
    throw new Error("useGame must be used within a GameProvider")
  }

  return context
}
