import { SocketModel } from './SocketModel';

export class AppModel {
  socketModel: SocketModel;
  test = 1;
  constructor() {
    this.socketModel = new SocketModel();
  }
}

export const appModel = new AppModel();
