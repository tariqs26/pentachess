import Image from "next/image"
import type { Piece } from "@/features/piece/types"

export const CapturedPieces = ({ pieces }: { pieces: Piece[] }) => (
  <div className="flex h-[42px] items-center rounded-md border bg-accent p-2 shadow-sm">
    {pieces.map((piece, i) => (
      <Image
        key={i}
        src={piece.image}
        alt={piece.type}
        className="-mr-[2px] size-8"
      />
    ))}
  </div>
)
