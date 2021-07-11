//TODO: Replace it by Redis
import {
  IGameState,
  IGameStep,
  IPlayer,
  IRoomInfo,
  RoomStatus,
} from '@o-an-quan/shared';

export class GameRepository {
  private roomsData: Record<string, IRoomInfo> = {};
  private playerRoomMapper: Record<string, string> = {};
  getRoomInfo = (roomId: string) => {
    return this.roomsData[roomId];
  };

  createRoom = (roomInfo: IRoomInfo) => {
    const roomId = roomInfo.id;
    if (this.roomsData[roomId]) {
      throw `Room ${roomId} is existed!`;
    }
    this.roomsData[roomId] = roomInfo;
    return roomInfo;
  };

  updateRoom = (roomInfo: IRoomInfo) => {
    const roomId = roomInfo.id;
    if (!this.roomsData[roomId]) {
      throw new Error('Invalid room id!');
    }
    this.roomsData[roomId] = roomInfo;
    return roomInfo;
  };

  updateRoomStatus = (roomId: string, status: RoomStatus) => {
    const roomInfo = this.roomsData[roomId];
    if (!roomInfo) {
      throw 'Invalid room id!';
    }
    roomInfo.status = status;
    this.roomsData[roomId] = roomInfo;
    return roomInfo;
  };

  addRoomPlayers = (roomId: string, newPlayerInfo: IPlayer) => {
    const roomInfo = this.roomsData[roomId];
    if (!roomInfo) {
      throw 'Invalid room id!';
    }

    const roomPlayers = roomInfo.gameState?.players;
    const isPlayerExisted = roomPlayers?.some(
      ({ id }) => id === newPlayerInfo.id,
    );
    if (isPlayerExisted) {
      throw "Duplicated player's id";
    }

    roomInfo.gameState.players = [...roomPlayers, newPlayerInfo];
    this.roomsData[roomId] = roomInfo;
    return roomInfo;
  };

  getRoomIdByPlayerId = (playerId: string) => {
    return this.playerRoomMapper[playerId] || playerId;
  };

  mapPlayerToRoom = (playerId: string, roomId: string) => {
    this.playerRoomMapper[playerId] = roomId;
  };

  inputPlayerStep = (roomId: string, gameStep: IGameStep) => {
    const roomInfo = this.roomsData[roomId];
    const currentTurn = roomInfo.gameState?.currentTurn;
    const players = roomInfo.gameState?.players;
    const currentPlayer = players[currentTurn];

    currentPlayer.playerGameInfo.historySteps.push(gameStep);

    return roomInfo;
  };

  putStoneOnPlayer = (
    roomId: string,
    numOfBigStones: number,
    numOfSmallStones: number,
  ) => {
    const roomInfo = this.roomsData[roomId];
    const currentTurn = roomInfo.gameState?.currentTurn;
    const players = roomInfo.gameState?.players;
    roomInfo.gameState.players[
      currentTurn
    ].playerGameInfo.bigStoneNum = numOfBigStones;
    roomInfo.gameState.players[
      currentTurn
    ].playerGameInfo.smallStoneNum = numOfSmallStones;
    return roomInfo;
  };

  takeSmallStoneFromPlayer = (
    roomId: string,
    numOfSmallStonesTaken: number,
  ) => {
    const roomInfo = this.roomsData[roomId];
    const currentTurn = roomInfo.gameState?.currentTurn;
    const players = roomInfo.gameState?.players;
    let smallStoneNum =
      roomInfo.gameState.players[currentTurn].playerGameInfo.smallStoneNum;
    smallStoneNum = smallStoneNum - numOfSmallStonesTaken;
    return roomInfo;
  };

  switchTurn = (roomId: string) => {
    const roomInfo = this.roomsData[roomId];
    const currentTurn = roomInfo.gameState?.currentTurn;

    if (currentTurn === 0) {
      roomInfo.gameState.currentTurn = 1;
    } else {
      roomInfo.gameState.currentTurn = 0;
    }
    return roomInfo;
  };
}

export const gameRepository = new GameRepository();
