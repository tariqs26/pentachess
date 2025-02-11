import type { Metadata } from "next"
import board from "/public/pieces_rules/board.png"

export const metadata = {
  title: "Rules and Regulations",
  description: "Rules and regulations for the Pentachess variant.",
} satisfies Metadata

export default function RulesAndRegulationsPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold tracking-tight">{metadata.title}</h1>
      {/* Hover Target (Button) */}
      <button className="group relative z-10 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Hover for Board Image
        {/* Hover Image (Hidden by Default, Shown on Hover) */}
        <div className="pointer-events-none absolute left-3/4 mt-3 h-96 w-96 overflow-hidden rounded-lg opacity-0 duration-300 group-hover:translate-x-2 group-hover:opacity-100">
          <img src={board.src} />
        </div>
      </button>
    </div>
  )
}
