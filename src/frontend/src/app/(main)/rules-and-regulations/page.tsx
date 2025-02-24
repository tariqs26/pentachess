import type { Metadata } from "next"
import Image from "next/image"
import { pieceMovementRules } from "./content"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion"

export const metadata = {
  title: "Rules and Regulations",
  description: "Rules and regulations for the Pentachess variant.",
} satisfies Metadata

export default function RulesAndRegulationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-center text-3xl font-bold tracking-tight">
        {metadata.title}
      </h1>
      <p className="mb-4 text-center text-lg">
        Welcome to <strong>Pentachess</strong>! We hope you enjoy your stay!
        Below are the general rules of the game.
      </p>
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">
          Objective
        </h2>
        <p>
          The goal of Pentachess is to checkmate the opponent&apos;s king. This
          means that you have put the king in check (danger), such that there is
          no legal move for the opponent to play that gets them out of check.
        </p>
      </section>
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">Setup</h2>
        <p>
          The game is played on a 90-tile board consisting of 3 decagon rings,
          with 10, 30, and 50 tiles within the inner, center, and outer
          decagons, respectively. Each player has 18 pieces, each of which is
          one of 7 piece types.
        </p>
      </section>
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">Turns</h2>
        <p>Both players will alternate turns moving one piece per turn.</p>
      </section>
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">
          Time Control
        </h2>
        <p>
          Each game can be set up with an optional timer that decreases while it
          is a player&apos;s turn. The timer pauses once it is no longer that
          player&apos;s turn. If the timer runs out, that player loses.
        </p>
      </section>
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">
          Win Conditions
        </h2>
        <ul className="ml-8 list-disc">
          <li>
            <strong>Checkmate:</strong> Described in the Objective above.
          </li>
          <li>
            <strong>Resignation:</strong> The opponent resigns.
          </li>
          <li>
            <strong>Timer reaches 0:</strong> The opponent runs out of time.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">
          Draw Conditions
        </h2>
        <ul className="ml-8 list-disc">
          <li>
            <strong>Stalemate:</strong> A player&apos;s king is not in check but
            has no legal moves.
          </li>
          <li>
            <strong>Insufficient material:</strong> Neither player has the
            necessary pieces to checkmate.
          </li>
          <li>
            <strong>Threefold repetition:</strong> The same moves occur three
            times in a row.
          </li>
          <li>
            <strong>Agreed upon draw:</strong> One player offers a draw, and the
            other accepts.
          </li>
          <li>
            <strong>Passive 50 moves:</strong> There are no captures and no pawn
            moves on either team within 50 consecutive moves.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">Movement</h2>
        <p>
          The rules of movement can be seen for each piece in the next section.
          Just a few notes to properly understand all the notation:
        </p>
        <ul className="ml-8 list-disc">
          <li>
            <strong>Orange Cell Highlight:</strong> The currently selected cell.
          </li>
          <li>
            <strong>Green/Red Cell Highlight:</strong> Available cell to move
            to. Green is passively moving. Red is capturing an enemy piece.
          </li>
          <li>
            <strong>Red/Yellow Cell Outlines:</strong> Indicates the cell which
            the corresponding rule is talking about.
          </li>
        </ul>
        <div className="mt-4 space-y-4">
          {pieceMovementRules.map((piece, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold tracking-tight">
                {piece.title}
              </h3>
              <p className="font-medium text-muted-foreground">
                {piece.description}
              </p>
              <Accordion type="multiple" defaultValue={["0"]} className="ml-4">
                {piece.details.map((detail, i) => (
                  <AccordionItem key={i} value={String(i)}>
                    <AccordionTrigger className="flex items-start justify-start gap-3 text-base">
                      <div className="mt-2.5 size-[5px] shrink-0 rounded-full bg-foreground" />
                      <span className="mr-auto">{detail}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Image
                        src={piece.images[i]}
                        alt="Chess Board Example"
                        className="mx-auto size-96 rounded-md border"
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
