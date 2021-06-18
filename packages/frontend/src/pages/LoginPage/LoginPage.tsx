import React from 'react';
import { Form, Input, Button, Tabs, Typography } from 'antd';
import { PageWrapper, ModalWrapper } from './styles';
import { appModel } from 'models';
import { observer } from 'mobx-react-lite';

const { Title } = Typography;
export const LoginPage = observer(() => {
  const onClickCreateRoom = () => {
    appModel.socketModel.createRoom();
  };

  const onClickJoinRoom = () => {
    appModel.socketModel.createRoom();
  };
  return (
    <PageWrapper>
      <ModalWrapper>
        <Title level={3}>Mandarin Square Capturing</Title>
        <Tabs>
          <Tabs.TabPane tab="Create Room" key="CREATE_ROOM">
            <div className="btn-action">
              <Button type="primary" block onClick={onClickCreateRoom}>
                Create Room
              </Button>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Join Room" key="JOIN_ROOM">
            <Form>
              <Form.Item id="roomId">
                <Input placeholder="Input room id" />
                <div className="btn-action">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    onClick={onClickJoinRoom}
                  >
                    Join Room
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </ModalWrapper>
    </PageWrapper>
  );
});
