import { describe, expect, it, beforeEach, jest } from '@jest/globals'
import { displayTimeRemaining, isGameOver, createMove } from '../utils'
import { gameReducer } from '../reducer'
import type { Cell, Board } from '../../board/types'
import type { GameState, Move, GameAction } from '../types'
import type { Piece, PieceType, PieceColor } from '../../piece/types'

// Mock board and related functions
const mockBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null).map(() => ({
  id: '',
  x: 0,
  y: 0,
  color: 'w',
  side: 0,
  angle: 0,
  piece: null,
  edges: [[0,0], [0,0], [0,0], [0,0]],
  vertices: [[0,0], [0,0], [0,0], [0,0]]
})));

// Mock data for tests
const mockPiece = (type: PieceType, color: PieceColor, hasMoved = false): Piece => ({
  type,
  color,
  abbr: type === 'king' ? 'K' : type === 'queen' ? 'Q' : 'P',
  value: type === 'queen' ? 9 : type === 'king' ? Infinity : 1,
  image: {} as any,
  hasMoved
})

const mockCell = (id: string, x: number, y: number, piece: Piece | null = null): Cell => ({
  id,
  x,
  y,
  color: 'w',
  side: 0,
  angle: 0,
  piece,
  edges: [
    [x > 0 ? x-1 : x, y], // Left edge
    [x < 7 ? x+1 : x, y], // Right edge 
    [x, y > 0 ? y-1 : y], // Top edge
    [x, y < 7 ? y+1 : y]  // Bottom edge
  ],
  vertices: [
    [x > 0 && y > 0 ? x-1 : x, y > 0 && x > 0 ? y-1 : y],       // Top-left
    [x < 7 && y > 0 ? x+1 : x, y > 0 && x < 7 ? y-1 : y],       // Top-right
    [x > 0 && y < 7 ? x-1 : x, y < 7 && x > 0 ? y+1 : y],       // Bottom-left
    [x < 7 && y < 7 ? x+1 : x, y < 7 && x < 7 ? y+1 : y]        // Bottom-right
  ]
})

// Mock functions needed by the GameReducer
jest.mock('../../piece/utils', () => ({
  getPossibleMoves: jest.fn().mockReturnValue(new Set()),
  getInvalidMoves: jest.fn().mockReturnValue(new Set()),
  canPromote: jest.fn().mockReturnValue(false)
}));

// Mock moveHelper in utils
jest.mock('../utils', () => {
  // Use type casting to bypass TypeScript issues with jest.requireActual
  const originalModule = jest.requireActual('../utils') as any;
  
  return {
    displayTimeRemaining: originalModule.displayTimeRemaining,
    isGameOver: originalModule.isGameOver,
    createMove: originalModule.createMove,
    moveHelper: jest.fn().mockImplementation(() => ({
      turn: 'b',
      status: 'playing',
      checkedColor: null,
      move: {} as Move
    })),
    createGameState: jest.fn().mockReturnValue({
      player: { id: "1", color: "w", userId: "1", username: "Player 1" },
      opponent: { id: "2", color: "b", userId: "2", username: "Player 2" },
      turn: "w",
      check: null,
      status: "waiting",
      disabled: false,
      boardState: { 
        board: mockBoard, 
        selectedCell: null, 
        overCell: null 
      },
      previousMoves: [],
      capturedPieces: { w: [], b: [] }
    })
  };
});

