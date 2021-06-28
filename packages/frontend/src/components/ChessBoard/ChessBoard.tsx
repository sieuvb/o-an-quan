import React from 'react';
import sortBy from 'lodash/sortBy';
import last from 'lodash/last';
import styled from 'styled-components';
import { BIG_SQUARE_INDEX, IGameState, SquareType } from '@o-an-quan/shared';
import { BigSquare, SmallSquare } from './components';
import { layoutStyles } from './layoutStyles';
import { observer } from 'mobx-react-lite';
import { appModel } from 'models';

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
  border-top: 2px solid black;
  border-left: 2px solid black;
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
    // const { currPlayer } = appModel.gameModel;
    const currPlayer = { index: 1 };
    const { squares = [], currentTurn } = gameState;
    const currPlayerSquares = sortBy(
      squares.filter(
        ({ playerIndex, type }) =>
          currPlayer?.index === playerIndex && type === SquareType.SMALL_SQUARE,
      ),
      'index',
    );
    const rivalPlayerSquares = sortBy(
      squares.filter(
        ({ playerIndex, type }) =>
          currPlayer?.index !== playerIndex && type === SquareType.SMALL_SQUARE,
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
      <BoardWrapper>
        <BigSquare square={leftBigSquare} gridArea="l-big-square" />
        <SmallSquaresWrapper>
          <SmallSquaresRow isReversed>
            {rivalPlayerSquares.map((square) => (
              <SmallSquare key={square.index} square={square} {...square} />
            ))}
          </SmallSquaresRow>
          <SmallSquaresRow isReversed>
            {currPlayerSquares.map((square) => (
              <SmallSquare key={square.index} square={square} {...square} />
            ))}
          </SmallSquaresRow>
        </SmallSquaresWrapper>
        <BigSquare square={rightBigSquare} gridArea="r-big-square" />
      </BoardWrapper>
    );
  },
);
