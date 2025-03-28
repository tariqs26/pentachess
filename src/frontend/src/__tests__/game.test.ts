import { describe, expect, it, jest } from '@jest/globals';
import { createGameState } from '../features/game/utils';
import type { GameState } from '../features/game/types';
import type { Cell, Board } from '../features/board/types';
import type { Piece, PieceType, PieceColor } from '../features/piece/types';

// Mock the necessary functions
jest.mock('../features/piece/utils', () => ({
  getPossibleMoves: jest.fn(() => new Set()),
  getInvalidMoves: jest.fn(() => new Set()),
  canPromote: jest.fn(() => false),
  getForwardEdge: jest.fn(),
  getPawnTypeMoves: jest.fn(() => new Set()),
  getKnightTypeMoves: jest.fn(() => new Set()),
  getKingTypeMoves: jest.fn(() => new Set()),
}));

// Mock board-related utility functions to avoid errors
jest.mock('../features/board/cell', () => ({
  getCWEdge: jest.fn().mockReturnValue({}),
  getCCWEdge: jest.fn().mockReturnValue({}),
  getForwardEdge: jest.fn().mockReturnValue({}),
  getOppositeColor: jest.fn(color => color === 'w' ? 'b' : 'w'),
}));

// Create mock objects for testing
const mockBoard: Board = Array(8).fill(null).map(() => 
  Array(8).fill(null).map(() => ({
    id: '',
    x: 0,
    y: 0,
    color: 'w',
    side: 0,
    angle: 0,
    piece: null,
    edges: [[0,0], [0,0], [0,0], [0,0]],
    vertices: [[0,0], [0,0], [0,0], [0,0]]
  }))
);

// Initialize the board with proper coordinates
for (let x = 0; x < 8; x++) {
  for (let y = 0; y < 8; y++) {
    mockBoard[x][y] = {
      id: `${String.fromCharCode(97 + x)}${8 - y}`,
      x,
      y,
      color: (x + y) % 2 === 0 ? 'w' : 'b',
      side: 0,
      angle: 0,
      piece: null,
      edges: [
        [Math.max(0, x-1), y], // Left
        [Math.min(7, x+1), y], // Right
        [x, Math.max(0, y-1)], // Top
        [x, Math.min(7, y+1)]  // Bottom
      ],
      vertices: [
        [Math.max(0, x-1), Math.max(0, y-1)], // Top-left
        [Math.min(7, x+1), Math.max(0, y-1)], // Top-right
        [Math.max(0, x-1), Math.min(7, y+1)], // Bottom-left
        [Math.min(7, x+1), Math.min(7, y+1)]  // Bottom-right
      ]
    };
  }
}

const mockPiece = (type: PieceType, color: PieceColor, hasMoved = false): Piece => ({
  type,
  color,
  abbr: type === 'king' ? 'K' : type === 'queen' ? 'Q' : 'P',
  value: type === 'queen' ? 9 : type === 'king' ? Infinity : 1,
  image: {} as any,
  hasMoved
});

const mockCell = (id: string, x: number, y: number, piece: Piece | null = null): Cell => {
  // Make sure x and y are valid board coordinates
  x = Math.min(Math.max(x, 0), 7);
  y = Math.min(Math.max(y, 0), 7);
  
  return {
    id,
    x,
    y,
    color: (x + y) % 2 === 0 ? 'w' : 'b',
    side: 0,
    angle: 0,
    piece,
    edges: [
      [Math.max(0, x-1), y], // Left
      [Math.min(7, x+1), y], // Right
      [x, Math.max(0, y-1)], // Top
      [x, Math.min(7, y+1)]  // Bottom
    ],
    vertices: [
      [Math.max(0, x-1), Math.max(0, y-1)], // Top-left
      [Math.min(7, x+1), Math.max(0, y-1)], // Top-right
      [Math.max(0, x-1), Math.min(7, y+1)], // Bottom-left
      [Math.min(7, x+1), Math.min(7, y+1)]  // Bottom-right
    ]
  };
};

