import { Server, Socket } from 'socket.io';
import { ISocketResponse } from '../../../shared';

export type EventListener = (...args: any[]) => any;
export type SocketResponse<SuccessResponse, FailResponse> = ISocketResponse<
  SuccessResponse,
  FailResponse
>;
export type SubscribeEventFunc<SuccessResponse = any, FailResponse = any> = (
  event: string,
  listener: EventListener,
  errorHandler?: EventListener,
) => SocketResponse<SuccessResponse, FailResponse> | void;

export class BaseEventHandler {
  protected socket: Socket;
  protected socketServer: Server;

  constructor(socket: Socket, socketServer: Server) {
    this.socket = socket;
    this.socketServer = socketServer;
  }

  subscribeEvent: SubscribeEventFunc = (
    eventName: string,
    listener: EventListener,
    errorHandler?: EventListener,
  ) => {
    this.socket.on(eventName, (args) => {
      try {
        console.log(`[${eventName}] Request: ${JSON.stringify(args)}`);
        const eventResponse: SocketResponse<any, any> = listener(args);
        if (eventResponse) {
          const { event, roomId, payload } = eventResponse;
          console.log(
            `[${event}-${roomId}] Response: ${JSON.stringify(payload)}`,
          );
          if (roomId) {
            this.socketServer.in(roomId).emit(event, payload);
          } else {
            this.socket.emit(event, payload);
          }
        }
      } catch (error) {
        console.error(`[${eventName}] Error: ${JSON.stringify(error)}`);
        if (errorHandler) {
          return errorHandler(error);
        }
      }
    });
  };
}
