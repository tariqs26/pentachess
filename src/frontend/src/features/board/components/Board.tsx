import { useLocalGame } from "@/features/game/useLocalGame"
import { DECAGON_SIDES } from "../constants"
import { getSides } from "../utils"
import { CellComponent } from "./Cell"
import { Side } from "./Side"

export const Board = () => {
  const { state } = useLocalGame()

  return (
    <div
      style={{
        backgroundColor: "GrayText",
        margin: "auto",
        height: "920px",
        width: "920px",
        position: "relative",
      }}
    >
      {state.boardState.board.map((ring, i) => (
        <div
          key={i}
          style={{ position: "absolute", top: "50%", left: "50%" }}
        >
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
