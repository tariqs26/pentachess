import { pieceClick, initializeBoard } from "./utils"

const board = initializeBoard()

// pieceClick will return an array of possible moves for the selected piece
const possibleMoves = pieceClick(board[1][24], board)

// iterate over possible moves and print their x and y coordinates
for (const move of possibleMoves) {
  console.log(move.x, move.y)
}

// logBoard(board)

console.log(board.flat().filter((cell) => cell.piece).length)
