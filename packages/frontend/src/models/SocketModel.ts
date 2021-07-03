import { makeAutoObservable } from 'mobx';
import { Socket, io } from 'socket.io-client';
import {
  CREATE_ROOM,
  CREATE_ROOM_SUCCESS,
  ICreateGameRoomEventProps,
  IInputStepProps,
  IJoinGameRoomEventProps,
  IRoomInfo,
  ISocketResponsePayload,
  JOIN_ROOM,
  JOIN_ROOM_SUCCESS,
  RELOAD_ROOM,
  RELOAD_ROOM_SUCCESS,
  USER_INPUT_STEP,
} from '@o-an-quan/shared';
import { appModel } from './AppModel';

export class SocketModel {
  socket: Socket;

  constructor() {
    makeAutoObservable(this);
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost';
    const socketPort = process.env.REACT_APP_SOCKET_PORT || '3003';
    this.socket = io(`${socketUrl}:${socketPort}`);
    this.socket.on('connect', () => {
      console.log(`Socket connected: ${this.socket.id}`);
    });
    this.socket.on(CREATE_ROOM_SUCCESS, this.handleCreateRoomSuccess);
    this.socket.on(JOIN_ROOM_SUCCESS, this.handleJoinRoomSuccess);
    this.socket.on(RELOAD_ROOM_SUCCESS, this.handleReloadRoomSuccess);
    this.socket.on(USER_INPUT_STEP, this.handleInputStepResponse);
  }

  createRoom = (payload: ICreateGameRoomEventProps) => {
    this.socket.emit(CREATE_ROOM, payload);
  };

  joinRoom = (payload: IJoinGameRoomEventProps) => {
    this.socket.emit(JOIN_ROOM, payload);
  };

  inputStep = (payload: IInputStepProps) => {
    this.socket.emit(USER_INPUT_STEP, payload);
  };

  reloadRoom = (playerId: string) => {
    this.socket.emit(RELOAD_ROOM, playerId);
  };

  handleCreateRoomSuccess = (payload: ISocketResponsePayload<IRoomInfo>) => {
    const roomInfo = payload.data;
    appModel.gameModel.initRoom(roomInfo);
    console.log('CREATE ROOM success', { payload });
  };

  handleJoinRoomSuccess = (payload: ISocketResponsePayload<IRoomInfo>) => {
    const roomInfo = payload.data;
    appModel.gameModel.initRoom(roomInfo);
    console.log('JOIN ROOM success', { payload });
  };

  handleReloadRoomSuccess = (payload: ISocketResponsePayload<IRoomInfo>) => {
    const roomInfo = payload.data;
    appModel.gameModel.initRoom(roomInfo);
    console.log('RELOAD ROOM success', { payload });
  };

  handleInputStepResponse = (payload: ISocketResponsePayload<IRoomInfo>) => {
    const roomInfo = payload.data;
    appModel.gameModel.updateRoom(roomInfo);
  };
}
