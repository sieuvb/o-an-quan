import isEmpty from 'lodash/isEmpty';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';
import { DEVICE_ID_KEY } from '@o-an-quan/shared';
import { GameModel } from './GameModel';
import { SocketModel } from './SocketModel';

export class AppModel {
  socketModel: SocketModel;
  gameModel: GameModel;

  deviceId: string = localStorage.getItem(DEVICE_ID_KEY) || '';

  constructor() {
    this.socketModel = new SocketModel();
    this.gameModel = new GameModel();
    makeAutoObservable(this);
  }

  init = () => {
    if (!this.gameModel.currPlayerId) {
      this.gameModel.genPlayerId();
    } else {
      this.reloadPlayingRoom();
    }
  };

  get shouldLogin() {
    return isEmpty(this.gameModel.roomInfo);
  }

  reloadPlayingRoom = () => {
    if (this.gameModel.currPlayerId) {
      this.socketModel.reloadRoom(this.gameModel.currPlayerId);
    }
  };

  generateDeviceId = () => {
    const deviceId = nanoid();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  };
}

export const appModel = new AppModel();