describe('Game Utilities', () => {
  describe('createMove', () => {
    it('should create a move object with capture notation', () => {
      const from = mockCell('e2', 4, 6)
      const to = mockCell('d3', 3, 5, mockPiece('pawn-cw', 'b'))
      const piece = mockPiece('pawn-cw', 'w')
      
      const move = createMove('w', from, to, piece, null, null, 'playing')
      
      expect(move.player).toBe('w')
      expect(move.from).toEqual(from)
      expect(move.to).toEqual(to)
      expect(move.piece).toEqual(piece)
      expect(move.pieceCaptured).toEqual(to.piece)
      expect(move.notation).toBe('P:e2xd3')
      expect(move.check).toBe(false)
    })

    it('should create a move object with promotion and check notation', () => {
      const from = mockCell('e7', 4, 1)
      const to = mockCell('e8', 4, 0)
      const piece = mockPiece('pawn-cw', 'w')
      const promoted = mockPiece('queen', 'w')
      
      const move = createMove('w', from, to, piece, promoted, 'b', 'playing')
      
      expect(move.player).toBe('w')
      expect(move.piecePromoted).toEqual(promoted)
      expect(move.notation).toBe('P:e7-e8=Q+')
      expect(move.check).toBe(true)
    })
  })

  describe('displayTimeRemaining', () => {
    it('should format time correctly', () => {
      expect(displayTimeRemaining(65)).toBe('01:05')
      expect(displayTimeRemaining(3600)).toBe('60:00')
      expect(displayTimeRemaining(0)).toBe('00:00')
      expect(displayTimeRemaining(-10)).toBe('00:00')
    })
  })

  describe('isGameOver', () => {
    it('should return true for game over statuses', () => {
      expect(isGameOver('checkmate')).toBe(true)
      expect(isGameOver('draw-stalemate')).toBe(true)
      expect(isGameOver('draw-threefold')).toBe(true)
      expect(isGameOver('resignation')).toBe(true)
      expect(isGameOver('time-expired')).toBe(true)
    })

    it('should return false for ongoing game statuses', () => {
      expect(isGameOver('playing')).toBe(false)
      expect(isGameOver('waiting')).toBe(false)
    })
  })
})

describe('Game Reducer', () => {
  let initialState: GameState
  
  beforeEach(() => {
    jest.clearAllMocks();
    const { createGameState } = require('../utils');
    initialState = createGameState();
  })

  it('should handle SELECT_CELL action', () => {
    const cell = mockCell('e2', 4, 6, mockPiece('pawn-cw', 'w'))
    
    const action: GameAction = { type: 'SELECT_CELL', cell }
    const newState = gameReducer(initialState, action)
    
    expect(newState.boardState.selectedCell).not.toBeNull()
    expect(newState.boardState.selectedCell?.cell).toEqual(cell)
  })

  it('should handle SET_OVER_CELL action', () => {
    const cell = mockCell('e4', 4, 4)
    
    const action: GameAction = { type: 'SET_OVER_CELL', cell }
    const newState = gameReducer(initialState, action)
    
    expect(newState.boardState.overCell).toEqual(cell)
  })

  it('should handle RESET_GAME action', () => {
    // First, modify the initial state
    const modifiedState: GameState = {
      ...initialState,
      turn: 'b',
      status: 'playing',
      disabled: true
    }
    
    const action: GameAction = { type: 'RESET_GAME' }
    const newState = gameReducer(modifiedState, action)
    
    // Check if state is reset to default
    expect(newState.turn).toBe('w')
    expect(newState.status).toBe('waiting')
    expect(newState.disabled).toBe(false)
  })

  it('should handle START_GAME action', () => {
    const action: GameAction = { 
      type: 'START_GAME', 
      duration: 600,
      players: [
        { id: '10', color: 'w', userId: '10', username: 'White Player' },
        { id: '20', color: 'b', userId: '20', username: 'Black Player' }
      ]
    }
    
    const newState = gameReducer(initialState, action)
    
    expect(newState.status).toBe('playing')
    expect(newState.player).toEqual(action.players![0])
    expect(newState.opponent).toEqual(action.players![1])
    expect(newState.timer).toEqual({ w: 600, b: 600 })
  })

  it('should handle DECREMENT_TIMER action', () => {
    // Create state with timer
    const stateWithTimer: GameState = {
      ...initialState,
      timer: { w: 300, b: 300 }
    }
    
    const action: GameAction = { type: 'DECREMENT_TIMER', player: 'w' }
    const newState = gameReducer(stateWithTimer, action)
    
    expect(newState.timer?.w).toBe(299)
    expect(newState.timer?.b).toBe(300)
  })
})
