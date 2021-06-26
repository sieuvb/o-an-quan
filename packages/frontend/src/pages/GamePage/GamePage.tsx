import { observer } from 'mobx-react-lite';
import { appModel } from 'models';
import { Input, Button } from 'antd';
import { PlayerCard, ChessBoard, GameSharingLink } from 'components';
import { PageWrapper } from './styles';
import { MoveDirection } from '@o-an-quan/shared';
import React from 'react';

export const GamePage = observer(() => {
  const { currPlayer, rivalPlayer, gameSharingLink, isRoomOwner, roomInfo } =
    appModel.gameModel;

  const [squareId, setPlayerMove] = React.useState('');

  const handlePlayerMoveChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPlayerMove(event.target.value);
  };

  const onClickDummyCWButton = () => {
    onClickDummyButton(MoveDirection.CW);
  };

  const onClickDummyCCWButton = () => {
    onClickDummyButton(MoveDirection.CCW);
  };
  const onClickDummyButton = (moveDirection: MoveDirection) => {
    appModel.socketModel.inputMove({
      playerId: currPlayer?.id,
      roomId: roomInfo?.id,
      squareId: squareId,
      moveDirection: moveDirection,
    });
  };

  return (
    <PageWrapper>
      <PlayerCard player={rivalPlayer} />
      <ChessBoard />
      <PlayerCard player={currPlayer} isCurrPlayer />
      {isRoomOwner && (
        <GameSharingLink className="link-sharing" link={gameSharingLink} />
      )}
      <Input
        placeholder="input the squareId"
        onChange={handlePlayerMoveChange}
      />
      <Button type="primary" block onClick={onClickDummyCWButton}>
        Dummy CW
      </Button>
      <Button type="primary" block onClick={onClickDummyCCWButton}>
        Dummy CWW
      </Button>
    </PageWrapper>
  );
});
