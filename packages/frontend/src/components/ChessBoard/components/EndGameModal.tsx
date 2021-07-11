import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Button } from 'antd';
import { appModel } from 'models';

interface IEndGameModalProps {
  visible: boolean;
}

const Modal = styled.div`
  position: fixed;
  top: -100px;
  left: calc(50% - 268px);
  opacity: 0;
  transition: 1s all;
  z-index: 9;
  background: linear-gradient(
    to right bottom,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.7),
    rgba(255, 215, 0, 0.8),
    rgba(255, 215, 0, 1)
  );
  padding: 48px 64px;
  font-size: 28px;
  font-weight: 500;

  &.visible {
    top: 30vh;
    opacity: 1;
  }
`;

export const EndGameModal: React.FC<IEndGameModalProps> = ({ visible }) => {
  const handleClickRematch = () => {
    appModel.gameModel.rematch();
  };
  return (
    <Modal className={classnames({ visible })}>
      <h2>Game finished 🎉🎉🎉</h2>
      <Button block onClick={handleClickRematch}>
        Rematch
      </Button>
    </Modal>
  );
};
