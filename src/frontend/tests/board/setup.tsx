import { GameProvider } from "@/features/game/components/GameProvider"
import { render, RenderOptions } from "@testing-library/react"
import React from "react"

const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <GameProvider>{children}</GameProvider>

export const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })
