import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { GameEventHandlers } from './events';

const SOCKET_PORT = 3003;

const app = express();
const server = http.createServer(app);

const socketServer = new Server(server, {
  cors: {
    origin: '*',
  },
});

socketServer.on('connection', (socket) => {
  const clientInfo = { id: socket.id, ipAddress: socket.handshake.address };
  console.log(`Connected id: ${JSON.stringify(clientInfo)}`);
  new GameEventHandlers(socket, socketServer);
});

server.listen(process.env.port || SOCKET_PORT, () => {
  console.log(`App running on port ${process.env.port || SOCKET_PORT}`);
});
