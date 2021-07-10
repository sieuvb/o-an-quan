import React from 'react';
import styled from 'styled-components';
import { IPlayer } from '@o-an-quan/shared';
import { PlayerCard } from '../PlayerCard';

interface IPlayerSectionProps {
  player?: IPlayer;
  currTurn?: number;
  isCurrPlayer?: boolean;
}

const SectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  align-items: center;
  height: 150px;
  width: 100%;
`;

const TurnText = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

export const PlayerSection: React.FC<IPlayerSectionProps> = ({
  player,
  isCurrPlayer,
  currTurn,
}) => {
  const isPlayerTurn = currTurn === player.index;
  return (
    <SectionWrapper>
      {isPlayerTurn ? <TurnText>{player.name}'s turn</TurnText> : <div />}
      <PlayerCard player={player} isCurrPlayer={isCurrPlayer} />
    </SectionWrapper>
  );
};
