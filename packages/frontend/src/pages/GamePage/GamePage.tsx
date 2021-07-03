import React from 'react';
import { observer } from 'mobx-react-lite';
import { appModel } from 'models';
import { PlayerCard, ChessBoard, GameSharingLink } from 'components';
import { RoomStatus } from '@o-an-quan/shared';
import { PageWrapper } from './styles';

export const GamePage = observer(() => {
  const {
    currPlayer,
    rivalPlayer,
    gameSharingLink,
    isRoomOwner,
    roomInfo,
  } = appModel.gameModel;
  const isShowRoomLink =
    isRoomOwner && roomInfo?.status === RoomStatus.WAITING_FOR_PLAYERS;
  return (
    <PageWrapper>
      <PlayerCard player={rivalPlayer} />
      {roomInfo?.gameState && <ChessBoard gameState={roomInfo.gameState} />}
      <PlayerCard player={currPlayer} isCurrPlayer />
      {isShowRoomLink && (
        <GameSharingLink className="link-sharing" link={gameSharingLink} />
      )}
    </PageWrapper>
  );
});
