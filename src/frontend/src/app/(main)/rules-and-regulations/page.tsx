import type { Metadata } from "next"
import board from "/public/pieces_rules/board.png"
import pawn1 from "/public/pieces_rules/pawn-1.png"
import pawn2 from "/public/pieces_rules/pawn-2.png"
import pawn3 from "/public/pieces_rules/pawn-3.png"
import pawn4 from "/public/pieces_rules/pawn-4.png"
import pawn5 from "/public/pieces_rules/pawn-5.png"
import berolina1 from "/public/pieces_rules/berolina-1.png"
import berolina2 from "/public/pieces_rules/berolina-2.png"
import knight from "/public/pieces_rules/knight.png"
import bishop1 from "/public/pieces_rules/bishop-1.png"
import bishop2 from "/public/pieces_rules/bishop-2.png"
import bishop3 from "/public/pieces_rules/bishop-3.png"
import rook1 from "/public/pieces_rules/rook-1.png"
import rook2 from "/public/pieces_rules/rook-2.png"
import queen from "/public/pieces_rules/queen.png"
import king from "/public/pieces_rules/king.png"

export const metadata = {
  title: "Rules and Regulations",
  description: "Rules and regulations for the Pentachess variant.",
} satisfies Metadata

export default function RulesAndRegulationsPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      {/*<button className="group relative z-10 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Hover for Board Image
        <div className="pointer-events-none absolute left-3/4 mt-3 h-96 w-96 overflow-hidden rounded-lg opacity-0 duration-300 group-hover:translate-x-2 group-hover:opacity-100">
          <img src={board.src} />
        </div>
      </button>*/}
      <h1 className="mb-6 text-center text-3xl font-bold tracking-tight">
        {metadata.title}
      </h1>
      <p className="mb-4 text-center text-lg">
        Welcome to <strong>Pentachess</strong>! We hope you enjoy your stay!
        Below are the general rules of the game.
      </p>

      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Objective</h2>
        <p>
          The goal of Pentachess is to checkmate the opponents king. This means
          that you have put the king in check (danger), such that there is no
          legal move for the opponent to play that gets them out of check.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Setup</h2>
        <p>
          The game is played on a 90-tile board consisting of 3 decagon rings,
          with 10, 30, and 50 tiles within the inner, center, and outer
          decagons, respectively. Each player has 18 pieces, each of which is
          one of 7 piece types.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Movement</h2>
        <p>The rules of movement can be seen for each piece below:</p>

        <div className="mt-4 space-y-4">
          {[
            {
              title: "Pawn (CW/CCW)",
              description:
                "Pawns have three types of moves: Passive Moves, Capture Moves, and Promotion.",
              details: [
                "Passive: Pawns can move one cell across an edge within its decagon using its given direction. If it is the pawns first move, they can move two cells forward.",
                "Passive: Pawns can also move one cell across an edge into a different decagon.",
                "Capture: Pawns can capture one cell across a vertex within its decagon using its given direction.",
                "Capture: Pawns can also capture one same-color cell across a vertex into a different decagon, that also shares the same vertex with the next same-color cell within the starting decagon using its given direction.",
                "Promote: Pawns can promote to a Knight, Bishop, Rook, or Queen when reaching the opposite side of the board (cells A25-32 for team white and cells A0-7 for team black).",
              ],
              images: [pawn1.src, pawn2.src, pawn3.src, pawn4.src, pawn5.src],
            },
            {
              title: "Berolina (CW/CCW)",
              description:
                "Similar to Pawns but with reversed Passive and Capture moves.",
              details: [
                "Berolinas move passively like Pawns capture and capture like Pawns passively move.",
                "They do not move two cells forward on the first move.",
              ],
              images: [berolina1.src, berolina2.src],
            },
            {
              title: "Knight",
              description:
                "Knights are pretty straight forward, just one rule.",
              details: [
                "Knights can move/capture one cell across a vertex to a different-color cell, excluding any edge-adjacent cells.",
              ],
              images: [knight.src],
            },
            {
              title: "Bishop",
              description:
                "Bishops have three rules, two are simple, one is tricky.",
              details: [
                "Bishops can move/capture to any same-color cell within its decagon as long as the path to that cell is clear (meaning there are no other pieces in its path). Here, the path consists of all same-colored cells from the starting point to the desired cell.",
                "Bishops can also move/capture to any same-color cell across a vertex into a different decagon.",
                "Bishops can also move/capture to any same-color cell across two consecutive vertices in a straight line (two decagons away) as long as the cell has the same orientation as its starting cell, and the path to that cell is clear.",
              ],
              images: [bishop1.src, bishop2.src, bishop3.src],
            },
            {
              title: "Rook",
              description: "Rooks are not too bad, just two rules.",
              details: [
                "Rooks can move/capture to any cell within its decagon as long as the path to that cell is clear. Here, the path consists of all cells from the starting point to the desired cell.",
                "Rooks can also move/capture one cell across an edge into a different decagon, if such an edge exists.",
              ],
              images: [rook1.src, rook2.src],
            },
            {
              title: "Queen",
              description:
                "Queens are simply to understand, assuming you understanding Bishops and Rooks.",
              details: [
                "Queens can move/capture as a rook or bishop. This means all available moves that a rook or bishop can do on the cell that the queen is on is a legal move for the queen.",
              ],
              images: [queen.src],
            },
            {
              title: "King",
              description:
                "Make sure to defend this piece at all costs! Just one rule.",
              details: [
                "The king can move/capture as a rook or bishop using one step only. In simple terms, it can move/capture to any edge or vertex-adjacent cell a bishop or rook would be able to.",
              ],
              images: [king.src],
            },
          ].map((piece, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-300 p-4 shadow-md"
            >
              <h3 className="text-xl font-semibold">{piece.title}</h3>
              <p className="text-gray-700">{piece.description}</p>
              <ul className="relative mt-2 list-inside list-disc">
                {piece.details.map((detail, i) => (
                  <li
                    key={i}
                    className={`group relative z-10 rounded-md px-4 py-2 text-white hover:bg-blue-700`}
                  >
                    {detail}
                    <div className="pointer-events-none absolute left-3/4 mt-3 h-96 w-96 overflow-hidden rounded-lg opacity-0 duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                      <img
                        src={piece.images[i]}
                        alt="Chess Board Example"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Turns</h2>
        <p>Both players will alternate turns moving one piece per turn.</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Time Control</h2>
        <p>
          Each game can be set up with an optional timer that decreases while it
          is a players turn. The timer pauses once it is no longer that players
          turn. If the timer runs out, that player loses.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Win Condition</h2>
        <ul className="list-inside list-disc">
          <li>Checkmate: described in the Objective above.</li>
          <li>Resignation: the opponent resigns.</li>
          <li>Timer reaches 0: the opponent runs out of time.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Draw Condition</h2>
        <ul className="list-inside list-disc">
          <li>
            Stalemate: a players king is not in check but has no legal moves.
          </li>
          <li>
            Insufficient material: neither player has the necessary pieces to
            checkmate.
          </li>
          <li>
            Threefold repetition: the same moves occur three times in a row.
          </li>
          <li>
            Agreed upon draw: one player offers a draw, and the other accepts.
          </li>
          <li>
            Passive 50 moves: there are no captures and no pawn moves on either
            team within 50 consecutive moves.
          </li>
        </ul>
      </section>
    </div>
  )
}
