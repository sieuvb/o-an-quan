import { css } from 'styled-components';

export interface IGridItemProps {
  index: number;
}

export const gridItemStyles = css<IGridItemProps>`
  grid-column: ${({ index }) => Math.floor((index % 5) + 1)};
  grid-row: ${({ index }) =>
    index === 0 ? 2 : Math.floor((10 - index) / 5 + 1)};
`;
