import { Server, Socket } from 'socket.io';
import {
  CREATE_ROOM,
  CREATE_ROOM_SUCCESS,
  USER_INPUT_STEP,
  ICreateGameRoomEventProps,
  IJoinGameRoomEventProps,
  IInputStepProps,
  IRoomInfo,
  JOIN_ROOM,
  JOIN_ROOM_SUCCESS,
  RELOAD_ROOM,
  RELOAD_ROOM_SUCCESS,
  SocketResponseStatus,
  MoveDirection,
} from '@o-an-quan/shared';
import { gameService } from '../services';
import { BaseEventHandler, SocketResponse } from './BaseEventHandler';
import { nanoid } from 'nanoid';
export class GameEventHandlers extends BaseEventHandler {
  constructor(socket: Socket, socketServer: Server) {
    super(socket, socketServer);
    this.subscribeEvent(CREATE_ROOM, this.createRoomEventHandler);
    this.subscribeEvent(JOIN_ROOM, this.joinRoomEventHandler);
    this.subscribeEvent(RELOAD_ROOM, this.reloadGameInfoHandler);
    this.subscribeEvent(USER_INPUT_STEP, this.userInputStepHandler);
  }

  createRoomEventHandler = (
    props: ICreateGameRoomEventProps,
  ): SocketResponse<any, any> => {
    const { playerId, playerName, deviceId = '' } = props;
    const ipAddress = this.socket.handshake.address;
    const playerInfo = {
      playerId,
      deviceId,
      ipAddress,
      name: playerName,
      playerGameInfo: {
        bigStoneNum: 0,
        smallStoneNum: 0,
        historySteps: [],
      },
    };
    this.socket.join(playerId);
    const roomInfo = gameService.createRoom(playerId, playerInfo);
    return {
      event: CREATE_ROOM_SUCCESS,
      payload: {
        status: SocketResponseStatus.SUCCESS,
        data: roomInfo,
        error: null,
      },
    };
  };

  joinRoomEventHandler = (
    props: IJoinGameRoomEventProps,
  ): SocketResponse<any, any> => {
    const { playerId, deviceId = '', roomId, playerName = '' } = props;
    const socketRoomId = roomId || playerId;
    if (!socketRoomId) {
      throw 'roomId or playerId is required to join room';
    }
    const ipAddress = this.socket.handshake.address;
    const playerInfo = {
      deviceId,
      ipAddress,
      name: playerName,
      playerGameInfo: {
        bigStoneNum: 0,
        smallStoneNum: 0,
        historySteps: [],
      },
    };
    const roomInfo = gameService.joinRoom(playerId, socketRoomId, playerInfo);
    this.socket.join(socketRoomId);
    return {
      event: JOIN_ROOM_SUCCESS,
      roomId: roomInfo.id,
      payload: {
        status: SocketResponseStatus.SUCCESS,
        data: roomInfo,
        error: null,
      },
    };
  };

  reloadGameInfoHandler = (
    playerId: string,
  ): SocketResponse<IRoomInfo, any> => {
    const roomInfo = gameService.getRoomInfo(playerId);
    this.socket.join(roomInfo.id);
    return {
      event: RELOAD_ROOM_SUCCESS,
      payload: {
        status: SocketResponseStatus.SUCCESS,
        data: roomInfo,
        error: null,
      },
    };
  };

  userInputStepHandler = (props: IInputStepProps): SocketResponse<any, any> => {
    const { roomId, squareId, moveDirection } = props;
    
    const roomInfo = gameService.inputStep(
      roomId,
      squareId,
      moveDirection,
    );

    
    return {
      event: USER_INPUT_STEP,
      payload: {
        status: SocketResponseStatus.SUCCESS,
        data: roomInfo,
        error: null,
      },
    };
  };
}
