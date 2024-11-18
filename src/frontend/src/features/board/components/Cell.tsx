import Image from "next/image"
import type { Cell } from "../cell"
import { useLocalGame } from "@/features/game/useLocalGame"
import { sideRotation } from "./Side"

const cellRotation = (cell: Cell) => {
  if (cell.x != 0 && cell.side % 2 != 0) {
    return cell.y % 2 != 0 ? -70 : -103
  }
  return cell.y % 2 == 0 ? -70 : -103
}

const pieceRotation = (cell: Cell) =>
  `calc(${-sideRotation(cell.x)[cell.side]}deg )`

export const CellComponent = (cell: Cell) => {
  const { state, dispatch } = useLocalGame()

  const handlePieceMouseDown = () => {
    if (state.boardState.disabled) return
    if (cell.piece === null || cell.piece.color !== state.turn) return
    if (state.boardState.selectedCell?.cell.id === cell.id) return
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
    dispatch({
      type: "MOVE_PIECE",
      payload: {
        from: {
          x: state.boardState.selectedCell.cell.x,
          y: state.boardState.selectedCell.cell.y,
          piece: state.boardState.selectedCell.cell.piece,
        },
        to: {
          x: state.boardState.overCell.x,
          y: state.boardState.overCell.y,
          piece: state.boardState.overCell.piece,
        },
        piece: state.boardState.selectedCell.cell.piece,
      },
    })
  }

  const handleCellMouseEnter = () => {
    if (state.boardState.disabled) return
    if (!state.boardState.selectedCell) return
    if (state.boardState.selectedCell.cell.id === cell.id) return
    if (
      !state.boardState.selectedCell.availableMoves.find(
        (move) => move.id === cell.id
      )
    )
      return

    dispatch({ type: "SET_OVER_CELL", payload: cell })
  }

  const handleCellMouseLeave = () => {
    if (state.boardState.disabled) return
    if (!state.boardState.selectedCell) return
    if (
      !state.boardState.selectedCell.availableMoves.find(
        (move) => move.id === cell.id
      )
    )
      return

    dispatch({ type: "SET_OVER_CELL", payload: null })
  }

  const isCellHighlighted =
    state.boardState.selectedCell &&
    state.boardState.selectedCell.availableMoves.find(
      (move) => move.id === cell.id
    ) !== undefined

  const isCellSelected = state.boardState.selectedCell?.cell.id === cell.id

  return (
    <div
      className="relative"
      onMouseUp={handlePieceMouseUp}
      onMouseEnter={handleCellMouseEnter}
      onMouseLeave={handleCellMouseLeave}
      onDragEnter={handleCellMouseEnter}
      onDragEnd={handlePieceMouseUp}
    >
      <div
        style={{
          backgroundColor: isCellHighlighted
            ? "blue"
            : isCellSelected
              ? "red"
              : cell.color === "w"
                ? "white"
                : "gray",

          height: "100px",
          width: "100px",
          outline: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          clipPath:
            "polygon(0% 43.43%, 20% 100%, 80% 100%, 100% 43.43%, 50% 76.7%)",
          rotate: `${cellRotation(cell)}deg`,
          marginLeft: "-70px",
        }}
      />
      {cell.piece ? (
        <Image
          src={cell.piece.image}
          alt={`${cell.piece.color === "w" ? "white" : "black"} ${cell.piece.type}`}
          className="absolute top-8 z-[999] size-[30px] hover:cursor-pointer"
          style={{ rotate: pieceRotation(cell) }}
          priority
          draggable
          onMouseDown={handlePieceMouseDown}
        />
      ) : (
        <span
          className="absolute top-5 select-none font-semibold text-background"
          style={{ rotate: pieceRotation(cell) }}
        >
          {cell.id}
        </span>
      )}
    </div>
  )
}
