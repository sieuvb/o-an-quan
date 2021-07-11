import React from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import classnames from 'classnames';
import { DragPreviewImage, useDrag, useDragLayer, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { appModel } from 'models';
import { getSquareId, IChessSquare, SquareType } from '@o-an-quan/shared';
import smallStonesImg from 'assests/images/small-stones.png';
import { SQUARE_TYPE } from '../constants';
import { StonesRender } from '../../StonesRender';
import { ChessBoardViewModel } from '../ChessBoardViewModel';
import { observer } from 'mobx-react-lite';

interface IDragSquareProps {
  className?: string;
  square: IChessSquare;
  chessboardViewModel: ChessBoardViewModel;
}

const DragDropWrapper = styled.div`
  opacity: 1;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: transparent;
  cursor: pointer;

  > .drop-space {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  &.dragging {
    opacity: 0.5;
  }

  &.valid {
    background: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.5),
      #32cd32
    );
    opacity: 1;
  }

  &.over {
    z-index: 2;
    opacity: 0.5;
    &.valid {
      background: linear-gradient(
        to right bottom,
        rgba(255, 255, 255, 0.5),
        #00f9ff
      );
      opacity: 1;
    }
  }
`;

const SquareContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  .left {
    position: absolute;
    top: 4px;
    left: 4px;
  }

  .right {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 20px;
    font-weight: 500;
  }

  .stone-wrapper {
    position: relative;

    > img {
      display: inline-block;
      width: 130px;
      height: 86px;
    }
    .stone-info {
      position: absolute;
      top: 0;
      right: 4px;
      font-size: 20px;
      font-weight: 500;
      line-height: 24px;
    }
  }
`;

export const DragSquare: React.FC<IDragSquareProps> = observer(
  ({ className, square, chessboardViewModel }) => {
    const { isAllowInteract, currPlayer, checkValidStep } = appModel.gameModel;
    const { setDraggingSquareIndex } = chessboardViewModel;
    const canDragChecker = React.useCallback(
      throttle(() => {
        return isAllowInteract && square.playerIndex === currPlayer.index;
      }, 300),
      [isAllowInteract],
    );
    const canDropChecker = React.useCallback(
      throttle(
        (draggingItem: IChessSquare) =>
          checkValidStep(draggingItem.index, square.index),
        300,
      ),
      [],
    );
    const [{ isDragging }, dragRef, preview] = useDrag<any, any, any>({
      type: SQUARE_TYPE,
      item: square,
      canDrag: canDragChecker,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
    const [{ canDrop, isOver }, dropRef] = useDrop<any, any, any>(() => ({
      accept: SQUARE_TYPE,
      canDrop: canDropChecker,
      drop: (draggingItem: IChessSquare) => {
        appModel.gameModel.moveStep(draggingItem.index, square.index);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }));

    React.useEffect(() => {
      if (isDragging) {
        setDraggingSquareIndex(square.index);
      }
    }, [isDragging, square.index, setDraggingSquareIndex]);

    const { bigStoneNum, smallStoneNum, index } = square;
    return (
      <DragDropWrapper
        id={getSquareId(index)}
        ref={dragRef}
        className={classnames(
          {
            dragging: isDragging,
            valid: canDrop,
            over: isOver,
          },
          className,
        )}
      >
        <DragPreviewImage connect={preview} src={smallStonesImg} />
        <div className="drop-space" ref={dropRef}>
          <SquareContent>
            <div className="left">{index}</div>
            <StonesRender
              bigStonesNum={bigStoneNum}
              smallStonesNum={smallStoneNum}
            />
          </SquareContent>
        </div>
      </DragDropWrapper>
    );
  },
);
