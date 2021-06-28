import { css } from 'styled-components';

export const layoutStyles = css`
  --small-square-size: 150px;
  --small-square-gap: 0;
  --big-square-height: calc(var(--small-square-size) * 2);
  --big-square-width: calc(var(--big-square-height) / 2);
  --small-square-wrapper-width: calc(var(--small-square-size) * 5);
  --big-squares-width: calc(var(--big-square-width) * 2);
  --chess-board-width: calc(
    var(--big-squares-width) + var(--small-square-wrapper-width)
  );
  --chess-board-height: var(--big-square-height);
  --chess-board-bg: cornsilk;
  --square-border-color: black;
  --square-border-width: 1px;
`;
