import Image from "next/image"
import { useLocalGame } from "@/features/game/useLocalGame"
import type { Cell } from "../types"
import { sideRotation } from "./Side"

const cellRotation = (cell: Cell) => {
  if (cell.x == 1) {
    if (cell.side % 2 != 0) {
      return cell.y % 2 != 0 ? -109.5 : -73.5
    }
    
    return cell.y % 2 == 0 ? -109.5 : -73.5
  }
  if (cell.x == 2) {
    if (cell.side % 2 != 0) {
      return cell.y % 2 == 0 ? -73.5 : -109.5
    }
    return cell.y % 2 == 0 ? -109.5 : -73.5
  }
  return cell.y % 2 == 0 ? -70.5 : -109
  // if (cell.x != 0 && cell.side % 2 != 0) {
  //   return cell.y % 2 != 0 ? -70.5 : -109
  // }
  // return cell.y % 2 == 0 ? -70.5 : -109
}

const marginLeftStyle = (cell: Cell) => {

  if (cell.x == 1) {
    if (cell.side % 2 != 0) {
      if ((cell.y - (cell.side * 3)) == 0) {
        return 0
      }
      if ((cell.y - (cell.side * 3)) == 1) {
        return -69
      }
      return -69.5
    }
    if ((cell.y - (cell.side * 3)) == 0) {
      return 0
    }
    if ((cell.y - (cell.side * 3)) == 1) {
      return -69
    }
    return -69.5
  }

  if (cell.x == 2) {
    if (cell.side % 2 != 0) {
      if ((cell.y - (cell.side * 5)) == 0) {
        return 0
      }
      if ((cell.y - (cell.side * 5)) == 1) {
        return -69
      }
      if ((cell.y - (cell.side * 5)) == 2) {
        return -69.5
      }
      if ((cell.y - (cell.side * 5)) == 3) {
        return -69
      }
      return -69.5
    }

    if ((cell.y - (cell.side * 5)) == 0) {
      return 0
    }
    if ((cell.y - (cell.side * 5)) == 1) {
      return -69
    }
    if ((cell.y - (cell.side * 5)) == 2) {
      return -69.5
    }
    if ((cell.y - (cell.side * 5)) == 3) {
      return -69
    }
    return -69.5
  }

  return cell.side % 2 != 0 ? -70.1 : -70.5
}

const marginTopStyle = (cell: Cell) => {
  if (cell.x == 1) {
    if (cell.side % 2 != 0) {
      if ((cell.y - (cell.side * 3)) == 0) {
        return 0
      }
      if ((cell.y - (cell.side * 3)) == 1) {
        return 4.5
      }
      return -1.5
    }
    if ((cell.y - (cell.side * 3)) == 0) {
      return 0
    }
    if ((cell.y - (cell.side * 3)) == 1) {
      return 4.5
    }
    return -1.5
  }
  if (cell.x == 2) {
    if (cell.side % 2 != 0) {
      if ((cell.y - (cell.side * 5)) == 0) {
        return 0
      }
      if ((cell.y - (cell.side * 5)) == 1) {
        return 4.5
      }
      if ((cell.y - (cell.side * 5)) == 2) {
        return -1.6
      }
      if ((cell.y - (cell.side * 5)) == 3) {
        return 2.9
      }
      return -3.2
    }

    if ((cell.y - (cell.side * 5)) == 0) {
      return 0
    }
    if ((cell.y - (cell.side * 5)) == 1) {
      return  4.5
    }
    if ((cell.y - (cell.side * 5)) == 2) {
      return -1.6
    }
    if ((cell.y - (cell.side * 5)) == 3) {
      return 2.9
    }
    return -3.2
  }
  return cell.side % 2 != 0 ? cell.color === "w" ? -30 : -50 : cell.color === "w" ? -30 : -10
}

const pieceRotation = (cell: Cell) =>
  `calc(${-sideRotation(cell.x)[cell.side]}deg )`

export const CellComponent = (cell: Cell) => {
  const { state, dispatch } = useLocalGame()

  const isCellSelected = state.boardState.selectedCell?.cell.id === cell.id
  const isAvailableMove = state.boardState.selectedCell?.availableMoves.values().some((move) => move.id === cell.id)

  const handlePieceMouseDown = () => {
    if (state.boardState.disabled) return
    if (cell.piece === null || cell.piece.color !== state.turn) return
    if (isCellSelected) return
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
      className="relative"
      onMouseUp={handlePieceMouseUp}
      onMouseEnter={handleCellMouseEnter}
      onMouseLeave={handleCellMouseLeave}
      onDragEnter={handleCellMouseEnter}
      onDragEnd={handlePieceMouseUp}
    >
      <div
        style={{
          backgroundColor: isAvailableMove
            ? "green"
            : isCellSelected
              ? "red"
              : cell.color === "w"
                ? "white"
                : "gray",

          height: "100px",
          width: "100px",
          outline: "1px solid black",
          display: "flex",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          clipPath: "polygon(0% 41.2215%, 19.0983% 100%, 80.9017% 100%, 100% 41.2215%, 50% 77.5486%)",
          rotate: `${cellRotation(cell)}deg`,
          marginLeft: `${marginLeftStyle(cell)}px`,
          marginTop: `${marginTopStyle(cell)}px`,
          zIndex: cell.color === "b" ? 2 : 1
        }}
      />
    {/* {cell.piece ? (
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
      )} */}
    </div>
  )
}
