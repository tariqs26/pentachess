import type { Metadata } from "next"

export const metadata = {
  title: "Rules and Regulations",
  description: "Rules and regulations for the Pentachess variant.",
} satisfies Metadata

export default function RulesAndRegulationsPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold tracking-tight">{metadata.title}</h1>
      {/* TODO add content */}
    </div>
  )
}
