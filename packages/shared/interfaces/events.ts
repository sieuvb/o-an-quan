export interface ICreateGameRoomEventProps {
  playerName: string;
  deviceId: string;
}

export interface IJoinGameRoomEventProps {
  playerName: string;
  roomId: string;
}
