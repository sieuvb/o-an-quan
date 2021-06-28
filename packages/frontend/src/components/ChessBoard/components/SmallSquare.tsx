import React from 'react';
import styled from 'styled-components';
import { IChessSquare } from '@o-an-quan/shared';
import { gridItemStyles } from './styles';

const SquareWrapper = styled.div`
  margin: auto;
  width: var(--small-square-size);
  height: var(--small-square-size);
  border-right: 2px solid black;
  border-bottom: 2px solid black;
  /* & + & {
    border-top: none;
    border-right: none;
  } */
`;

export interface ISmallSquareProps {
  square: IChessSquare;
}

export const SmallSquare: React.FunctionComponent<ISmallSquareProps> = ({
  square,
}) => {
  const { smallStoneNum, index } = square;
  return (
    <SquareWrapper>
      index: {index} / {smallStoneNum}
    </SquareWrapper>
  );
};
