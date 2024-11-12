import { useContext } from "react"
import { LocalGameContext } from "./components/LocalGameProvider"

export const useLocalGame = () => {
  const context = useContext(LocalGameContext)

  if (context === null) {
    throw new Error("useLocalGame must be used within a LocalGameProvider")
  }

  return context
}
