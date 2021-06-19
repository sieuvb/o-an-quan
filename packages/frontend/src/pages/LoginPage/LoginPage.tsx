import React from 'react';
import { Input, Button, Tabs, Typography } from 'antd';
import { appModel } from 'models';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { ROOM_KEY } from '@o-an-quan/shared';
import { ModalWrapper } from './styles';

const { Title } = Typography;

enum TabKey {
  CREATE_ROOM = 'CREATE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
}

export const LoginPage = observer(() => {
  const { currPlayerId: playerId } = appModel.gameModel;
  const [activeTabKey, setActiveTabKey] = React.useState(TabKey.CREATE_ROOM);
  const [playerName, setPlayerName] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const {
    location: { search },
  } = useHistory();

  React.useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const roomParam = queryParams.get(ROOM_KEY);
    if (roomParam) {
      setActiveTabKey(TabKey.JOIN_ROOM);
      setRoomId(roomParam);
    }
  }, [search]);
  const handlePlayerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPlayerName(event.target.value);
  };

  const handleRoomIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value);
  };

  const handleTabChange = (activeKey: string) => {
    setActiveTabKey(activeKey as TabKey);
  };

  const onClickCreateRoom = () => {
    appModel.socketModel.createRoom({ playerId, playerName });
  };

  const onClickJoinRoom = () => {
    appModel.socketModel.joinRoom({ playerId, roomId, playerName });
  };

  const canCreate = !!playerName;
  const canJoinRoom = !!playerName && !!roomId;
  return (
    <ModalWrapper>
      <Title level={3}>Mandarin Square Capturing</Title>
      <Input
        style={{ width: '300px' }}
        placeholder="Please input nick name"
        onChange={handlePlayerNameChange}
      />
      <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
        <Tabs.TabPane tab="Create Room" key={TabKey.CREATE_ROOM}>
          <div className="btn-action">
            <Button
              type="primary"
              block
              onClick={onClickCreateRoom}
              disabled={!canCreate}
            >
              Create Room
            </Button>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Join Room" key={TabKey.JOIN_ROOM}>
          <Input
            placeholder="Input room id"
            value={roomId}
            onChange={handleRoomIdChange}
          />
          <div className="btn-action">
            <Button
              type="primary"
              block
              onClick={onClickJoinRoom}
              disabled={!canJoinRoom}
            >
              Join Room
            </Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </ModalWrapper>
  );
});
