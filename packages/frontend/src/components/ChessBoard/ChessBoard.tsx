import React from 'react';
import sortBy from 'lodash/sortBy';
import last from 'lodash/last';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { appModel } from 'models';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BigSquareType, IGameState, PLAYER_SQUARES } from '@o-an-quan/shared';
import { BigSquare, SmallSquare, DragLayer } from './components';
import { layoutStyles } from './layoutStyles';

export const BoardWrapper = styled.div`
  ${layoutStyles};
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
  background: cornsilk;
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

export interface IChessBoardProps {
  gameState: IGameState;
}

export const ChessBoard: React.FC<IChessBoardProps> = observer(
  ({ gameState }) => {
    const { currPlayer, rivalPlayer } = appModel.gameModel;
    if (!currPlayer || !rivalPlayer) {
      return null;
    }
    const { squares = [], currentTurn } = gameState;
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
    const rightBigSquareIndex = (last(currPlayerSquares)?.index || 0) + 1;
    const leftBigSquare = squares.find(
      ({ index }) => index === leftBigSquareIndex,
    );
    const rightBigSquare = squares.find(
      ({ index }) => index === rightBigSquareIndex,
    );
    if (!leftBigSquare || !rightBigSquare) {
      return null;
    }

    return (
      <DndProvider backend={HTML5Backend}>
        {/* <DragLayer /> */}
        <BoardWrapper>
          <BigSquare square={leftBigSquare} type={BigSquareType.LEFT} />
          <SmallSquaresWrapper>
            <SmallSquaresRow isReversed>
              {rivalPlayerSquares.map((square) => (
                <SmallSquare key={square.index} square={square} {...square} />
              ))}
            </SmallSquaresRow>
            <SmallSquaresRow>
              {currPlayerSquares.map((square) => (
                <SmallSquare key={square.index} square={square} {...square} />
              ))}
            </SmallSquaresRow>
          </SmallSquaresWrapper>
          <BigSquare square={rightBigSquare} type={BigSquareType.RIGHT} />
        </BoardWrapper>
      </DndProvider>
    );
  },
);
