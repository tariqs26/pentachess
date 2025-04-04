import { render, RenderOptions } from "@testing-library/react"
import { GameProvider } from "@/features/game/components/GameProvider"

const AllProviders = ({ children }: Readonly<React.PropsWithChildren>) => (
  <GameProvider>{children}</GameProvider>
)

export const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })
