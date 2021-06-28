import { SquareType } from '../enums';
import { IChessSquare } from '../interfaces';

export const genSquareId = (
  square: Omit<IChessSquare, 'id'>,
  playerIndex: number = 0,
) => `${playerIndex}_${square.type}_${square.index}`;

// checkSquareIndexType Check index of a square and return the square type
export const checkSquareIndexType = (index: number, numOfSquaresPerPlayer: number = 5): SquareType => {
  if ((index + 1) % (numOfSquaresPerPlayer+1) == 0) {
    return SquareType.BIG_SQUARE;
  }
  return SquareType.SMALL_SQUARE
} 