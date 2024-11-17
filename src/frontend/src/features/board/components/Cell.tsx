import Image from "next/image"
import type { Cell } from "../cell"

const cellRotation = (cell: Omit<Cell, "setVertices">) => {
  if (cell.x != 0 && cell.side % 2 != 0) {
    return cell.y % 2 != 0 ? "-70deg" : "-103deg"
  }
  return cell.y % 2 == 0 ? "-70deg" : "-103deg"
}

export const CellComponent = (cell: Omit<Cell, "setVertices">) => {
  return (
    <div className="relative">
      <div
        style={{
          backgroundColor: cell.color === "w" ? "yellowgreen" : "green",
          height: "100px",
          width: "100px",
          outline: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          clipPath:
            "polygon(0% 43.43%, 20% 100%, 80% 100%, 100% 43.43%, 50% 76.7%)",
          rotate: cellRotation(cell),
          marginLeft: "-70px",
        }}
      />
      {cell.piece ? (
        <Image
          className="absolute top-5 size-[50px]"
          src={cell.piece.image}
          alt={`${cell.piece.color === "w" ? "white" : "black"} ${cell.piece.type}`}
          priority
        />
      ) : (
        <span className="absolute top-5 font-semibold text-background">
          {cell.id}
        </span>
      )}
    </div>
  )
}
