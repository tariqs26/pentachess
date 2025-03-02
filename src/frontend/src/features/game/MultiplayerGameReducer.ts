import { localGameReducer } from './reducer';
import type { MultiplayerGameState, MultiplayerGameAction, MultiplayerPlayer } from './types';
import { initializeBoard } from '../board/utils';

export const createInitialMultiplayerState = (): MultiplayerGameState => ({
  id: '',
  status: 'waiting',
  turn: 'w',
  check: null,
  boardState: {
    disabled: false,
    board: initializeBoard(),
    selectedCell: null,
    overCell: null,
  },
  timer: { w: 0, b: 0 },
  previousMoves: [],
  capturedPieces: { w: [], b: [] },
  player: { id: '', color: 'w' },
  opponent: { id: '', color: 'b' },
});

export const multiplayerGameReducer = (
  state: MultiplayerGameState,
  action: MultiplayerGameAction
): MultiplayerGameState => {
  // Handle multiplayer-specific actions
  switch (action.type) {
    case 'GAME_JOIN': {
      const player = action.payload;
      return {
        ...state,
        players: [...state.players, player]
      };
    }

    case 'GAME_START': {
      return {
        ...action.payload,
        boardState: {
          ...action.payload.boardState,
          disabled: action.payload.currentPlayerId !== state.currentPlayerId
        }
      };
    }

    case 'MOVE_MADE': {
      // Convert multiplayer move to local move format
      const localMoveAction = {
        type: 'MOVE_PIECE' as const,
        move: {
          from: action.payload.from,
          to: action.payload.to,
          piece: action.payload.piece
        }
      };

      // Use local game reducer with converted action
      const localState = {
        ...state,
        player: state.players.find(p => p.id === state.currentPlayerId)?.color || 'w',
        opponent: state.players.find(p => p.id !== state.currentPlayerId)?.color || 'b'
      };

      const newLocalState = localGameReducer(localState, localMoveAction);

      return {
        ...state,
        ...newLocalState,
        currentPlayerId: state.currentPlayerId,
        players: state.players
      };
    }

    case 'DRAW_OFFER': {
      return {
        ...state,
        drawOffer: action.payload.playerId
      };
    }

    case 'DRAW_RESPONSE': {
      if (action.payload.accepted) {
        return {
          ...state,
          status: 'draw-agreement',
          drawOffer: undefined
        };
      }
      return {
        ...state,
        drawOffer: undefined
      };
    }

    case 'TIMER_UPDATE': {
      return {
        ...state,
        timer: action.payload
      };
    }

    // For local game actions, use the local game reducer
    default: {
      if (isLocalGameAction(action)) {
        const localState = {
          ...state,
          player: state.players.find(p => p.id === state.currentPlayerId)?.color || 'w',
          opponent: state.players.find(p => p.id !== state.currentPlayerId)?.color || 'b'
        };

        const newLocalState = localGameReducer(localState, action);

        return {
          ...state,
          ...newLocalState,
          currentPlayerId: state.currentPlayerId,
          players: state.players
        };
      }
      return state;
    }
  }
};

// Type guard to check if an action is a LocalGameAction
function isLocalGameAction(action: MultiplayerGameAction): action is Extract<MultiplayerGameAction, { type: string }> {
  return !['GAME_JOIN', 'GAME_START', 'MOVE_MADE', 'TIMER_UPDATE', 'DRAW_OFFER', 'DRAW_RESPONSE'].includes(action.type);
}