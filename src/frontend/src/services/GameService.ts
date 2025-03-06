import { Socket } from 'socket.io-client';
import { socket } from '../lib/socket';
import type { 
  MultiplayerGameState,
  Move,
  MultiplayerGameAction
} from '../features/game/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

class GameService {
  private gameStateCallback: ((state: MultiplayerGameState) => void) | null = null;

  // REST API Methods
  async createGame(duration: number): Promise<{ gameId: string }> {
    const response = await fetch(`${API_BASE}/game/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration }),
    });
    if (!response.ok) {
      throw new Error('Failed to create game');
    }
    return response.json();
  }

  async joinGame(gameId: string, playerName: string): Promise<MultiplayerGameState> {
    const response = await fetch(`${API_BASE}/game/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, playerName }),
    });
    if (!response.ok) {
      throw new Error('Failed to join game');
    }
    return response.json();
  }

  async getGameState(gameId: string): Promise<MultiplayerGameState> {
    const response = await fetch(`${API_BASE}/game/${gameId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch game state');
    }
    return response.json();
  }

  // Socket Methods
  connectToGame(gameId: string, onGameState: (state: MultiplayerGameState) => void): void {
    this.gameStateCallback = onGameState;
    
    // Connect to socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Join the game room
    socket.emit('joinGame', gameId);

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    socket.on('gameEvent', (event: MultiplayerGameAction) => {
      if (this.gameStateCallback) {
        // Handle different event types
        switch (event.type) {
          case 'GAME_START':
          case 'MOVE_PIECE':
          case 'END_GAME':
            this.gameStateCallback(event.payload as MultiplayerGameState);
            break;
          default:
            console.log('Unhandled event type:', event.type);
        }
      }
    });

    socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });
  }

  makeMove(move: Move): void {
    socket.emit('gameEvent', {
      type: 'MOVE_PIECE',
      payload: move,
    });
  }

  offerDraw(playerId: string): void {
    socket.emit('gameEvent', {
      type: 'DRAW_OFFER',
      payload: { playerId },
    });
  }

  respondToDraw(accepted: boolean): void {
    socket.emit('gameEvent', {
      type: 'DRAW_RESPONSE',
      payload: { accepted },
    });
  }

  disconnect(): void {
    socket.disconnect();
  }
}

// Export a singleton instance
export const gameService = new GameService(); 