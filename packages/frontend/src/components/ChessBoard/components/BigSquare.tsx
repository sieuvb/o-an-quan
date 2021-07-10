import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { BigSquareType, IChessSquare } from '@o-an-quan/shared';
import { DragSquare } from './DragSquare';
import { ChessBoardViewModel } from '../ChessBoardViewModel';

const SquareWrapper = styled(DragSquare)<{ gridArea: any }>`
  width: var(--big-square-width);
  height: var(--big-square-height);
  border: var(--square-border);
  grid-area: ${({ gridArea }) => gridArea};
  background: var(--mirror-gradient-color);

  &.left-square {
    border-top-left-radius: var(--big-square-radius);
    border-bottom-left-radius: var(--big-square-radius);
    border-right: 0;
  }

  &.right-square {
    border-top-right-radius: var(--big-square-radius);
    border-bottom-right-radius: var(--big-square-radius);
    border-left: 0;
  }
`;

export interface IBigSquareProps {
  square: IChessSquare;
  type: BigSquareType;
  chessboardViewModel: ChessBoardViewModel;
}

export const BigSquare: React.FunctionComponent<IBigSquareProps> = ({
  square,
  type,
  chessboardViewModel,
}) => {
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
      chessboardViewModel={chessboardViewModel}
    />
  );
};
