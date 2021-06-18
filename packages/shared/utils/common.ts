import { IChessSquare } from '../interfaces';

export const genSquareId = (
  square: Omit<IChessSquare, 'id'>,
  playerIndex: number = 0,
) => `${playerIndex}_${square.type}_${square.index}`;
