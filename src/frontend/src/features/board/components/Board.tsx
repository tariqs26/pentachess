import { useLocalGame } from "@/features/game/useLocalGame"
import { DECAGON_SIDES } from "../constants"
import { CellComponent } from "./Cell"
import { getSides } from "../utils"
import { Side } from "./Side"

export const Board = () => {
  const { state } = useLocalGame()

  return (
    <div className="board">
      {state.boardState.board.map((ring, i) => (
        <div key={i} className="ring">
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
