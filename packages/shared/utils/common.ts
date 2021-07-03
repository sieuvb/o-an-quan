import { PLAYER_SQUARES } from '../constants';
import { SquareType } from '../enums';
import { IChessSquare } from '../interfaces';

export const getSquareId = (squareIndex: number) => `square_${squareIndex}`;

// checkSquareIndexType Check index of a square and return the square type
export const checkSquareIndexType = (
  index: number,
  numOfSquaresPerPlayer: number = 5,
): SquareType => {
  if ((index + 1) % (numOfSquaresPerPlayer + 1) == 0) {
    return SquareType.BIG_SQUARE;
  }
  return SquareType.SMALL_SQUARE;
};

export const getPlayerIndexBySquareIndex = (squareIndex: number) => {
  if (PLAYER_SQUARES[1].includes(squareIndex)) {
    return 1;
  }

  if (PLAYER_SQUARES[2].includes(squareIndex)) {
    return 2;
  }

  return undefined;
};
