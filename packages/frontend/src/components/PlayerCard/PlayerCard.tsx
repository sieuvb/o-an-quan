import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { IPlayer } from '../../../../shared';

const CardWrapper = styled.div`
  display: grid;
  grid-row-gap: 8px;
  padding: 16px 36px;
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  margin: auto;
`;

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
`;

const NameWrapper = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 500;

  &.curr-player {
    color: #0170fe;
    &:after {
      content: ' (YOU)';
    }
  }
`;

export interface IPlayerCard {
  player?: IPlayer;
  isCurrPlayer?: boolean;
}

export const PlayerCard: React.FC<IPlayerCard> = ({
  player,
  isCurrPlayer = false,
}) => {
  return (
    <CardWrapper>
      {!player ? (
        <div>Waiting...</div>
      ) : (
        <>
          <AvatarWrapper>
            <Avatar icon={<UserOutlined />} size={64} />
          </AvatarWrapper>
          <NameWrapper className={classnames({ 'curr-player': isCurrPlayer })}>
            {player?.name}
          </NameWrapper>
        </>
      )}
    </CardWrapper>
  );
};
