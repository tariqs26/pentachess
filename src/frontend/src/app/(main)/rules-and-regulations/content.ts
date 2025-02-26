import pawn1 from "/public/pieces_rules/pawn-1-zoom.png"
import pawn2 from "/public/pieces_rules/pawn-2-zoom.png"
import pawn3 from "/public/pieces_rules/pawn-3-zoom.png"
import pawn4 from "/public/pieces_rules/pawn-4-zoom.png"
import pawn5 from "/public/pieces_rules/pawn-5-zoom.png"
import berolina1 from "/public/pieces_rules/berolina-1-zoom.png"
import berolina2 from "/public/pieces_rules/berolina-2-zoom.png"
import knight from "/public/pieces_rules/knight-zoom.png"
import bishop1 from "/public/pieces_rules/bishop-1-zoom.png"
import bishop2 from "/public/pieces_rules/bishop-2-zoom.png"
import bishop3 from "/public/pieces_rules/bishop-3-zoom.png"
import rook1 from "/public/pieces_rules/rook-1-zoom.png"
import rook2 from "/public/pieces_rules/rook-2-zoom.png"
import queen from "/public/pieces_rules/queen-zoom.png"
import king from "/public/pieces_rules/king-zoom.png"

export const pieceMovementRules = [
  {
    title: "Pawn (CW/CCW)",
    description:
      "Pawns have three types of moves: passive moves, capture moves, and promotion.",
    details: [
      "Passive: Pawns can move one cell across an edge within its decagon using its given direction. If it is the pawn's first move, they can move two cells forward.",
      "Passive: Pawns can also move one cell across an edge into a different decagon.",
      "Capture: Pawns can capture one cell across a vertex within its decagon using its given direction.",
      "Capture: Pawns can also capture one same-color cell across a vertex into a different decagon, that also shares the same vertex with the next same-color cell within the starting decagon using its given direction.",
      "Promote: Pawns can promote to a knight, bishop, rook, or queen when reaching the opposite side of the board (cells A25-32 for team white and cells A0-7 for team black).",
    ],
    images: [pawn1, pawn2, pawn3, pawn4, pawn5],
  },
  {
    title: "Berolina's pawn (CW/CCW)",
    description:
      "Similar to pawns but with reversed passive and capture moves. They also don't move two cells forward on their first move.",
    details: [
      "Berolina pawns move passively like pawns capture.",
      "Berolina pawns capture like pawns passively move.",
    ],
    images: [berolina1, berolina2],
  },
  {
    title: "Knight",
    description: "Knights are pretty straightforward, just one rule.",
    details: [
      "Knights can move to or capture one cell across a vertex to a different-color cell, excluding any edge-adjacent cells.",
    ],
    images: [knight],
  },
  {
    title: "Bishop",
    description: "Bishops have three rules, two are simple, and one is tricky.",
    details: [
      "Bishops can move to or capture any same-color cell within its decagon as long as the path to that cell is clear (meaning there are no other pieces in its path). Here, the path consists of all same-colored cells from the starting point to the desired cell.",
      "Bishops can also move to or capture any same-color cell across a vertex into a different decagon.",
      "Bishops can also move to or capture any same-color cell across two consecutive vertices in a straight line (two decagons away) as long as the cell has the same orientation as its starting cell, and the path to that cell is clear.",
    ],
    images: [bishop1, bishop2, bishop3],
  },
  {
    title: "Rook",
    description: "Rooks are not too bad, just two rules.",
    details: [
      "Rooks can move to or capture any cell within its decagon as long as the path to that cell is clear. Here, the path consists of all cells from the starting point to the desired cell.",
      "Rooks can also move to or capture one cell across an edge into a different decagon if such an edge exists.",
    ],
    images: [rook1, rook2],
  },
  {
    title: "Queen",
    description:
      "Queen movement is simple to understand, assuming you have an understanding of bishops and rooks.",
    details: [
      "Queens can move/capture as a rook or bishop. This means all available moves that a rook or bishop can do on the cell that the queen is on are legal moves for the queen.",
    ],
    images: [queen],
  },
  {
    title: "King",
    description: "Make sure to defend this piece at all costs! Just one rule.",
    details: [
      "The king can move/capture as a rook or bishop using one step only. In simple terms, it can move to or capture any edge or vertex-adjacent cell a bishop or rook would be able to.",
    ],
    images: [king],
  },
] as const
