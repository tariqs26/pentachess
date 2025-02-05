import Image from "next/image"
import { useLocalGame } from "@/features/game/useLocalGame"
import { cn } from "@/lib/utils"
import { cellId } from "../cell"
import type { Cell } from "../types"
import { sideRotation } from "./Side"

const cellRotation = (cell: Cell) => {
  if (cell.x == 0) {
    return cell.y % 2 == 0 ? -70.5 : -109
  }
  if (cell.side % 2 != 0) {
    return cell.y % 2 == 0 ? -73.5 : -109.5
  }
  return cell.y % 2 == 0 ? -109.5 : -73.5
}

const marginLeftStyle = (cell: Cell) => {
  // key = the ith cell in the side, value = margin value
  const leftMarginsForRing1 = { 0: -70, 1: -69, 2: -69.5 }
  const leftMarginsForRing2 = { 0: -70, 1: -69, 2: -69.5, 3: -69, 4: -69.5 }

  if (cell.x == 1) {
    const ithCell = (cell.y - cell.side * 3) as keyof typeof leftMarginsForRing1
    return leftMarginsForRing1[ithCell]
  }

  if (cell.x == 2) {
    const ithCell = (cell.y - cell.side * 5) as keyof typeof leftMarginsForRing2
    return leftMarginsForRing2[ithCell]
  }
  // default margins for ring 0
  return cell.side % 2 != 0 ? -70.1 : -70.5
}

const marginTopStyle = (cell: Cell) => {
  // key = the ith cell in the side, value = margin value
  const topMarginsForRing1 = { 0: 0, 1: 4.5, 2: -1.5 }
  const topMarginsForRing2 = { 0: 0, 1: 4.5, 2: -1.6, 3: 2.9, 4: -3.2 }

  if (cell.x == 1) {
    const ithCell = (cell.y - cell.side * 3) as keyof typeof topMarginsForRing1
    return topMarginsForRing1[ithCell]
  }
  if (cell.x == 2) {
    const ithCell = (cell.y - cell.side * 5) as keyof typeof topMarginsForRing2
    return topMarginsForRing2[ithCell]
  }

  // default margins for ring 0
  return cell.side % 2 != 0 ? -30 : -10
}

const pieceRotation = (cell: Cell) =>
  `calc(${-cellRotation(cell) - sideRotation[cell.x][cell.side]}deg )`

export const CellComponent = (cell: Cell) => {
  const { state, dispatch } = useLocalGame()

  const isCellSelected = state.boardState.selectedCell?.cell.id === cell.id
  const isAvailableMove = state.boardState.selectedCell?.availableMoves
    .values()
    .some((move) => move.id === cell.id)

  const handlePieceMouseDown = () => {
    if (state.boardState.disabled) return
    if (cell.piece === null || cell.piece.color !== state.turn) return
    if (isCellSelected) {
      dispatch({ type: "SELECT_CELL", payload: null })
      return
    }
    dispatch({ type: "SELECT_CELL", payload: cell })
  }

  const handlePieceMouseUp = () => {
    if (state.boardState.disabled) return
    if (!state.boardState.selectedCell) {
      state.boardState.selectedCell = null
      return
    }
    if (!state.boardState.selectedCell.cell.piece) return
    if (state.boardState.overCell === null) return

    const from = state.boardState.selectedCell.cell
    const piece = state.boardState.selectedCell.cell.piece
    const to = state.boardState.overCell

    dispatch({
      type: "MOVE_PIECE",
      payload: { from, to, piece },
    })
  }

  const handleCellMouseEnter = () => {
    if (state.boardState.disabled) return
    if (!state.boardState.selectedCell || isCellSelected || !isAvailableMove)
      return
    dispatch({ type: "SET_OVER_CELL", payload: cell })
  }

  const handleCellMouseLeave = () => {
    if (state.boardState.disabled) return
    if (!state.boardState.selectedCell || !isAvailableMove) return
    dispatch({ type: "SET_OVER_CELL", payload: null })
  }

  return (
    <div
      id={`cell-container-${cell.id}`}
      className="relative"
      onMouseUp={handlePieceMouseUp}
      onMouseEnter={handleCellMouseEnter}
      onMouseLeave={handleCellMouseLeave}
      onDragEnter={handleCellMouseEnter}
      onDragEnd={handlePieceMouseUp}
    >
      <div
        id={`cell-${cell.id}`}
        className={cn(
          "flex size-[100px] items-center justify-center bg-gray-500",
          cell.color === "w" && "bg-white",
          isAvailableMove && "bg-green-500 hover:cursor-pointer",
          isAvailableMove && cell.piece && "bg-red-500",
          isCellSelected && "bg-orange-500",
          state.promotionCoordinates &&
            cellId(...state.promotionCoordinates) === cell.id &&
            "bg-yellow-500"
        )}
        style={{
          clipPath:
            "polygon(0% 41.2215%, 19.0983% 100%, 80.9017% 100%, 100% 41.2215%, 50% 77.5486%)",
          rotate: `${cellRotation(cell)}deg`,
          marginLeft: `${marginLeftStyle(cell)}px`,
          marginTop: `${marginTopStyle(cell)}px`,
        }}
      >
        {cell.piece && (
          <Image
            src={cell.piece.image}
            alt={`${cell.piece.color === "w" ? "white" : "black"} ${cell.piece.type}`}
            className="absolute left-[50%] top-[70%] z-[999] size-[30px] hover:cursor-pointer"
            style={{ rotate: pieceRotation(cell) }}
            draggable
            priority
            onMouseDown={handlePieceMouseDown}
          />
        )}
        <span
          className="pointer-events-none absolute left-[20%] top-[80%] select-none text-[10px] font-bold text-black"
          style={{ rotate: pieceRotation(cell) }}
        >
          {cell.id}
        </span>
      </div>
    </div>
  )
}
