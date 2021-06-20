import React from 'react';
import { Alert, Typography } from 'antd';

export interface IGameSharingLinkProps {
  link: string;
  className?: string;
}
export const GameSharingLink: React.FC<IGameSharingLinkProps> = ({
  link,
  ...props
}) => {
  return (
    <Alert
      {...props}
      type="info"
      message={
        <Typography.Text copyable={{ text: link }}>
          Please share this link to another player to join: {link}
        </Typography.Text>
      }
    />
  );
};
