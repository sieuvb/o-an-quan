import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { IPlayer } from '@o-an-quan/shared';

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-row-gap: 8px;
  padding: 16px 36px;
  background: linear-gradient(
    to right bottom,
    rgba(255, 255, 255, 0.7),
    rgba(255, 255, 255, 0.3)
  );
  width: 168px;
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
