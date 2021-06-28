import React from 'react';
import styled from 'styled-components';
import { IChessSquare } from '@o-an-quan/shared';

const SquareWrapper = styled.div<{ gridArea: any }>`
  width: var(--big-square-width);
  height: var(--big-square-height);
  border: 2px solid black;
  grid-area: ${({ gridArea }) => gridArea};

  &:first-child {
    border-top-left-radius: 1000px;
    border-bottom-left-radius: 1000px;
    border-right: 0;
  }

  &:last-child {
    border-top-right-radius: 1000px;
    border-bottom-right-radius: 1000px;
    border-left: 0;
  }
`;

export interface IBigSquareProps {
  square: IChessSquare;
  gridArea: any;
}

export const BigSquare: React.FunctionComponent<IBigSquareProps> = ({
  square,
  gridArea,
}) => {
  const { smallStoneNum, bigStoneNum, index } = square;
  return (
    <SquareWrapper gridArea={gridArea}>
      <div>index: {index} </div>
      <div>
        small: {smallStoneNum} / big: {bigStoneNum}
      </div>
    </SquareWrapper>
  );
};
