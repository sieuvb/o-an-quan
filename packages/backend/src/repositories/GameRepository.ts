//TODO: Replace it by Redis
import { IGameState, IRoomInfo } from '@o-an-quan/shared';

export class GameRepository {
  private roomsData: Record<string, IRoomInfo> = {};

  getRoomInfo = (roomId: string) => this.roomsData[roomId];

  createRoom = (roomInfo: IRoomInfo) => {
    const roomId = roomInfo.id;
    if (this.roomsData[roomId]) {
      throw `Room ${roomId} is existed!`;
    }
    this.roomsData[roomId] = roomInfo;
  };

  updateRoom = (roomInfo: IRoomInfo) => {
    const roomId = roomInfo.id;
    if (!this.roomsData[roomId]) {
      throw 'Invalid room id!';
    }
    this.roomsData[roomId] = roomInfo;
  };

  updateGameState = (roomId: string, gameState: IGameState) => {
    const roomInfo = this.roomsData[roomId];
    if (!roomInfo) {
      throw 'Invalid room id!';
    }
    roomInfo.gameState = gameState;
  };
}

export const gameRepository = new GameRepository();
