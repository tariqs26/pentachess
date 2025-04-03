import Image from "next/image"
import { useGame } from "@/features/game/hooks/useGame"
import { cn } from "@/lib/utils"
import type { Cell } from "../types"
import { sideRotation } from "./Side"
import { cellRotation, marginLeftStyle, marginTopStyle } from "../utils"

const pieceRotation = (cell: Cell & { flipped?: boolean }) =>
  `calc(${-cellRotation(cell) - sideRotation[cell.x][cell.side] + (cell.flipped ? -180 : 0)}deg )`

type CellProps = Readonly<Cell & { disabled: boolean; flipped?: boolean }>

export const CellComponent = (cell: CellProps) => {
  const { state, dispatch } = useGame()
  const { selectedCell, pendingMove } = state.boardState

  const isCellSelected = selectedCell?.cell.id === cell.id

  const isAvailableMove = selectedCell?.availableMoves
    .values()
    .some((move) => move.id === cell.id)

  const isInvalidMove = selectedCell?.invalidMoves
    .values()
    .some((move) => move.id === cell.id)

  const isPendingMoveCapturing =
    pendingMove?.capturedPiece !== null && pendingMove?.to.id === cell.id

  const canAvailableMoveBeCaptured =
    cell.piece && cell.id !== pendingMove?.to.id

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

    if (cell.piece?.color === state.turn) {
      dispatch({ type: "SET_SELECTED_CELL", cell })
      return
    }

    if (!isAvailableMove || !selectedCell?.cell.piece) return

    const from = selectedCell.cell
    const piece = selectedCell.cell.piece

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
          state.promotionCoordinates?.to.id === cell.id && "bg-yellow-500",
          isAvailableMove &&
            pendingMove &&
            !isPendingMoveCapturing &&
            (cell.color === "b" ? "bg-blue-500" : "bg-blue-300"),
          isAvailableMove &&
            pendingMove &&
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
