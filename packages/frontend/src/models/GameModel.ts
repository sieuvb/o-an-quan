import {
  getSquareId,
  IRoomInfo,
  MoveDirection,
  PLAYER_ID_KEY,
  RoomStatus,
  ROOM_KEY,
} from '@o-an-quan/shared';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';
import { appModel } from './AppModel';

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
  isPlayingAnimation: boolean = false;
  animationCallback: () => void = () => {};

  constructor() {
    makeAutoObservable(this);
  }

  initRoom = (roomInfo: IRoomInfo) => {
    this.roomInfo = roomInfo;
  };

  updateRoom = (roomInfo: IRoomInfo) => {
    this.playAnimation();
    setTimeout(() => {
      this.roomInfo = roomInfo;
    }, 1000);
  };

  playAnimation = () => {
    this.isPlayingAnimation = true;
  };

  stopAnimation = () => {
    this.isPlayingAnimation = false;
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
    const currTurn = this.roomInfo?.gameState?.currentTurn;
    console.log(
      'super',
      JSON.parse(JSON.stringify({ currTurn, room: this.roomInfo })),
    );
    const currPlayerSteps = this.roomInfo?.gameState.players[currTurn]
      ?.playerGameInfo?.historySteps;
    const lastMoveSteps = last(currPlayerSteps);
    return lastMoveSteps;
  }

  moveStep = (selectedSquareIndex: number, droppedSquareIndex: number) => {
    const selectedSquareId = getSquareId(selectedSquareIndex);
    const selectedSquareElm = document.getElementById(selectedSquareId);

    const droppedSquareId = getSquareId(droppedSquareIndex);
    const droppedSquareElm = document.getElementById(droppedSquareId);

    if (!selectedSquareElm || !droppedSquareElm) {
      throw new Error('Square not found!');
    }

    const moveDirection =
      selectedSquareElm?.offsetLeft < droppedSquareElm?.offsetLeft
        ? MoveDirection.CCW
        : MoveDirection.CW;

    const roomId = appModel.gameModel.roomInfo?.id;

    if (!roomId) {
      throw new Error('Room Id not found');
    }
    appModel.socketModel.inputStep({
      roomId,
      squareIndex: selectedSquareIndex,
      moveDirection,
    });
    console.log('super input', {
      selectedSquareIndex,
      droppedSquareIndex,
      moveDirection,
    });
  };
}
