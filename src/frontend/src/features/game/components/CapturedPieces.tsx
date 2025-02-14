"use client"

import { Piece } from "@/features/piece/types"
import Image from "next/image"

export const CapturedPieces = ({ pieces }: { pieces: Piece[] }) => (
  <div className="flex h-[48px] items-center rounded-lg border border-black bg-[#27B559] p-2 shadow-md shadow-white">
    {pieces.map((piece, i) => (
      <Image
        key={i}
        src={piece.image}
        alt={piece.type}
        className="mr-[-1.2px] size-8"
      />
    ))}
  </div>
)
