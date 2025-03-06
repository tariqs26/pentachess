import { localGameReducer } from './localGameReducer';
import type { MultiplayerGameState, MultiplayerGameAction, Player } from './types';

export const multiplayerGameReducer = (
  state: MultiplayerGameState,
  action: MultiplayerGameAction
): MultiplayerGameState => {
  switch (action.type) {
    case 'GAME_JOIN': {
      const player = action.payload;
      return {
        ...state,
        player,
        opponent: { id: '', color: player.color === 'w' ? 'b' : 'w' } // Temporary opponent until game starts
      };
    }

    case 'GAME_START': {
      return action.payload;
    }

    case 'GAME_END': {
      return action.payload;
    }

    // For local game actions, use the local game reducer
    default: {
      const localState = {
        ...state,
        player: state.player.color,
        opponent: state.opponent.color
      };

      const newLocalState = localGameReducer(localState, action);

      return {
        ...state,
        ...newLocalState,
        player: state.player,
        opponent: state.opponent
      };
    }
  }
};