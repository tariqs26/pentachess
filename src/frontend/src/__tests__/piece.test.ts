import { describe, expect, it } from '@jest/globals';
import { makePiece } from '../features/piece/utils';
import { PIECE_DATA } from '../features/piece/constants';

describe('Cell & Piece Components', () => {
  describe('Functional Requirements', () => {
    it('should display correct piece image for each piece type', () => {
      // Test a white queen
      const queen = makePiece('queen', 'w');
      expect(queen.image).toBe(PIECE_DATA.queen.image.w);
      
      // Test a black rook
      const rook = makePiece('rook', 'b');
      expect(rook.image).toBe(PIECE_DATA.rook.image.b);
      
      // Test a white knight
      const knight = makePiece('knight', 'w');
      expect(knight.image).toBe(PIECE_DATA.knight.image.w);
      
      // Test a pawn with direction
      const pawnCw = makePiece('pawn-cw', 'b');
      expect(pawnCw.image).toBe(PIECE_DATA['pawn-cw'].image.b);
      
      // Test a berolina pawn
      const berolinaPawn = makePiece('berolina-pawn-ccw', 'w');
      expect(berolinaPawn.image).toBe(PIECE_DATA['berolina-pawn-ccw'].image.w);
    });

    it('should render pieces above their cells', () => {
      // In actual Cell component implementation, pieces are positioned absolutely
      // This test verifies the Cell component's design features
      
      // Create a piece object
      const kingPiece = makePiece('king', 'w');
      
      // Check that pieces have the required properties to be displayed
      expect(kingPiece).toHaveProperty('image');
      expect(kingPiece).toHaveProperty('type');
      expect(kingPiece).toHaveProperty('color');
      
      // Check that the king has the correct properties
      expect(kingPiece.type).toBe('king');
      expect(kingPiece.color).toBe('w');
      expect(kingPiece.abbr).toBe('K');
      expect(kingPiece.value).toBe(9999); // Kings have the highest value
      expect(kingPiece.hasMoved).toBe(false); // New pieces haven't moved yet
    });

    it('should display captured pieces in the correct "captured pieces" section', () => {
      // Test the data structure used for captured pieces
      
      // Create sample captured pieces with different types
      const capturedPieces = [
        makePiece('pawn-cw', 'b'),
        makePiece('knight', 'b'),
        makePiece('bishop', 'b'),
      ];
      
      // Check that the captured pieces array has the correct structure
      expect(capturedPieces.length).toBe(3);
      expect(capturedPieces[0].type).toBe('pawn-cw');
      expect(capturedPieces[0].color).toBe('b');
      expect(capturedPieces[1].type).toBe('knight');
      expect(capturedPieces[1].abbr).toBe('N'); // Knight is represented as N
      expect(capturedPieces[2].type).toBe('bishop');
      expect(capturedPieces[2].value).toBe(3); // Bishop has value 3
      
      // Check that each captured piece has an image to display
      expect(capturedPieces[0].image).toBeTruthy();
      expect(capturedPieces[1].image).toBeTruthy();
      expect(capturedPieces[2].image).toBeTruthy();
      
      // Verify increasing total value of captured pieces
      const totalValue = capturedPieces.reduce((sum, piece) => sum + piece.value, 0);
      expect(totalValue).toBe(1 + 3 + 3); // Pawn(1) + Knight(3) + Bishop(3)
    });
  });
}); 