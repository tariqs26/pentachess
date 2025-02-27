"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/Button"

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light")
      }}
    >
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
