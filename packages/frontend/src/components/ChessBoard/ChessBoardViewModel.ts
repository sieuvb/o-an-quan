import { autorun, makeAutoObservable, reaction } from 'mobx';
import { getSquareId, MoveDirection } from '@o-an-quan/shared';
import { appModel } from 'models';

export class ChessBoardViewModel {
  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      console.log(
        'super',
        JSON.parse(
          JSON.stringify({
            game: appModel.gameModel.roomInfo,
            currSteps: appModel.gameModel.currTurnSteps,
          }),
        ),
      );
    });
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
  };
}

export const chessboardViewModel = new ChessBoardViewModel();
