//TODO: Replace it by Redis
import { IGameState, IPlayer, IRoomInfo, RoomStatus } from '@o-an-quan/shared';

export class GameRepository {
  private roomsData: Record<string, IRoomInfo> = {};
  private playerRoomMapper: Record<string, string> = {};
  getRoomInfo = (roomId: string) => {
    console.log({
      playerRoomMapper: this.playerRoomMapper,
      roomData: this.roomsData,
    });
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
      throw 'Invalid room id!';
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
}

export const gameRepository = new GameRepository();
