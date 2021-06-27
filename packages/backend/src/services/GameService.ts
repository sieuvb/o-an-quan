import { nanoid } from 'nanoid';
import {
  genSquareId,
  IChessSquare,
  IGameState,
  INITIAL_SMALL_SQUARE_STONES,
  INITIAL_BIG_SQUARE_STONES,
  IPlayer,
  IRoomInfo,
  RoomStatus,
  SquareIndex,
  SquareType,
  checkSquareIndexType,
  MoveDirection,
} from '@o-an-quan/shared';
import { gameRepository } from '../repositories';

const initSquares = (
  numOfPlayers: number = 2,
  numOfSquaresPerPlayer: number = 5,
): IChessSquare[] => {
  let squares = [];

  for (
    var index = 0;
    index < numOfPlayers * (numOfSquaresPerPlayer + 1);
    index++
  ) {
    let type = checkSquareIndexType(index, numOfSquaresPerPlayer);
    squares.push({
      index,
      type,
      smallStoneNum:
        type == SquareType.BIG_SQUARE ? 0 : INITIAL_SMALL_SQUARE_STONES,
      bigStoneNum:
        type == SquareType.BIG_SQUARE ? INITIAL_BIG_SQUARE_STONES : 0,
    });
  }
  return squares;
};

export class GameService {
  initGame = (firstPlayer: IPlayer) => {
    const firstPlayerInfo: IPlayer = {
      ...firstPlayer,
      playerGameInfo: {
        bigStoneNum: 0,
        smallStoneNum: 0,
        historySteps: [],
      },
    };

    const initialGameState: IGameState = {
      players: [firstPlayerInfo],
      currentTurn: 0,
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

    const newPlayerInfo = {
      id: playerid,
      ...playerInfo,
      playerGameInfo: {
        bigStoneNum: 0,
        smallStoneNum: 0,
        historySteps: [],
      },
    };
    let newRoomInfo = gameRepository.addRoomPlayers(roomId, newPlayerInfo);
    if (newRoomInfo.gameState.players.length > 2) {
      newRoomInfo = gameRepository.updateRoomStatus(roomId, RoomStatus.PLAYING);
    }
    gameRepository.mapPlayerToRoom(playerid, roomInfo.id);

    return newRoomInfo;
  };

  inputMove = (
    roomId: string,
    squareIndex: number,
    moveDirection: MoveDirection,
  ) => {
    return gameRepository.inputMoveByPlayer(
      roomId,
      {
        squareIndex,
        moveDirection
      }
    )
  };
}

export const gameService = new GameService();
