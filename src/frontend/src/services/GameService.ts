import { io, Socket } from 'socket.io';
import type { 
  MultiplayerGameState,
  Move,
  MultiplayerGameAction,
  MultiplayerPlayer
} from '../features/game/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

class GameService {
  private socket: Socket | null = null;
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
    this.socket = io(SOCKET_URL, {
      query: { gameId },
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('gameEvent', (event: MultiplayerGameAction) => {
      if (this.gameStateCallback) {
        // For GAME_START and MOVE_MADE events, the payload contains the full game state
        if (event.type === 'GAME_START' || event.type === 'MOVE_MADE') {
          this.gameStateCallback(event.payload as MultiplayerGameState);
        }
      }
    });

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });
  }

  makeMove(move: Move): void {
    if (!this.socket) return;
    this.socket.emit('gameEvent', {
      type: 'MOVE_MADE',
      payload: move,
    });
  }

  offerDraw(playerId: string): void {
    if (!this.socket) return;
    this.socket.emit('gameEvent', {
      type: 'DRAW_OFFER',
      payload: { playerId },
    });
  }

  respondToDraw(accepted: boolean): void {
    if (!this.socket) return;
    this.socket.emit('gameEvent', {
      type: 'DRAW_RESPONSE',
      payload: { accepted },
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Export a singleton instance
export const gameService = new GameService(); 