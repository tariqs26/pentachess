import { useGame } from "@/features/game/hooks/useGame"
import { DECAGON_SIDES } from "../constants"
import { getSides } from "../utils"
import { CellComponent } from "./Cell"
import { Side } from "./Side"
import { cn } from "@/lib/utils"

type BoardProps = Readonly<{ disabled: boolean; flipped?: boolean }>

export const Board = (props: BoardProps) => {
  const { state } = useGame()

  return (
    <div className="relative mx-auto my-2 h-[600px] w-[572px]">
      {state.boardState.board.map((ring, i) => (
        <div
          key={i}
          className={cn(
            "absolute left-[45.2%] top-[49.5%]",
            props.flipped && "left-[55%] top-[50.5%] rotate-180"
          )}
        >
          {getSides(ring, ring.length / DECAGON_SIDES).map((side, j) => (
            <Side key={j} ring={i} side={j}>
              {side.map((cell) => (
                <CellComponent key={cell.id} {...cell} {...props} />
              ))}
            </Side>
          ))}
        </div>
      ))}
    </div>
  )
}
