import type { Cell } from "../cell"
import Image from "next/image"

export const CellComponent = (cell: Omit<Cell, "setVertices">) => {
  return (
    <div className="size-5 border-2 border-solid border-white">
      {cell.id}
      {cell.piece && (
        <Image src={cell.piece.image} alt={cell.piece.type} priority />
      )}
    </div>
  )
}