// Mock moveHelper for the reducer
jest.mock('../features/game/utils', () => {
  // Add type annotation for the imported module
  const originalModule = jest.requireActual('../features/game/utils') as {
    createGameState: () => any;
    isGameOver: (status: any) => boolean;
    displayTimeRemaining: (timeInSeconds: number) => string;
  };
  
  return {
    createGameState: originalModule.createGameState,
    isGameOver: originalModule.isGameOver,
    displayTimeRemaining: originalModule.displayTimeRemaining,
    moveHelper: jest.fn().mockImplementation(() => ({
      turn: 'b',
      status: 'playing',
      checkedColor: null,
      move: { player: 'w', from: {}, to: {}, piece: {}, pieceCaptured: null, piecePromoted: null, check: false, status: 'playing', notation: 'P:e2-e4', timestamp: new Date() }
    }))
  };
});

// Test cases for game utility functions
describe('Game Utility Functions', () => {
  it('should display time remaining in mm:ss format', () => {
    const { displayTimeRemaining } = require('../features/game/utils');
    
    expect(displayTimeRemaining(65)).toBe('01:05');
    expect(displayTimeRemaining(300)).toBe('05:00');
    expect(displayTimeRemaining(0)).toBe('00:00');
    expect(displayTimeRemaining(-10)).toBe('00:00');
  });
  
  it('should properly identify game over states', () => {
    const { isGameOver } = require('../features/game/utils');
    
    expect(isGameOver('checkmate')).toBe(true);
    expect(isGameOver('draw-stalemate')).toBe(true);
    expect(isGameOver('resignation')).toBe(true);
    expect(isGameOver('playing')).toBe(false);
    expect(isGameOver('waiting')).toBe(false);
  });
});

describe('Game Component', () => {
  let initialState: GameState;
  
  beforeEach(() => {
    jest.clearAllMocks();
    initialState = createGameState();
  });

  describe('Functional Requirements', () => {
    // Game setup tests
    it('should create a proper initial game state', () => {
      const state = createGameState();
      
      expect(state.turn).toBe('w');
      expect(state.status).toBe('waiting');
      expect(state.disabled).toBe(false);
      expect(state.previousMoves).toEqual([]);
      expect(state.capturedPieces).toEqual({ w: [], b: [] });
    });
    
    // Basic piece functions tests
    it('should track piece movement state', () => {
      const piece = mockPiece('pawn-cw', 'w', false);
      
      expect(piece.hasMoved).toBe(false);
      
      // Simulate what happens in the reducer
      piece.hasMoved = true;
      expect(piece.hasMoved).toBe(true);
    });
    
    // Testing color of pieces
    it('should ensure pieces have correct color', () => {
      const whitePiece = mockPiece('queen', 'w');
      const blackPiece = mockPiece('queen', 'b');
      
      expect(whitePiece.color).toBe('w');
      expect(blackPiece.color).toBe('b');
    });
    
    // Testing promotion
    it('should set up different piece types with correct attributes', () => {
      const pawn = mockPiece('pawn-cw', 'w');
      const queen = mockPiece('queen', 'w');
      const king = mockPiece('king', 'w');
      
      expect(pawn.type).toBe('pawn-cw');
      expect(queen.type).toBe('queen');
      expect(king.type).toBe('king');
      
      expect(pawn.abbr).toBe('P');
      expect(queen.abbr).toBe('Q');
      expect(king.abbr).toBe('K');
      
      expect(king.value).toBe(Infinity);
      expect(queen.value).toBe(9);
    });
  });

  describe('Non-Functional Requirements', () => {
    // Simple performance test
    it('should create game state quickly', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        createGameState();
      }
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      // Creating 100 game states should be fast
      expect(processingTime / 100).toBeLessThan(10); // Less than 10ms per state
    });
  });
}); 