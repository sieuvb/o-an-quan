import React from 'react';
import styled from 'styled-components';
import { IChessSquare } from '@o-an-quan/shared';
import { DragSquare } from './DragSquare';
import { ChessBoardViewModel } from '../ChessBoardViewModel';

const SquareWrapper = styled(DragSquare)`
  width: var(--small-square-size);
  height: var(--small-square-size);
  border-right: var(--square-border);
  border-bottom: var(--square-border);
  background: var(--mirror-gradient-color);
`;

export interface ISmallSquareProps {
  square: IChessSquare;
  chessboardViewModel: ChessBoardViewModel;
}

export const SmallSquare: React.FunctionComponent<ISmallSquareProps> = ({
  square,
  chessboardViewModel,
}) => {
  const { smallStoneNum, index } = square;
  return (
    <SquareWrapper square={square} chessboardViewModel={chessboardViewModel}>
      <div>index: {index}</div>
      <h2>
        <b>{smallStoneNum}</b>
      </h2>
    </SquareWrapper>
  );
};
