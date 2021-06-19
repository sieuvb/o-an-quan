import React from 'react';
import styled from 'styled-components';

export const BoardWrapper = styled.div`
  display: grid;
  align-items: center;
  text-align: center;
  width: 60vw;
  height: 30vw;
  min-width: 600px;
  min-height: 300px;
  border: 1px solid black;
  border-radius: 2px;
  background: cornsilk;
`;

export interface IChessBoardProps {}
export const ChessBoard: React.FC<IChessBoardProps> = () => {
  return <BoardWrapper>Chess board</BoardWrapper>;
};
