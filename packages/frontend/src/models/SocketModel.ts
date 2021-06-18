import { makeAutoObservable } from 'mobx';
import { Socket, io } from 'socket.io-client';
import { CREATE_ROOM } from '@o-an-quan/shared';

export class SocketModel {
  socket: Socket;
  constructor() {
    makeAutoObservable(this);

    this.socket = io(process.env.REACT_APP_BASE_URL || 'localhost:3003');

    this.socket.on('connect', () => {
      console.log('connected');
    });
    console.log({ env: process.env });
    this.socket.emit('hello', 'hi from client');
    this.socket.on('hello-client', () => {
      console.log('receive hello');
    });
  }

  createRoom = () => {
    this.socket.emit(CREATE_ROOM, { name: 'test' });
  };
}
