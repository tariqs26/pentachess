import Image from "next/image"
import type { Cell } from "../cell"

const getTransformation = (cell: Omit<Cell, "setVertices">) => {
  const ring = cell.id.slice(0, 1)
  const side = cell.side
  const id = Number(cell.id.slice(1))
  if (ring != 'A' && side % 2 != 0) {
    return id % 2 != 0 ? "-70deg" : "-103deg"
  }
  return id % 2 == 0 ? "-70deg" : "-103deg"
}

export const CellComponent = (cell: Omit<Cell, "setVertices">) => {
  return (
    <div
      style={{
        backgroundColor: cell.color === "w" ? "yellowgreen" : "green",
        height: "100px",
        width: "100px",
        outline: "1px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        clipPath: "polygon(0% 43.43%,20% 100%,80% 100%,100% 43.43%,50% 76.7%)",
        rotate: getTransformation(cell),
        marginLeft: "-70px"
      }}
    >
      {cell.piece ? (
        <Image
          src={cell.piece.image}
          alt={`${cell.piece.colour === "w" ? "white" : "black"} ${cell.piece.type}`}
          style={{ width: "50px", height: "50px" }}
          priority
        />
      ) : (
        <span style={{ color: "black", fontWeight: "bold" }}>{cell.id}</span>
      )}
    </div>
  )
}
