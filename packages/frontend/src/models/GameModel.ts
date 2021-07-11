import {
  checkIsAdjacentSquare,
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

export class GameModel {
  roomInfo: IRoomInfo | null = null;
  currPlayerId: string = sessionStorage.getItem(PLAYER_ID_KEY) || '';
  isPlayingAnimation: boolean = false;
  animationCallback: () => void = () => {};

  constructor() {
    makeAutoObservable(this);
  }

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
    const currPlayerSteps = this.roomInfo?.gameState.players[currTurn]
      ?.playerGameInfo?.historySteps;
    const lastMoveSteps = last(currPlayerSteps);
    return lastMoveSteps;
  }

  get isCurrPlayerTurn() {
    return this.currPlayer.index === this.roomInfo.gameState.currentTurn;
  }

  get isAllowInteract() {
    return this.isCurrPlayerTurn && !this.isPlayingAnimation;
  }

  initRoom = (roomInfo: IRoomInfo) => {
    this.roomInfo = roomInfo;
  };

  updateRoom = (roomInfo: IRoomInfo) => {
    this.roomInfo = roomInfo;
    this.playAnimation();
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

  checkIfSquareBelongCurrPlayer = (squareIndex: number) => {
    const currSquare = this.roomInfo.gameState.squares[squareIndex];
    return currSquare?.playerIndex === this.currPlayer.index;
  };

  checkValidStep = (
    selectedSquareIndex: number,
    droppedSquareIndex: number,
  ) => {
    const isAdjacentSquares = checkIsAdjacentSquare(
      selectedSquareIndex,
      droppedSquareIndex,
    );
    const isValidSquares =
      this.checkIfSquareBelongCurrPlayer(selectedSquareIndex) &&
      isAdjacentSquares;
    const canMoveStep =
      this.isAllowInteract &&
      isValidSquares &&
      selectedSquareIndex !== droppedSquareIndex;

    return canMoveStep;
  };

  moveStep = (selectedSquareIndex: number, droppedSquareIndex: number) => {
    // const res = this.checkValidStep(selectedSquareIndex, droppedSquareIndex);
    // if (!res) return;
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
  };

  rematch = () => {
    appModel.socketModel.rematch(this.currPlayerId);
  };
}
