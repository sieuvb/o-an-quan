import { MoveDirection, RoomStatus, SquareType } from '../enums/common';

export type SquareIndex = number | 'left' | 'right';

export interface IChessSquare {
  index: SquareIndex;
  type: SquareType;
  smallStoneNum: number;
  bigStoneNum: number;
}

export interface IPlayer {
  id: string;
  name: string;
  deviceId: string;
  ipAddress: string;
  playerGameInfo?: IPlayerGameInfo;
}

export interface IPlayerGameInfo {
  smallStoneNum: number;
  bigStoneNum: number;
  historySteps: IGameStep[];
}

export interface IGameState {
  players: IPlayer[];
  squares: IChessSquare[];
}

export interface IGameStep {
  squareIndex: number;
  moveDirection: MoveDirection;
}

export interface IRoomInfo {
  id: string;
  status: RoomStatus;
  gameState: IGameState;
}
