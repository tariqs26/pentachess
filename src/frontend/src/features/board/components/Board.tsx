import { useLocalGame } from "@/features/game/useLocalGame"
import { DECAGON_SIDES } from "../constants"
import { getSides } from "../utils"

import type { Cell } from "../cell"
import Image from "next/image"

const CellComponent = (cell: Omit<Cell, "setVertices">) => {
  return (
    <span
      className="cell"
      style={{
        width: "64px",
        height: "64px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
      }}
    >
      {cell.piece ? (
        <Image
          src={cell.piece.image}
          alt={cell.piece.type}
          priority
          style={{
            width: "50px",
            height: "50px",
            rotate: `${cell.side === 0 ? "-90" : "0"}deg`,
          }}
        />
      ) : (
        cell.id
      )}
    </span>
  )
}

export const Board = () => {
  const { state } = useLocalGame()

  return (
    <div
      style={{
        backgroundColor: "gray",
        margin: "auto",
        height: "1000px",
        width: "1000px",
        position: "relative",
      }}
    >
      {state.boardState.board.map((ring, i) => (
        <div
          key={i}
          style={{
            display: "flex",
          }}
        >
          {getSides(ring, ring.length / DECAGON_SIDES).map((side, j) => {
            return (
              <div className="flex" key={j}>
                {side.map((cell) => (
                  <CellComponent key={cell.id} {...cell} />
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
