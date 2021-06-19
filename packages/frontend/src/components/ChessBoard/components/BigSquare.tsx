import React from 'react';
import styled from 'styled-components';

const SquareWrapper = styled.div`
  width: 300px;
  height: 300px;
  border: 2px solid black;
`;

export interface IBigSquareProps {}

export const BigSquare: React.FunctionComponent<IBigSquareProps> = ({
  children,
}) => {
  return <SquareWrapper>{children}</SquareWrapper>;
};
