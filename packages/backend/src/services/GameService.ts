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
  checkSquareIndexType
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

const initSquares = (numOfPlayers: number = 2): IChessSquare[] => {
  let squares = []

  for (var index = 0; index < numOfPlayers * 5; index++) {
    let type = checkSquareIndexType(index);
    squares.push({
      index,
      type,
      smallStoneNum: type == SquareType.BIG_SQUARE ? 0 : 5,
      bigStoneNum: type == SquareType.BIG_SQUARE ? 1 : 0,
    });
  }
  return squares;
}
  // ['left', 'right'].map((index) => {
  //   const squareInfo: Omit<IChessSquare, 'id'> = {
  //     type: SquareType.BIG_SQUARE,
  //     index: index as SquareIndex,
  //     bigStoneNum: 0,
  //     smallStoneNum: INITIAL_SMALL_SQUARE_STONES,
  //   };
  //   return { id: genSquareId(squareInfo), ...squareInfo };
  // });

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
      squares: initSquares(),
    };

    return initialGameState;
  };

  createRoom = (playerid: string, playerInfo: Omit<IPlayer, 'id'>) => {
    const firstPlayer: IPlayer = {
      id: playerid,
      ...playerInfo,
    };
    const room: IRoomInfo = {
      id: playerid,
      status: RoomStatus.WAITING_FOR_PLAYERS,
      gameState: this.initGame(firstPlayer),
    };
    return gameRepository.createRoom(room);
  };

  getRoomInfo = (playerId: string) => {
    const roomId = gameRepository.getRoomIdByPlayerId(playerId);
    const roomInfo = gameRepository.getRoomInfo(roomId);
    return roomInfo;
  };

  joinRoom = (
    playerid: string,
    roomId: string,
    playerInfo: Omit<IPlayer, 'id'>,
  ) => {
    const roomInfo = gameRepository.getRoomInfo(roomId);
    if (!roomInfo) {
      throw 'Invalid room id';
    }

    if (roomInfo.status !== RoomStatus.WAITING_FOR_PLAYERS) {
      throw 'Invalid room status';
    }

    const newPlayerInfo = { id: playerid, ...playerInfo };
    let newRoomInfo = gameRepository.addRoomPlayers(roomId, newPlayerInfo);
    if (newRoomInfo.gameState.players.length > 2) {
      newRoomInfo = gameRepository.updateRoomStatus(roomId, RoomStatus.PLAYING);
    }
    gameRepository.mapPlayerToRoom(playerid, roomInfo.id);

    return newRoomInfo;
  };
}

export const gameService = new GameService();
