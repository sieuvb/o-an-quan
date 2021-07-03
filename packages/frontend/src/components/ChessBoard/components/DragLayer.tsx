import React from 'react';
import styled from 'styled-components';
import { useDragLayer } from 'react-dnd';

const LayerWrapper = styled.div`
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

const Box = styled.div<{ x: number; y: number; display: boolean }>`
  display: inline-block;
  background: red;
  ${({ display }) => display && `display: none`};
  transform: ${({ x, y }) => `translate(${x}px, ${y}px)`};
  --webkit-transform: ${({ x, y }) => `translate(${x}px, ${y}px)`};
`;

export const DragLayer: React.FC = () => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !initialOffset || !currentOffset) {
    return null;
  }

  const { x, y } = currentOffset;
  return (
    <LayerWrapper>
      <Box x={x} y={y} display={!initialOffset || !currentOffset}>
        test
      </Box>
    </LayerWrapper>
  );
};
