import { nanoid } from 'nanoid';
import {
  genSquareId,
  IChessSquare,
  IGameState,
  INITIAL_SMALL_SQUARE_STONES,
  IPlayer,
  IRoomInfo,
  RoomStatus,
  SquareIndex,
  SquareType,
} from '@o-an-quan/shared';
import { gameRepository } from '../repositories';

const initSmallSquares = (playerIndex: number): IChessSquare[] =>
  [1, 2, 3, 4, 5].map((index) => {
    const squareInfo: Omit<IChessSquare, 'id'> = {
      type: SquareType.SMALL_SQUARE,
      index,
      bigStoneNum: 0,
      smallStoneNum: INITIAL_SMALL_SQUARE_STONES,
    };
    return { id: genSquareId(squareInfo, playerIndex), ...squareInfo };
  });

const initBigSquares = (): IChessSquare[] =>
  ['left', 'right'].map((index) => {
    const squareInfo: Omit<IChessSquare, 'id'> = {
      type: SquareType.BIG_SQUARE,
      index: index as SquareIndex,
      bigStoneNum: 0,
      smallStoneNum: INITIAL_SMALL_SQUARE_STONES,
    };
    return { id: genSquareId(squareInfo), ...squareInfo };
  });

export class GameService {
  initGame = (firstPlayer: IPlayer) => {
    const firstPlayerInfo: IPlayer = {
      ...firstPlayer,
      playerGameInfo: {
        bigStoneNum: 0,
        smallStoneNum: 0,
        historySteps: [],
        smallSquares: initSmallSquares(1),
      },
    };
    const initialGameState: IGameState = {
      players: [firstPlayerInfo],
      bigSquares: initBigSquares(),
    };

    return initialGameState;
  };

  createRoom = (socketId: string, playerInfo: Omit<IPlayer, 'id'>) => {
    const firstPlayer: IPlayer = {
      id: socketId,
      ...playerInfo,
    };
    const room: IRoomInfo = {
      id: socketId,
      status: RoomStatus.WAITING_FOR_PLAYERS,
      gameState: this.initGame(firstPlayer),
    };

    return gameRepository.createRoom(room);
  };
}

export const gameService = new GameService();
