import { makeAutoObservable } from 'mobx';
import { Socket, io } from 'socket.io-client';

const socket = io('http://localhost:3005', {}).connect();

socket.on('connect', () => {
  console.log('connected');
});
socket.on('connection', function (data) {
  console.log('socket ON connection', data);
});
socket.on('error', function (data) {
  console.log(data || 'error');
});

socket.on('connect_failed', function (data) {
  console.log(data || 'connect_failed');
});

socket.emit('hello', 'hi from client');
socket.on('hello-client', () => {
  console.log('receive hello');
});

export class SocketModel {
  // socket: Socket;
  constructor() {
    makeAutoObservable(this);

    // this.socket = io(process.env.REACT_APP_BASE_URL || 'localhost:30099');
    // this.socket = io('http://localhost:3005');

    // this.socket.on('connect', () => {
    //   console.log('connected');
    // });
    // console.log({ env: process.env });
    // this.socket.emit('hello', 'hi from client');
    // this.socket.on('hello-client', () => {
    //   console.log('receive hello');
    // });
  }

  emit = () => {
    socket.emit('hello-server', 'test');
  };
}
