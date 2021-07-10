import { autorun, makeAutoObservable, reaction } from 'mobx';
import sortBy from 'lodash/sortBy';
import last from 'lodash/last';
import isEmpty from 'lodash/isEmpty';
import {
  getSquareId,
  IChessSquare,
  ICursorPayload,
  IMoveStep,
  MoveDirection,
  PLAYER_SQUARES,
  RoomStatus,
} from '@o-an-quan/shared';
import { appModel } from 'models';

export class ChessBoardViewModel {
  iCurrPlayerSquares: IChessSquare[] = [];
  iRivalPlayerSquares: IChessSquare[] = [];
  iLeftBigSquare: IChessSquare = null;
  iRightBigSquare: IChessSquare = null;
  iRoomStatus: RoomStatus = null;
  animationCursorPayload: ICursorPayload = null;
  draggingSquareIndex: number = null;

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      console.log(
        'super',
        JSON.parse(
          JSON.stringify({
            game: appModel.gameModel?.roomInfo,
            currSteps: appModel.gameModel?.currTurnSteps,
          }),
        ),
      );
    });

    reaction(
      () => ({
        isBoardEmpty: this.isBoardEmpty,
        roomInfo: appModel.gameModel.roomInfo,
      }),
      ({ isBoardEmpty, roomInfo }) => {
        if (
          roomInfo.status !== RoomStatus.WAITING_FOR_PLAYERS &&
          isBoardEmpty
        ) {
          this.updateBoardStates();
        }
      },
      { fireImmediately: true },
    );

    reaction(
      () => ({
        isPlayingAnimation: appModel.gameModel.isPlayingAnimation,
        currTurnSteps: appModel.gameModel.currTurnSteps,
      }),
      ({ isPlayingAnimation, currTurnSteps }, prevProps) => {
        if (!isEmpty(currTurnSteps)) {
          if (isPlayingAnimation && !prevProps.isPlayingAnimation) {
            this.triggerMoveAnimation();
          } else {
            this.updateBoardStates();
          }
        }
      },
    );
  }

  get isBoardEmpty() {
    return [
      this.iCurrPlayerSquares,
      this.iRivalPlayerSquares,
      this.iLeftBigSquare,
      this.iRightBigSquare,
    ].every(isEmpty);
  }

  get currPlayerSquares() {
    const { currPlayer, roomInfo } = appModel.gameModel;
    if (!roomInfo || !roomInfo.gameState || !currPlayer) {
      return null;
    }
    const {
      gameState: { squares },
    } = roomInfo;
    return sortBy(
      squares.filter(({ index }) =>
        PLAYER_SQUARES[currPlayer.index].includes(index),
      ),
      'index',
    );
  }

  get rivalPlayerSquares() {
    const { rivalPlayer, roomInfo } = appModel.gameModel;
    if (!roomInfo || !roomInfo.gameState || !rivalPlayer) {
      return null;
    }
    const {
      gameState: { squares },
    } = roomInfo;
    return sortBy(
      squares.filter(({ index }) =>
        PLAYER_SQUARES[rivalPlayer.index].includes(index),
      ),
      'index',
    );
  }

  get leftBigSquare() {
    const { roomInfo } = appModel.gameModel;
    if (!roomInfo || !roomInfo.gameState) {
      return null;
    }
    const {
      gameState: { squares },
    } = roomInfo;
    const leftBigSquareIndex = (last(this.rivalPlayerSquares)?.index || 0) + 1;
    return squares.find(({ index }) => index === leftBigSquareIndex);
  }

  get rightBigSquare() {
    const { roomInfo } = appModel.gameModel;
    if (!roomInfo || !roomInfo.gameState) {
      return null;
    }
    const {
      gameState: { squares },
    } = roomInfo;
    const rightBigSquareIndex = (last(this.currPlayerSquares)?.index || 0) + 1;
    return squares.find(({ index }) => index === rightBigSquareIndex);
  }

  updateBoardStates = () => {
    this.iCurrPlayerSquares = this.currPlayerSquares;
    this.iRivalPlayerSquares = this.rivalPlayerSquares;
    this.iLeftBigSquare = this.leftBigSquare;
    this.iRightBigSquare = this.rightBigSquare;
    this.iRoomStatus = appModel.gameModel.roomInfo.status;

    //TODO: Remove later
    if (this.iRoomStatus) {
      alert('Game finished');
    }
  };

  triggerMoveAnimation = async () => {
    const currTurnMove = appModel.gameModel.currTurnSteps;
    const { moveDirection, squareIndex, steps } = currTurnMove;
    console.log(
      'super triggerMoveAnimation',
      JSON.parse(
        JSON.stringify({
          currTurnMove,
          game: appModel.gameModel.roomInfo.gameState,
        }),
      ),
    );
    await this.processStepsAnimation(steps);
    appModel.gameModel.stopAnimation();
  };

  processStepsAnimation = async (steps: IMoveStep[] = []) => {
    for (const step of steps) {
      const {
        action,
        squareIndex,
        smallStoneNum,
        bigStoneNum,
        numOfStonesSelected,
      } = step;
      const squareId = getSquareId(squareIndex);
      const squareElm = document.querySelector(`#${squareId}`);
      this.animationCursorPayload = {
        top: squareElm.getBoundingClientRect().top,
        left: squareElm.getBoundingClientRect().left,
        action,
        smallStoneNum,
        bigStoneNum,
        numOfStonesSelected,
      };
      console.log(
        'super processStepsAnimation',
        JSON.parse(
          JSON.stringify({
            squareId,
            animationCursorPayload: this.animationCursorPayload,
          }),
        ),
      );
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  };

  setDraggingSquareIndex = (squareIndex: number) => {
    this.draggingSquareIndex = squareIndex;
  };
}
