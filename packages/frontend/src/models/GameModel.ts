import {
  IRoomInfo,
  PLAYER_ID_KEY,
  RoomStatus,
  ROOM_KEY,
} from '@o-an-quan/shared';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

const MOCK_GAME_ROOM = {
  id: 'EBRYdpExO2lZhfmLthhuo',
  status: RoomStatus.WAITING_FOR_PLAYERS,
  gameState: {
    players: [],
    currentTurn: 1,
    squares: [
      {
        index: 0,
        playerIndex: 1,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 1,
        playerIndex: 1,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 2,
        playerIndex: 1,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 3,
        playerIndex: 1,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 4,
        playerIndex: 1,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 5,
        type: 'BIG_SQUARE',
        smallStoneNum: 0,
        bigStoneNum: 1,
      },
      {
        index: 6,
        playerIndex: 2,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 7,
        playerIndex: 2,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 8,
        playerIndex: 2,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 9,
        playerIndex: 2,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 10,
        playerIndex: 2,
        type: 'SMALL_SQUARE',
        smallStoneNum: 5,
        bigStoneNum: 0,
      },
      {
        index: 11,
        type: 'BIG_SQUARE',
        smallStoneNum: 0,
        bigStoneNum: 1,
      },
    ],
  },
};

export class GameModel {
  roomInfo: IRoomInfo | null = null;
  currPlayerId: string = sessionStorage.getItem(PLAYER_ID_KEY) || '';

  constructor() {
    makeAutoObservable(this);
  }

  initRoom = (roomInfo: IRoomInfo) => {
    this.roomInfo = roomInfo;
  };

  updateRoom = (roomInfo: IRoomInfo) => {
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

  get currTurnSteps() {
    const currTurn = this.roomInfo?.gameState.currentTurn || -1;
    const currPlayerSteps = this.roomInfo?.gameState.players[currTurn]
      .playerGameInfo.historySteps;
    const lastMoveSteps = last(currPlayerSteps);
    return lastMoveSteps;
  }
}
