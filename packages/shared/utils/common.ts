import { SquareType } from '../enums';
import { IChessSquare } from '../interfaces';

export const genSquareId = (
  square: Omit<IChessSquare, 'id'>,
  playerIndex: number = 0,
) => `${playerIndex}_${square.type}_${square.index}`;

// checkSquareIndexType Check index of a square and return the square type
export const checkSquareIndexType = (index: number): SquareType => {
  if ((index + 1) % 6 == 0) {
    return SquareType.BIG_SQUARE;
  }
  return SquareType.SMALL_SQUARE
} 