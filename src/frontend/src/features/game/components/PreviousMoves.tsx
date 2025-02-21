import type { PieceColor } from "@/features/piece/types"
import { cn } from "@/lib/utils"
import type { Move } from "../types"

type MovesListProps = Readonly<{ moves: Move[]; player: PieceColor }>

const MovesList = ({ moves, player }: MovesListProps) => (
  <ul className="w-[100px] space-y-0.5">
    {moves
      .filter((move) => move.player === player)
      .map((move, i) => (
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

type PreviousMovesProps = Readonly<{
  startingPlayer: PieceColor
  moves: Move[]
}>

export const PreviousMoves = ({
  startingPlayer,
  moves,
}: PreviousMovesProps) => (
  <aside className="rounded-md bg-accent">
    <div className="flex px-4 pb-1 pt-4 text-sm font-semibold">
      <p>{startingPlayer === "w" ? "You" : "Opponent"}</p>
      <p className={startingPlayer === "w" ? "ml-[74px]" : "ml-[33px]"}>
        {startingPlayer === "w" ? "Opponent" : "You"}
      </p>
    </div>
    <div className="flex max-h-[620px] overflow-y-auto px-4 text-xs font-medium">
      <MovesList moves={moves} player="w" />
      <MovesList moves={moves} player="b" />
    </div>
  </aside>
)
