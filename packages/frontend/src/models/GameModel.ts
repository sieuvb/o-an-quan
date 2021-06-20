import { IRoomInfo, PLAYER_ID_KEY, ROOM_KEY } from '@o-an-quan/shared';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

export class GameModel {
  roomInfo: IRoomInfo | null = null;
  currPlayerId: string = sessionStorage.getItem(PLAYER_ID_KEY) || '';

  constructor() {
    makeAutoObservable(this);
  }

  initGame = (roomInfo: IRoomInfo) => {
    this.roomInfo = roomInfo;
  };

  genPlayerId = () => {
    const playerId = nanoid();
    this.currPlayerId = playerId;
    sessionStorage.setItem(PLAYER_ID_KEY, playerId);
  };

  get isRoomOwner() {
    return this.currPlayerId === this.roomInfo?.id;
  }

  get gameSharingLink() {
    const baseUrl = process.env.REACT_APP_BASE_URL || 'localhost:3000';
    return `${baseUrl}/join-room?${ROOM_KEY}=${this.currPlayerId}`;
  }

  get currPlayer() {
    const players = this.roomInfo?.gameState?.players || [];
    return players.find(({ id }) => id === this.currPlayerId);
  }

  get rivalPlayer() {
    const players = this.roomInfo?.gameState?.players || [];
    return players.find(({ id }) => id !== this.currPlayerId);
  }
}
