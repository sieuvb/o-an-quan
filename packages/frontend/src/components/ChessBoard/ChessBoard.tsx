import React from 'react';
import sortBy from 'lodash/sortBy';
import last from 'lodash/last';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { appModel } from 'models';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  BigSquareType,
  IChessSquare,
  IGameState,
  PLAYER_SQUARES,
  RoomStatus,
} from '@o-an-quan/shared';
import { BigSquare, SmallSquare, ChessBoardCursor } from './components';
import { layoutStyles } from './layoutStyles';
import { ChessBoardViewModel } from './ChessBoardViewModel';
import { useViewModel } from 'utils';

export const BoardWrapper = styled.div`
  ${layoutStyles};
  position: relative;
  display: grid;
  grid-template-areas:
    'l-big-square small-squares r-big-square'
    'l-big-square small-squares r-big-square';
  grid-template-columns: var(--big-square-width) minmax(0, 1fr) var(
      --big-square-width
    );
  align-items: center;
  text-align: center;
  width: var(--chess-board-width);
  height: var(--chess-board-height);
  background: var(--chess-board-bg);
`;

const SmallSquaresWrapper = styled.div`
  grid-area: small-squares;
  border-top: var(--square-border);
  border-left: var(--square-border);
  height: 100%;
`;

const SmallSquaresRow = styled.div<{
  isReversed?: boolean;
}>`
  width: var(--small-square-wrapper-width);
  display: flex;
  flex-direction: ${({ isReversed }) => (isReversed ? 'row-reverse' : 'row')};
`;

export interface IChessBoardProps {}

export const ChessBoard: React.FC<IChessBoardProps> = observer(() => {
  const chessboardViewModel = useViewModel(ChessBoardViewModel);
  const {
    iCurrPlayerSquares,
    iRivalPlayerSquares,
    iLeftBigSquare,
    iRightBigSquare,
  } = chessboardViewModel;

  if (
    !iLeftBigSquare ||
    !iRightBigSquare ||
    !iCurrPlayerSquares ||
    !iRivalPlayerSquares
  ) {
    return null;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardWrapper>
        <ChessBoardCursor chessboardViewModel={chessboardViewModel} />
        <BigSquare
          chessboardViewModel={chessboardViewModel}
          square={iLeftBigSquare}
          type={BigSquareType.LEFT}
        />
        <SmallSquaresWrapper>
          <SmallSquaresRow isReversed>
            {iRivalPlayerSquares.map((square) => (
              <SmallSquare
                key={square.index}
                square={square}
                chessboardViewModel={chessboardViewModel}
                {...square}
              />
            ))}
          </SmallSquaresRow>
          <SmallSquaresRow>
            {iCurrPlayerSquares.map((square) => (
              <SmallSquare
                key={square.index}
                square={square}
                chessboardViewModel={chessboardViewModel}
                {...square}
              />
            ))}
          </SmallSquaresRow>
        </SmallSquaresWrapper>
        <BigSquare
          chessboardViewModel={chessboardViewModel}
          square={iRightBigSquare}
          type={BigSquareType.RIGHT}
        />
      </BoardWrapper>
    </DndProvider>
  );
});
