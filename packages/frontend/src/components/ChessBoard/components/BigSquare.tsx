import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { BigSquareType, IChessSquare } from '@o-an-quan/shared';
import { DragSquare } from './DragSquare';

const SquareWrapper = styled(DragSquare)<{ gridArea: any }>`
  width: var(--big-square-width);
  height: var(--big-square-height);
  border: var(--square-border);
  grid-area: ${({ gridArea }) => gridArea};

  &.left-square {
    border-top-left-radius: 1000px;
    border-bottom-left-radius: 1000px;
    border-right: 0;
  }

  &.right-square {
    border-top-right-radius: 1000px;
    border-bottom-right-radius: 1000px;
    border-left: 0;
  }
`;

export interface IBigSquareProps {
  square: IChessSquare;
  type: BigSquareType;
}

export const BigSquare: React.FunctionComponent<IBigSquareProps> = ({
  square,
  type,
}) => {
  const { smallStoneNum, bigStoneNum, index } = square;
  const gridArea =
    type === BigSquareType.LEFT ? 'l-big-square' : 'r-big-square';
  return (
    <SquareWrapper
      className={classnames({
        'left-square': type === BigSquareType.LEFT,
        'right-square': type === BigSquareType.RIGHT,
      })}
      gridArea={gridArea}
      square={square}
    />
  );
};
