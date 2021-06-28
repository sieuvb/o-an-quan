import { observer } from 'mobx-react-lite';
import { appModel } from 'models';
import { PlayerCard, ChessBoard, GameSharingLink } from 'components';
import { PageWrapper } from './styles';

export const GamePage = observer(() => {
  const {
    currPlayer,
    rivalPlayer,
    gameSharingLink,
    isRoomOwner,
    roomInfo,
  } = appModel.gameModel;
  return (
    <PageWrapper>
      <PlayerCard player={rivalPlayer} />
      {roomInfo?.gameState && <ChessBoard gameState={roomInfo.gameState} />}
      <PlayerCard player={currPlayer} isCurrPlayer />
      {isRoomOwner && (
        <GameSharingLink className="link-sharing" link={gameSharingLink} />
      )}
    </PageWrapper>
  );
});
