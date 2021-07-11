import {
  BIG_SQUARE_INDEX,
  PLAYER_SQUARES,
  TOTAL_SQUARES_NUM,
} from '../constants';
import { SquareType } from '../enums';
import { IChessSquare } from '../interfaces';

export const getSquareId = (squareIndex: number) => `square_${squareIndex}`;

// checkSquareIndexType Check index of a square and return the square type
export const checkSquareIndexType = (
  index: number,
  numOfSquaresPerPlayer: number = 5,
): SquareType => {
  if ([5, 11].includes(index)) {
    return SquareType.BIG_SQUARE;
  }
  return SquareType.SMALL_SQUARE;
};

export const getPlayerIndexBySquareIndex = (squareIndex: number) => {
  if (PLAYER_SQUARES[0].includes(squareIndex)) {
    return 0;
  }

  if (PLAYER_SQUARES[1].includes(squareIndex)) {
    return 1;
  }

  return undefined;
};

export const checkIsAdjacentSquare = (squareIndexA, squareIndexB) => {
  if (squareIndexA === squareIndexB) {
    return false;
  }

  const comparedSquares = [squareIndexA, squareIndexB];

  if (comparedSquares.includes(BIG_SQUARE_INDEX.LEFT)) {
    const adjacentBigSquare1Index =
      (BIG_SQUARE_INDEX.LEFT - 1) % TOTAL_SQUARES_NUM;
    const adjacentBigSquare2Index =
      (BIG_SQUARE_INDEX.LEFT + 1) % TOTAL_SQUARES_NUM;
    return (
      comparedSquares.includes(adjacentBigSquare1Index) ||
      comparedSquares.includes(adjacentBigSquare2Index)
    );
  }

  if (comparedSquares.includes(BIG_SQUARE_INDEX.RIGHT)) {
    const adjacentBigSquare1Index =
      (BIG_SQUARE_INDEX.RIGHT - 1) % TOTAL_SQUARES_NUM;
    const adjacentBigSquare2Index =
      (BIG_SQUARE_INDEX.RIGHT + 1) % TOTAL_SQUARES_NUM;
    return (
      comparedSquares.includes(adjacentBigSquare1Index) ||
      comparedSquares.includes(adjacentBigSquare2Index)
    );
  }

  return Math.abs(squareIndexA - squareIndexB) === 1;
};
