import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { DragPreviewImage, useDrag, useDragLayer, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { appModel } from 'models';
import { getSquareId, IChessSquare, SquareType } from '@o-an-quan/shared';
import smallStonesImg from 'assests/images/small-stones.png';
import { SQUARE_TYPE } from '../constants';
import { StonesRender } from './StonesRender';

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
    font-weight: 600;
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
      appModel.gameModel.moveStep(draggingItem.index, square.index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const { bigStoneNum, smallStoneNum, index, type } = square;
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
          <div className="left">{index}</div>
          {smallStoneNum > 0 && <div className="right">{smallStoneNum}</div>}
          <StonesRender
            bigStonesNum={bigStoneNum}
            smallStonesNum={smallStoneNum}
          />
        </SquareContent>
      </div>
    </DragDropWrapper>
  );
};
