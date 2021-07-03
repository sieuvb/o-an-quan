import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { DragPreviewImage, useDrag, useDragLayer, useDrop } from 'react-dnd';
import { getSquareId, IChessSquare, SquareType } from '@o-an-quan/shared';
import smallStonesImg from 'assests/images/small-stones.png';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { SQUARE_TYPE } from '../constants';
import { chessboardViewModel } from '../ChessBoardViewModel';

interface IDragSquareProps {
  className?: string;
  square: IChessSquare;
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

  &.over {
    background: #e6f7ff;
    z-index: 2;
  }
`;

const SquareContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  .left {
    position: absolute;
    top: 0;
    left: 0;
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
      font-weight: 600;
      line-height: 24px;
    }
  }
`;

export const DragSquare: React.FC<IDragSquareProps> = ({
  className,
  square,
}) => {
  const [{ isDragging }, dragRef, preview] = useDrag<any, any, any>({
    type: SQUARE_TYPE,
    item: square,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const [{ canDrop, isOver }, dropRef] = useDrop<any, any, any>(() => ({
    accept: SQUARE_TYPE,
    drop: (draggingItem: IChessSquare) => {
      chessboardViewModel.moveStep(draggingItem.index, square.index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const { bigStoneNum, smallStoneNum, index, type } = square;
  const isHaveStones = bigStoneNum > 0 || smallStoneNum > 0;
  return (
    <DragDropWrapper
      id={getSquareId(index)}
      ref={dragRef}
      className={classnames(
        {
          dragging: isDragging,
          over: isOver,
        },
        className,
      )}
    >
      <DragPreviewImage connect={preview} src={smallStonesImg} />
      <div className="drop-space" ref={dropRef}>
        <SquareContent>
          <div className="left">Index: {index}</div>
          {isHaveStones && (
            <div className="stone-wrapper">
              <div className="stone-info">
                {type === SquareType.BIG_SQUARE ? (
                  <div>
                    L: {bigStoneNum} | S: {smallStoneNum}
                  </div>
                ) : (
                  smallStoneNum
                )}
              </div>
              <img src={smallStonesImg} alt="stones" />
            </div>
          )}
        </SquareContent>
      </div>
    </DragDropWrapper>
  );
};
