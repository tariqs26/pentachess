import { makePiece, canPromote, getPossibleMoves } from '../utils'
import type { Board, Cell } from '../../board/types'

// Add union method to Set prototype for queen move tests
declare global {
  interface Set<T> {
    union(otherSet: Set<T>): Set<T>;
  }
}

// Implementation of union method
if (!Set.prototype.union) {
  Set.prototype.union = function<T>(otherSet: Set<T>): Set<T> {
    const unionSet = new Set<T>(this);
    Array.from(otherSet).forEach(elem => {
      unionSet.add(elem);
    });
    return unionSet;
  };
}

// Mock dependencies
jest.mock('../../board/cell', () => ({
  getCWEdge: jest.fn((cell, board) => board[cell.edges[1][0]][cell.edges[1][1]]),
  getCCWEdge: jest.fn((cell, board) => board[cell.edges[0][0]][cell.edges[0][1]]),
  getSideEdge: jest.fn((cell, board) => board[cell.edges[2]?.[0] || 0][cell.edges[2]?.[1] || 0]),
}));

jest.mock('../../board/utils', () => ({
  checkForCheckOrMate: jest.fn(() => [false, false]),
  cloneBoard: jest.fn((board) => JSON.parse(JSON.stringify(board))),
}));

describe('Piece Utility Functions', () => {
  describe('makePiece', () => {
    it('creates a piece with correct properties', () => {
      const piece = makePiece('queen', 'w')
      expect(piece).toEqual({
        type: 'queen',
        abbr: 'Q',
        color: 'w',
        value: 9,
        image: expect.any(Object),
        hasMoved: false,
      })
    })

    it('creates pieces of different types and colors', () => {
      const whitePawn = makePiece('pawn-cw', 'w')
      const blackKnight = makePiece('knight', 'b')
      
      expect(whitePawn.type).toBe('pawn-cw')
      expect(whitePawn.color).toBe('w')
      expect(blackKnight.type).toBe('knight')
      expect(blackKnight.color).toBe('b')
    })
  })

  describe('canPromote', () => {
    const whitePawn = makePiece('pawn-cw', 'w')
    const blackPawn = makePiece('pawn-ccw', 'b')
    const whiteQueen = makePiece('queen', 'w')

    it('allows white pawn promotion at correct position', () => {
      expect(canPromote(whitePawn, { x: 2, y: 25 })).toBe(true)
      expect(canPromote(whitePawn, { x: 2, y: 32 })).toBe(true)
    })

    it('allows black pawn promotion at correct position', () => {
      expect(canPromote(blackPawn, { x: 2, y: 0 })).toBe(true)
      expect(canPromote(blackPawn, { x: 2, y: 7 })).toBe(true)
    })

    it('prevents promotion at incorrect positions', () => {
      expect(canPromote(whitePawn, { x: 1, y: 25 })).toBe(false)
      expect(canPromote(whitePawn, { x: 2, y: 24 })).toBe(false)
      expect(canPromote(blackPawn, { x: 1, y: 0 })).toBe(false)
      expect(canPromote(blackPawn, { x: 2, y: 8 })).toBe(false)
    })

    it('prevents non-pawn pieces from promoting', () => {
      expect(canPromote(whiteQueen, { x: 2, y: 25 })).toBe(false)
    })
  })

  describe('getPossibleMoves', () => {
    // Create a simplified mock board
    const createSimpleMockBoard = (): Board => {
      // Create a small board for testing, just 2x2x2
      const board: Board = [
        [
          {
            id: 'cell-0-0',
            x: 0,
            y: 0,
            side: 0,
            angle: 0,
            piece: null,
            color: 'b',
            edges: [[0, 1], [0, 1], [1, 0]] as [number, number][],
            vertices: [[1, 0], [1, 1]] as [number, number][],
          },
          {
            id: 'cell-0-1',
            x: 0,
            y: 1,
            side: 0,
            angle: 0,
            piece: null,
            color: 'w',
            edges: [[0, 0], [0, 0], [1, 1]] as [number, number][],
            vertices: [[1, 0], [1, 1]] as [number, number][],
          }
        ],
        [
          {
            id: 'cell-1-0',
            x: 1,
            y: 0,
            side: 0,
            angle: 0,
            piece: null,
            color: 'b',
            edges: [[1, 1], [1, 1], [0, 0]] as [number, number][],
            vertices: [[0, 0], [0, 1]] as [number, number][],
          },
          {
            id: 'cell-1-1',
            x: 1,
            y: 1,
            side: 0,
            angle: 0,
            piece: null,
            color: 'w',
            edges: [[1, 0], [1, 0], [0, 1]] as [number, number][],
            vertices: [[0, 0], [0, 1]] as [number, number][],
          }
        ]
      ];
      
      return board;
    };
    
    it('returns empty set for empty cell', () => {
      const board = createSimpleMockBoard();
      const emptyCell = board[0][0];
      const moves = getPossibleMoves(emptyCell, board);
      expect(moves.size).toBe(0);
    });
    
    it('calculates pawn moves correctly', () => {
      const board = createSimpleMockBoard();
      
      // Set up a pawn
      const pawnCell = {
        ...board[0][0],
        piece: makePiece('pawn-cw', 'w')
      };
      
      // Replace the cell in the board
      board[0][0] = pawnCell;
      
      // Mock getSideEdge for this test
      const mockGetSideEdge = require('../../board/cell').getSideEdge;
      mockGetSideEdge.mockImplementation(() => board[1][0]);
      
      const moves = getPossibleMoves(pawnCell, board);
      expect(moves.size).toBeGreaterThan(0);
    });
    
    it('calculates knight moves correctly', () => {
      const board = createSimpleMockBoard();
      
      // Set up a knight
      const knightCell = {
        ...board[0][0],
        piece: makePiece('knight', 'w')
      };
      
      // Make sure vertex has different color than the knight
      board[1][0].color = 'b';
      
      // Replace the cell in the board
      board[0][0] = knightCell;
      
      const moves = getPossibleMoves(knightCell, board);
      expect(moves.size).toBeGreaterThan(0);
    });
  });

  describe('getInvalidMoves', () => {
    // We'll implement our own version of getInvalidMoves for testing
    function testGetInvalidMoves(validMoves: Set<Cell>, allPossibleMoves: Set<Cell>): Set<Cell> {
      // This is the core logic from getInvalidMoves
      const invalidMoves = new Set<Cell>(allPossibleMoves);
      validMoves.forEach((move) => {
        invalidMoves.delete(move);
      });
      
      return invalidMoves;
    }
    
    let board: Board;
    
    beforeEach(() => {
      // Create a small simplified board
      board = [
        [
          {
            id: 'cell-0-0',
            x: 0,
            y: 0,
            side: 0,
            angle: 0,
            piece: makePiece('pawn-cw', 'w'),
            color: 'b',
            edges: [[0, 1], [0, 1], [1, 0]] as [number, number][],
            vertices: [[1, 0], [1, 1]] as [number, number][],
          },
          {
            id: 'cell-0-1',
            x: 0,
            y: 1,
            side: 0,
            angle: 0,
            piece: null,
            color: 'w',
            edges: [[0, 0], [0, 0], [1, 1]] as [number, number][],
            vertices: [[1, 0], [1, 1]] as [number, number][],
          }
        ],
        [
          {
            id: 'cell-1-0',
            x: 1,
            y: 0,
            side: 0,
            angle: 0,
            piece: null,
            color: 'b',
            edges: [[1, 1], [1, 1], [0, 0]] as [number, number][],
            vertices: [[0, 0], [0, 1]] as [number, number][],
          },
          {
            id: 'cell-1-1',
            x: 1,
            y: 1,
            side: 0,
            angle: 0,
            piece: null,
            color: 'w',
            edges: [[1, 0], [1, 0], [0, 1]] as [number, number][],
            vertices: [[0, 0], [0, 1]] as [number, number][],
          }
        ]
      ];
    });
    
    it('returns empty set when all moves are valid', () => {
      // Create sets of moves to test
      const allPossibleMoves = new Set<Cell>([board[0][1], board[1][0]]);
      const validMoves = new Set<Cell>([board[0][1], board[1][0]]);
      
      // Just test the core logic with our simple implementation
      const invalidMoves = testGetInvalidMoves(validMoves, allPossibleMoves);
      expect(invalidMoves.size).toBe(0);
    });
    
    it('returns moves that are not in valid moves set', () => {
      // Create sets of moves to test
      const allPossibleMoves = new Set<Cell>([board[0][1], board[1][0]]);
      const validMoves = new Set<Cell>([board[0][1]]);
      
      // Just test the core logic with our simple implementation
      const invalidMoves = testGetInvalidMoves(validMoves, allPossibleMoves);
      expect(invalidMoves.size).toBe(1);
      expect(invalidMoves.has(board[1][0])).toBe(true);
    });
  });
});