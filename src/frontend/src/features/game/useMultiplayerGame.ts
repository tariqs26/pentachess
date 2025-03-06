import { useContext } from "react"
import { MultiplayerGameContext } from "./components/MultiplayerGameProvider"

export function useMultiplayerGame() {
  const context = useContext(MultiplayerGameContext)

  if (context === null) {
    throw new Error("useMultiplayerGame must be used within a MultiplayerGameProvider")
  }

  return context
}
