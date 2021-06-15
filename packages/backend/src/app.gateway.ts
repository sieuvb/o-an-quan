import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(3005)
export class AppGateway implements OnGatewayInit, OnGatewayConnection {
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: any) {
    this.logger.debug('init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.emit('hello-client', 'hiiiii');
    this.logger.debug(`Connection: ${client.id}`);
  }

  @SubscribeMessage('hello-server')
  handleMessage(client, text: string): string {
    this.logger.debug(`hello: ${text}`);
    client.emit('hello-client', 'hiiiii');

    return 'hello';
  }
}
