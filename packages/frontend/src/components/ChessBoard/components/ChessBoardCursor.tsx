import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { appModel } from 'models';
import { observer } from 'mobx-react-lite';
import { ChessBoardViewModel } from '../ChessBoardViewModel';

interface IChessBoardCursorProps {
  chessboardViewModel: ChessBoardViewModel;
}

const CursorWrapper = styled.div<{ top?: number; left?: number }>`
  position: fixed;
  top: 0;
  left: 0;
  visibility: hidden;
  z-index: 2;
  transition: 0.5s all;

  &.active {
    visibility: visible;
    top: ${({ top = 0 }) => `${top}px`};
    left: ${({ left = 0 }) => `${left}px`};
  }
`;
export const ChessBoardCursor: React.FC<IChessBoardCursorProps> = observer(
  ({ chessboardViewModel }) => {
    const { isPlayingAnimation } = appModel.gameModel;
    const { animationCursorPayload } = chessboardViewModel;

    if (!animationCursorPayload) {
      return null;
    }

    const { top, left, numOfStonesSelected, action } = animationCursorPayload;
    return (
      <CursorWrapper
        className={classnames({ active: isPlayingAnimation })}
        top={top}
        left={left}
      >
        <h4>
          {action} | {numOfStonesSelected}
        </h4>
      </CursorWrapper>
    );
  },
);
