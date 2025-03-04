import Link from "next/link"
import { useState } from "react"
import { X } from "lucide-react"
import type { PieceColor } from "@/features/piece/types"
import type { GameStatus } from "../types"
import { Button } from "@/components/ui/Button"

type GameEndModalProps = Readonly<{
  winner?: PieceColor | "draw"
  status: GameStatus
  onPlayAgain: () => void
}>

export const GameEndModal = ({
  winner,
  status,
  onPlayAgain,
}: GameEndModalProps) => {
  const [open, setOpen] = useState(true)

  if (!open) {
    return (
      <div className="flex">
        <Button variant="secondary" asChild className="mr-2">
          <Link href="/">Leave Game</Link>
        </Button>
        <Button onClick={onPlayAgain} className="w-full">
          Play Again
        </Button>
      </div>
    )
  }

  const title =
    status === "checkmate"
      ? "Checkmate"
      : status === "resignation"
        ? "Resignation"
        : status === "time-expired"
          ? "Time Expired"
          : `Draw: ${status.replace("draw-", "")}`

  const message =
    winner === "draw"
      ? "It's a draw"
      : `${winner === "w" ? "White" : "Black"} wins`

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 hover:cursor-pointer"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="relative rounded-md bg-card p-6 text-center shadow-lg hover:cursor-auto">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-2 top-2 text-muted-foreground transition-colors hover:text-ring"
        >
          <X size={20} />
        </button>
        <h2 className="mb-4 text-xl font-bold">{title}</h2>
        <p className="mb-4 text-muted-foreground">{message}!</p>
        <Button variant="secondary" asChild className="mr-2">
          <Link href="/">Leave Game</Link>
        </Button>
        <Button onClick={onPlayAgain}>Play Again</Button>
      </div>
    </div>
  )
}
