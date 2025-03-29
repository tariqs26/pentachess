import Image from "next/image"
import { useGame } from "@/features/game/hooks/useGame"
import { cn } from "@/lib/utils"
import type { Cell } from "../types"
import { sideRotation } from "./Side"

const cellRotation = (cell: Cell) => {
  if (cell.x === 0) return cell.y % 2 === 0 ? -70.5 : -109
  if (cell.side % 2 !== 0) return cell.y % 2 === 0 ? -73.5 : -109.5
  return cell.y % 2 === 0 ? -109.5 : -73.5
}

const marginLeftStyle = (cell: Cell) => {
  // key = the ith cell in the side, value = margin value
  const leftMarginsForRing1 = { 0: -70, 1: -69, 2: -69.5 }
  const leftMarginsForRing2 = { 0: -70, 1: -69, 2: -69.5, 3: -69, 4: -69.5 }

  if (cell.x === 1) {
    const ithCell = (cell.y - cell.side * 3) as keyof typeof leftMarginsForRing1
    return leftMarginsForRing1[ithCell]
  }

  if (cell.x === 2) {
    const ithCell = (cell.y - cell.side * 5) as keyof typeof leftMarginsForRing2
    return leftMarginsForRing2[ithCell]
  }
  // default margins for ring 0
  return cell.side % 2 !== 0 ? -70.1 : -70.5
}

const marginTopStyle = (cell: Cell) => {
  // key = the ith cell in the side, value = margin value
  const topMarginsForRing1 = { 0: 0, 1: 4.5, 2: -1.5 }
  const topMarginsForRing2 = { 0: 0, 1: 4.5, 2: -1.6, 3: 2.9, 4: -3.2 }

  if (cell.x === 1) {
    const ithCell = (cell.y - cell.side * 3) as keyof typeof topMarginsForRing1
    return topMarginsForRing1[ithCell]
  }

  if (cell.x === 2) {
    const ithCell = (cell.y - cell.side * 5) as keyof typeof topMarginsForRing2
    return topMarginsForRing2[ithCell]
  }

  // default margins for ring 0
  return cell.side % 2 !== 0 ? -30 : -10
}

const pieceRotation = (cell: Cell & { flipped?: boolean }) =>
  `calc(${-cellRotation(cell) - sideRotation[cell.x][cell.side] + (cell.flipped ? -180 : 0)}deg )`

type CellProps = Readonly<Cell & { disabled: boolean; flipped?: boolean }>

export const CellComponent = (cell: CellProps) => {
  const {
    state: { boardState, promotionCoordinates, turn },
    dispatch,
  } = useGame()

  const isCellSelected = boardState.selectedCell?.cell.id === cell.id

  const isAvailableMove = boardState.selectedCell?.availableMoves
    .values()
    .some((move) => move.id === cell.id)

  const isInvalidMove = boardState.selectedCell?.invalidMoves
    .values()
    .some((move) => move.id === cell.id)

  const isPendingMoveCapturing =
    boardState.pendingMove?.capturedPiece !== null &&
    boardState.pendingMove?.to.id === cell.id

  const canAvailableMoveBeCaptured =
    cell.piece && cell.id !== boardState.pendingMove?.to.id

  const hasBorder =
    cell.x === 0 ||
    (cell.x === 1 && cell.y % 3 !== 0) ||
    (cell.x === 2 && cell.y % 5 !== 0 && cell.y % 5 !== 2)

  const handleCellClick = () => {
    if (cell.disabled) return

    if (isCellSelected) {
      dispatch({ type: "SET_SELECTED_CELL", cell: null })
      return
    }

    if (cell.piece?.color === turn) {
      dispatch({ type: "SET_SELECTED_CELL", cell })
      return
    }

    if (!isAvailableMove || !boardState.selectedCell?.cell.piece) return

    const from = boardState.selectedCell.cell
    const piece = boardState.selectedCell.cell.piece

    dispatch({
      type: "SET_PENDING_MOVE",
      pendingMove: { from, to: cell, piece, capturedPiece: cell.piece },
    })
  }

  return (
    <div
      id={`cell-container-${cell.id}`}
      className="relative"
      onClick={handleCellClick}
    >
      <div
        id={`cell-${cell.id}`}
        className={cn(
          "flex size-[100px] items-center justify-center bg-[#739552]",
          cell.color === "w" && "bg-[#ebecd0]",
          isInvalidMove && "bg-gray-400",
          isAvailableMove &&
            `${cell.color === "b" ? "bg-blue-500" : "bg-blue-300"} hover:cursor-pointer`,
          isAvailableMove && cell.piece && "bg-red-500",
          isCellSelected && "bg-orange-500",
          promotionCoordinates?.to.id === cell.id && "bg-yellow-500",
          isAvailableMove &&
            boardState.pendingMove &&
            !isPendingMoveCapturing &&
            (cell.color === "b" ? "bg-blue-500" : "bg-blue-300"),
          isAvailableMove &&
            boardState.pendingMove &&
            (isPendingMoveCapturing || canAvailableMoveBeCaptured) &&
            "bg-red-500"
        )}
        style={{
          clipPath:
            "polygon(0% 41.2215%, 19.0983% 100%, 80.9017% 100%, 100% 41.2215%, 50% 77.5486%)",
          rotate: `${cellRotation(cell)}deg`,
          marginLeft: `${marginLeftStyle(cell)}px`,
          marginTop: `${marginTopStyle(cell)}px`,
        }}
      >
        <svg viewBox="0 0 100 100">
          <polygon
            points="0,41.2215 19.0983,100 80.9017,100 100,41.2215 50,77.5486"
            fill="transparent"
            stroke="black"
            strokeWidth="1px"
            vectorEffect="non-scaling-stroke"
          />
          {hasBorder && (
            <polygon
              points="0,41.2215 19.0983,100"
              fill="transparent"
              stroke="black"
              strokeWidth="6px"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        {cell.piece && (
          <Image
            src={cell.piece.image}
            alt={`${cell.piece.color === "w" ? "white" : "black"} ${cell.piece.type}`}
            className="absolute left-[50%] top-[70%] z-[999] size-[30px] hover:cursor-pointer"
            style={{ rotate: pieceRotation(cell) }}
            priority
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
