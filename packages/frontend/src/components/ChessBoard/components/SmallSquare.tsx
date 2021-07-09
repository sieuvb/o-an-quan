import React from 'react';
import styled from 'styled-components';
import { IChessSquare } from '@o-an-quan/shared';
import { DragSquare } from './DragSquare';

const SquareWrapper = styled(DragSquare)`
  width: var(--small-square-size);
  height: var(--small-square-size);
  border-right: var(--square-border);
  border-bottom: var(--square-border);
  background: var(--mirror-gradient-color);
`;

export interface ISmallSquareProps {
  square: IChessSquare;
}

export const SmallSquare: React.FunctionComponent<ISmallSquareProps> = ({
  square,
}) => {
  const { smallStoneNum, index } = square;
  return (
    <SquareWrapper square={square}>
      <div>index: {index}</div>
      <h2>
        <b>{smallStoneNum}</b>
      </h2>
    </SquareWrapper>
  );
};
