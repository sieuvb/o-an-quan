import { autorun, makeAutoObservable, reaction } from 'mobx';
import sortBy from 'lodash/sortBy';
import last from 'lodash/last';
import isEmpty from 'lodash/isEmpty';
import {
  getSquareId,
  IChessSquare,
  ICursorPayload,
  IMoveStep,
  PLAYER_SQUARES,
  RoomStatus,
} from '@o-an-quan/shared';
import { appModel } from 'models';

export class ChessBoardViewModel {
  currViewSquares: IChessSquare[] = null;
  roomStatus: RoomStatus = null;
  animationCursorPayload: ICursorPayload = null;
  draggingSquareIndex: number = null;
  endGameModalVisible: boolean;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => ({
        isBoardEmpty: this.isBoardEmpty,
        roomInfo: appModel.gameModel.roomInfo,
      }),
      ({ isBoardEmpty, roomInfo }, prevProps) => {
        const isFirstInitial =
          roomInfo?.status !== RoomStatus.WAITING_FOR_PLAYERS && isBoardEmpty;
        const isRematch =
          roomInfo?.status === RoomStatus.PLAYING &&
          prevProps?.roomInfo?.status === RoomStatus.FINISHED;
        if (isFirstInitial || isRematch) {
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

    autorun(() => {
      if (this.roomStatus === RoomStatus.FINISHED) {
        this.showEndGame();
      } else {
        this.hideEndGame();
      }
    });
  }

  get isBoardEmpty() {
    return !this.currViewSquares;
  }

  get normalizedMainSquares() {
    return this.processSquares(appModel.gameModel.roomInfo?.gameState?.squares);
  }

  get normalizedViewSquares() {
    return this.processSquares(this.currViewSquares);
  }

  processSquares = (squares: IChessSquare[]) => {
    const { currPlayer, rivalPlayer } = appModel.gameModel;
    if (!squares || !currPlayer || !rivalPlayer) {
      return null;
    }
    const currPlayerSquares = sortBy(
      squares.filter(({ index }) =>
        PLAYER_SQUARES[currPlayer.index].includes(index),
      ),
      'index',
    );
    const rivalPlayerSquares = sortBy(
      squares.filter(({ index }) =>
        PLAYER_SQUARES[rivalPlayer.index].includes(index),
      ),
      'index',
    );
    const leftBigSquareIndex = (last(rivalPlayerSquares)?.index || 0) + 1;
    const leftBigSquare = squares.find(
      ({ index }) => index === leftBigSquareIndex,
    );
    const rightBigSquareIndex = (last(currPlayerSquares)?.index || 0) + 1;
    const rightBigSquare = squares.find(
      ({ index }) => index === rightBigSquareIndex,
    );

    return {
      currPlayerSquares,
      rivalPlayerSquares,
      leftBigSquare,
      rightBigSquare,
    };
  };

  updateBoardStates = () => {
    const { gameState, status } = appModel.gameModel.roomInfo;
    this.currViewSquares = gameState?.squares;
    this.roomStatus = status;
  };

  setSingleSquareValue = (squareIndex: number, smallStoneNum, bigStoneNum) => {
    this.currViewSquares[squareIndex] = {
      ...this.currViewSquares[squareIndex],
      smallStoneNum,
      bigStoneNum,
    };
  };

  triggerMoveAnimation = async () => {
    const currTurnMove = appModel.gameModel.currTurnSteps;
    const { steps } = currTurnMove;
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
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.setSingleSquareValue(squareIndex, smallStoneNum, bigStoneNum);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  };

  showEndGame = () => {
    this.endGameModalVisible = true;
  };

  hideEndGame = () => {
    this.endGameModalVisible = false;
  };

  setDraggingSquareIndex = (squareIndex: number) => {
    this.draggingSquareIndex = squareIndex;
  };
}
