import { useLocalGame } from "@/features/game/useLocalGame"
import { Piece } from "@/features/piece/types"
import { makePiece } from "@/features/piece/utils"
import Image from "next/image"

export const PromoteIcon = () => {
  const { state, dispatch } = useLocalGame()

  function onPromote(piece: Piece) {
    console.log("Pawn Promotion")
    dispatch({
      type: "PROMOTE_PAWN",
      payload: {
        cell: state.promoteID,
        piece: piece,
      },
    })
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <div
        id="promotePopup"
        style={{
          position: "relative",
          background: "rgba(90, 125, 238, 0.2)",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          zIndex: 100,
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Promote Your Pawn</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {[
            makePiece("queen", state.turn === "w" ? "b" : "w"),
            makePiece("rook", state.turn === "w" ? "b" : "w"),
            makePiece("bishop", state.turn === "w" ? "b" : "w"),
            makePiece("knight", state.turn === "w" ? "b" : "w"),
          ].map((piece) => (
            <button
              key={piece.type}
              onClick={() => onPromote(piece)}
              style={{
                padding: "10px",
                fontSize: "16px",
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <Image
                key={piece.type}
                src={piece.image}
                alt={piece.type}
                className="size-10"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
