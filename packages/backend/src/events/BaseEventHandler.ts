import { Socket } from 'socket.io';

export type IEventListener = (...args: any[]) => any;

export class BaseEventHandler {
  protected socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  subscribeEvent = (eventName: string, listener: IEventListener) => {
    try {
      this.socket.on(eventName, (...args) => {
        console.log(`[${eventName}] Request: ${JSON.stringify(args)}`);
        listener(args);
      });
    } catch (error) {
      console.error(`[${eventName}] Error: ${JSON.stringify(error)}`);
    }
  };
}
