import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { appModel } from 'models';
import { IPlayer, RoomStatus } from '@o-an-quan/shared';
import { PlayerCard, PlayerAward } from './components';

interface IPlayerInfoSectionProps {
  player?: IPlayer;
  currTurn?: number;
  isCurrPlayer?: boolean;
}

const SectionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 80vw;
  margin: 0 auto;

  &.left {
  }

  &.right {
    direction: rtl;
  }
`;

const TurnText = styled.div`
  font-size: 38px;
  font-weight: 500;
  margin: 0 24px;
  background: linear-gradient(to right, #006994, rgba(255, 255, 255, 1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const PlayerInfoSection: React.FC<IPlayerInfoSectionProps> = observer(
  ({ player, isCurrPlayer, currTurn }) => {
    const isPlayerTurn =
      currTurn === player?.index &&
      appModel.gameModel.roomInfo.status === RoomStatus.PLAYING;
    return (
      <SectionWrapper
        className={classnames({
          left: isCurrPlayer,
          right: !isCurrPlayer,
        })}
      >
        <PlayerCard player={player} isCurrPlayer={isCurrPlayer} />
        <PlayerAward player={player} />
        {isPlayerTurn ? <TurnText>{player.name}'s turn</TurnText> : <div />}
      </SectionWrapper>
    );
  },
);
