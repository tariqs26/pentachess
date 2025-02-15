import type { Move } from "../types"
import { cn } from "@/lib/utils"

type MovesListProps = Readonly<{ moves: Move[] }>

const MovesList = ({ moves }: MovesListProps) => (
  <ul className="w-[100px] space-y-0.5">
    {moves.map((move, i) => (
      <li
        key={i}
        className={cn(
          "text-primary",
          move.pieceCaptured && "text-red-500 dark:text-red-400"
        )}
      >
        {move.notation}
      </li>
    ))}
  </ul>
)

type PreviousMovesProps = Readonly<{ previousMoves: Move[] }>

export const PreviousMoves = ({ previousMoves }: PreviousMovesProps) => (
  <aside className="rounded-md bg-accent">
    <div className="flex px-4 pb-1 pt-4 text-sm font-semibold">
      <p>You</p>
      <p className="ml-[74px]">Opponent</p>
    </div>
    <div className="flex max-h-[620px] overflow-y-auto px-4 text-xs font-medium">
      <MovesList moves={previousMoves.filter((move) => move.player === "w")} />
      <MovesList moves={previousMoves.filter((move) => move.player === "b")} />
    </div>
  </aside>
)
