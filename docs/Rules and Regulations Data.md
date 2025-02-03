# Rules and Regulations Data

Welcome to Pentachess! We hope you enjoy your stay! Below are the general rules of the game.

## Objective

The goal of Pentachess is to checkmate the opponent's king. This means that you have put the king in check (danger), and there is no legal move for the opponent to play that gets them out of check.

## Setup

The game is played on a 90 tile board consisting of 3 decagon rings, with 10, 30, and 50 tiles within the inner, center, and outer decagons, respectively. Each player has 18 pieces consisting of 7 underlying pieces.

## Movement

The rules of movement can be seen for each piece below:

### Pawn (CW/CCW)

Pawns are given a direction which its moves are based on. Pawns starting on the left are clockwise (CW), and pawns starting on the right are counter-clockwise (CCW). Pawns have three different types of moves, Passive Moves, where the pawn can only move to a certain cell if it is empty, Capture Moves, where the pawn can only move to a certain cell if it is occupied by an opponent's piece, and a Promotion, where the pawn can promote to another piece when reaching a certain point on the board:

- Passive Moves:
  - Pawns can move one cell across an edge within its decagon using its given direction. Additionally, if it is the pawn's first move, they have the option of moving two cells forward.
  - Pawns can also move one cell across an edge into a different decagon, if such an edge exists, regardless of direction.
- Capture Moves:
  - Pawns can capture one cell across a vertex within its decagon using its given direction.
  - Pawns can also capture one cell across a vertex into a different decagon that is the same cell color as its starting cell, and also shares the same vertex with the next same-color cell within the starting decagon using its given direction.
- Promotion:
  - Pawns can promote to either a Knight, Bishop, Rook, or Queen, when they reach the opposite side of the board. More specifically, the white team's pawns can promote if they reach the range of cells A25-A32, and the black team's pawns can promote if they reach the range of cells A0-A7.

### Berolina (CW/CCW)

Berolinas work very similarly to pawns. The direction logic remains the same, and they also have three types of moves that a pawn does. The only differences are as follows:

- All Passive Moves and Capture Moves of a berolina are equal to the Capture Moves and Passives Moves of a pawn respectively. Or put more simply, a berolina passively moves as a pawn captures, and captures as a pawn passively moves.
- It does not move two cells forward on its first move like a pawn does.

### Knight

Knights can move/capture one cell across a vertex to a different-color cell, excluding any edge-adjacent cells.

### Bishop

Bishops have three different types of moves:

- Bishops can move/capture to any same-color cell within its decagon as long as the path to that cell is clear (meaning there are no other pieces in its path). Here, the path consists of all same-colored cells from the starting point to the desired cell.
- Bishops can also move/capture to any same-color cell across a vertex into a different decagon.
- Bishops can also move/capture to any same-color cell across two consecutive vertices (two decagons away) as long as the cell has the same orientation as its starting cell, and the path to that cell is clear.

### Rook

Rooks have two different types of moves:

- Rooks can move/capture to any cell within its decagon as long as the path to that cell is clear. Here, the path consists of all cells from the starting point to the desired cell.
- Rooks can also move/capture one cell across an edge into a different decagon, if such an edge exists.

### Queen

Queens can move/capture as a rook or bishop. This means all available moves that a rook or bishop can do on the cell that the queen is on is a legal move for the queen.

### King

The king can move/capture as a rook or bishop using one step only. In simpler terms, it can move/capture to any cell across an edge or across a vertex (regardless of the decagon it lies in).

## Turns

Both players will alternate turns moving one piece per turn.

## Time Control

Each game can be setup with a unique timer that decreases while it is a player's turn. The timer pauses once it is no longer that player's turn. Once the time for a player runs out, that player automatically loses.

## Win Condition

Victory is achieved by one of three options:

- Checkmate: described in the 'Objective' above
- Resignation: the opponent resigns
- Timer reaches 0: the opponent runs out of time on their timer.

## Draw Condition

Drawing is achieved by one of four options:

- Stalemate: a player's king is not in check while at the same time not having any legal moves on their turn (essentially, when the player is stuck).
- Insufficient material: both players don't have the necessary pieces to put their opponent into checkmate.
- Threefold repetition: both players play the exact same moves 3 times in a row.
- Agreed upon draw: one player requests to draw the game, and the other person accepts.
