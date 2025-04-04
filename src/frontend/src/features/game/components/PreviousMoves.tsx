import { useEffect, useRef } from "react"
import type { PieceColor } from "@/features/piece/types"
import { cn } from "@/lib/utils"
import type { Move } from "../types"

type MovesListProps = Readonly<{
  moves: Move[]
  player: PieceColor
  second?: boolean
}>

const MovesList = ({ moves, player, second }: MovesListProps) => (
  <ul className={cn("min-w-[12ch] space-y-0.5", second && "mr-1")}>
    {moves
      .filter((move) => move.player === player)
      .map((move, i) => (
        <li
          key={i}
          className={cn(
            "whitespace-nowrap text-primary",
            move.pieceCaptured && "text-red-500 dark:text-red-400"
          )}
        >
          {move.notation}
        </li>
      ))}
  </ul>
)

type PreviousMovesProps = Readonly<{
  player: PieceColor
  moves: Move[]
}>

export const PreviousMoves = ({ player, moves }: PreviousMovesProps) => {
  const endRef = useRef<HTMLDivElement>(null)
  const movesCount = Math.ceil(moves.length / 2)

  useEffect(() => {
    if (endRef.current?.scrollIntoView) {
      endRef.current.scrollIntoView()
    }
  }, [movesCount])

  return (
    <aside
      className="rounded-md border bg-accent pl-1 pt-3 text-xs font-medium shadow-sm"
      data-testid="previous-moves"
    >
      <div
        className={cn(
          "grid h-[626px] w-[266px] grid-cols-[1fr_1fr_1fr] grid-rows-[24px_auto_0px] gap-2 overflow-auto scrollbar-thin",
          movesCount < 10000 && "w-[260px]",
          movesCount < 1000 && "w-[254px]",
          movesCount < 100 && "w-[246px]"
        )}
      >
        <div className="sticky top-0 bg-accent" />
        <p className="sticky top-0 bg-accent pb-1 text-sm font-bold">You</p>
        <p className="sticky top-0 bg-accent pb-1 text-sm font-bold">
          Opponent
        </p>
        <ol className={cn("space-y-0.5 pl-1", movesCount < 1000 && "pl-2")}>
          {Array.from({ length: movesCount }, (_, i) => (
            <li key={i}>{i + 1}.</li>
          ))}
        </ol>
        <MovesList moves={moves} player={player} />
        <MovesList moves={moves} player={player === "w" ? "b" : "w"} second />
        <div />
        <div ref={endRef} />
      </div>
    </aside>
  )
}
