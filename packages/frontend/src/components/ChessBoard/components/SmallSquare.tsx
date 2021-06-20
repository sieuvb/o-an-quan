import React from 'react';
import styled from 'styled-components';

const SquareWrapper = styled.div`
  width: 150px;
  height: 150px;
  border: 2px solid black;
`;

export interface ISmallSquareProps {}

export const SmallSquare: React.FunctionComponent<ISmallSquareProps> = ({
  children,
}) => {
  return <SquareWrapper>{children}</SquareWrapper>;
};
