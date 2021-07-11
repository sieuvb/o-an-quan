import React from 'react';
import styled from 'styled-components';
import { IPlayer } from '@o-an-quan/shared';
import { StonesRender } from 'components/StonesRender';

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 36px;
  background: linear-gradient(
    to right bottom,
    rgba(255, 255, 255, 0.7),
    rgba(255, 255, 255, 0.3)
  );
  min-width: 200px;
  max-width: 400px;
  height: 100%;
  border-radius: 2px;
`;

export interface IPlayerAwardProps {
  player?: IPlayer;
}

export const PlayerAward: React.FC<IPlayerAwardProps> = ({ player }) => {
  if (!player) {
    return null;
  }
  const { smallStoneNum, bigStoneNum } = player.playerGameInfo;
  return (
    <CardWrapper>
      {smallStoneNum < 1 && bigStoneNum < 1 ? (
        <div style={{ fontSize: '60px' }}>🐷</div>
      ) : (
        <StonesRender
          smallStonesNum={smallStoneNum}
          bigStonesNum={bigStoneNum}
        />
      )}
    </CardWrapper>
  );
};
