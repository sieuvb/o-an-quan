import { autorun, makeAutoObservable, reaction } from 'mobx';
import sortBy from 'lodash/sortBy';
import last from 'lodash/last';
import {
  getSquareId,
  IChessSquare,
  MoveDirection,
  PLAYER_SQUARES,
} from '@o-an-quan/shared';
import { appModel } from 'models';

export class ChessBoardViewModel {
  iCurrPlayerSquares: IChessSquare[] = [];
  iRivalPlayerSquares: IChessSquare[] = [];
  iLeftBigSquare: IChessSquare = null;
  iRightBigSquare: IChessSquare = null;
  animationCursorPosition = {
    top: 0,
    left: 0,
  };

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
        isPlayingAnimation: appModel.gameModel.isPlayingAnimation,
        roomInfo: appModel.gameModel.roomInfo,
      }),
      ({ isPlayingAnimation, roomInfo }, prevProps) => {
        if (roomInfo && roomInfo.gameState) {
          if (isPlayingAnimation) {
            if (prevProps?.isPlayingAnimation !== isPlayingAnimation) {
              this.triggerMoveAnimation();
            }
          } else {
            this.updateBoardStates();
          }
        }
      },
      { fireImmediately: true },
    );
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
  };

  triggerMoveAnimation = () => {
    const currTurnMove = appModel.gameModel.currTurnSteps;
    const { moveDirection, squareIndex, steps } = currTurnMove;
    this.processStepsAnimation(steps);
  };

  processStepsAnimation = (steps: any[] = []) => {
    steps.forEach(({ action, squareIndex, smallStoneNum, bigStoneNum }) => {
      setTimeout(() => {
        const squareId = getSquareId(squareIndex);
        const squareElm = document.querySelector(`#${squareId}`);
        this.animationCursorPosition = {
          top: squareElm.getBoundingClientRect().top,
          left: squareElm.getBoundingClientRect().left,
        };
      }, 1000);
    });
  };
}
