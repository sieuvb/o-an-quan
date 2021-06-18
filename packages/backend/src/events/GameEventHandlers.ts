import { Socket } from 'socket.io';
import { CREATE_ROOM, ICreateGameRoomEventProps } from '@o-an-quan/shared';
import { gameService } from '../services';
import { BaseEventHandler } from './BaseEventHandler';

export class GameEventHandlers extends BaseEventHandler {
  constructor(socket: Socket) {
    super(socket);
    this.subscribeEvent(CREATE_ROOM, this.createRoomEventHandlers);
  }

  createRoomEventHandlers = ({
    playerName,
    deviceId,
  }: ICreateGameRoomEventProps) => {
    const ipAddress = this.socket.handshake.address;
    const playerInfo = {
      deviceId,
      ipAddress,
      name: playerName,
    };
    gameService.createRoom(this.socket.id, playerInfo);
    this.socket.join(this.socket.id);
  };
}
