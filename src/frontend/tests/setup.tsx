import { render, type RenderOptions } from "@testing-library/react"
import { GameProvider } from "@/features/game/components/GameProvider"

export const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: GameProvider, ...options })
