import Image from "next/image"
import type { Cell } from "../cell"

export const CellComponent = (cell: Omit<Cell, "setVertices">) => {
  return (
    <div
      style={{
        backgroundColor: cell.color === "w" ? "yellowgreen" : "green",
        height: "100px",
        width: "56px",
        outline: "1px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
