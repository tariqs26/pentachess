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
import rook1 from "/public/pieces_rules/rook-1-zoom.png"
import rook2 from "/public/pieces_rules/rook-2-zoom.png"
import queen from "/public/pieces_rules/queen-zoom.png"
import king from "/public/pieces_rules/king-zoom.png"

export const pieceMovementRules = [
  {
    title: "Pawn (CW/CCW)",
    description:
      "The pawn has three types of actions: move, capture, and promotion. Each pawn is marked for direction, either clockwise or counterclockwise.",
    details: [
      "Move: The pawn can move within its decagon one cell across an edge in its given direction. If it is the pawn's first move, it can move two cells forward.",
      "Move: The pawn can also move one cell across an edge into an adjacent decagon.",
      "Capture: The pawn can capture within its decagon one cell across a vertex in its given direction.",
      "Capture: The pawn can also capture onto a same-colour cell across a vertex into a different decagon, if the destination cell shares one vertex with the pawn's originating cell and with the next same-colour cell in its given direction in its originating decagon.",
      "Promotion: The pawn can be promoted to a knight, bishop, rook, or queen upon reaching the opposite side of the board: any cell from a25 to a32 for team White, and any cell from a0 to a7 for team Black.",
    ],
    images: [pawn1, pawn2, pawn3, pawn4, pawn5],
  },
  {
    title: "Berolina pawn (CW/CCW)",
    description:
      "Similar to the pawn but with reversed move and capture. It is also marked for clockwise or counterclockwise direction. It cannot, however, move two cell forward on its first move.",
    details: [
      "The Berolina pawn moves as the pawn captures.",
      "Capturures as the pawn moves and can also be promoted.",
    ],
    images: [berolina1, berolina2],
  },
  {
    title: "Knight",
    description: "The knight is pretty straightforward, just one rule.",
    details: [
      "The knight can move onto one cell across a vertex to a different-colour cell, excluding any edge-adjacent cells.",
    ],
    images: [knight],
  },
  {
    title: "Bishop",
    description:
      "The bishop has three types of move; two are simple, and one is tricky.",
    details: [
      "The bishop can move onto any same-colour cell within its decagon as long as the path to that cell is clear (meaning there are no other pieces in its path). Here, the path consists of all same-colour cells from the starting point to the destination cell.",
      "The bishop can also move onto any same-colour cell across a vertex into a different decagon, and onto any same-colour cell across two consecutive vertices in a straight line (two decagons away) as long as the destination cell has the same orientation as its originating cell, and the path to that cell is clear.",
    ],
    images: [bishop1, bishop2],
  },
  {
    title: "Rook",
    description: "The rook is not too difficult, just two types of move.",
    details: [
      "The rook can move onto any cell within its decagon as long as the path to that cell is clear. Here, the path consists of all cells from the starting point to the destination cell.",
      "The rook can also move onto one cell across an edge into a different decagon if such an edge exists.",
    ],
    images: [rook1, rook2],
  },
  {
    title: "Queen",
    description:
      "The queen's move is simple to understand, assuming you have an understanding of the bishop and rook.",
    details: [
      "The queen can move as a rook or bishop. This means all available moves that the rook or bishop can make from the cell that the queen is on are legal moves for the queen.",
    ],
    images: [queen],
  },
  {
    title: "King",
    description: "Make sure to defend this piece at all costs! Just one rule.",
    details: [
      "The king can move as a rook or bishop by one step only. In simple terms, it can move onto any edge or vertex-adjacent cell that the bishop or rook would be able to.",
    ],
    images: [king],
  },
] as const
