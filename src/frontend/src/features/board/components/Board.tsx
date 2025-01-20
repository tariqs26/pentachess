import { useLocalGame } from "@/features/game/useLocalGame"
import { DECAGON_SIDES } from "../constants"
import { getSides } from "../utils"
import { CellComponent } from "./Cell"
import { Side } from "./Side"

export const Board = () => {
  const { state } = useLocalGame()

  return (
    <div className="relative mx-auto size-[650px]">
      {state.boardState.board.map((ring, i) => (
        <div key={i} className="absolute left-1/2 top-1/2">
          {getSides(ring, ring.length / DECAGON_SIDES).map((side, j) => (
            <Side key={j} ring={i} side={j}>
              {side.map((cell) => (
                <CellComponent key={cell.id} {...cell} />
              ))}
            </Side>
          ))}
        </div>
      ))}
    </div>
  )
}
