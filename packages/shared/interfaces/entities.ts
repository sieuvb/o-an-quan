import { MoveDirection, RoomStatus, SquareType } from '../enums/common';

export type SquareIndex = number | 'left' | 'right';

export interface IChessSquare {
  id: string;
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
  smallSquares: IChessSquare[];
  historySteps: IGameStep[];
}

export interface IGameState {
  players: IPlayer[];
  bigSquares: IChessSquare[];
}

export interface IGameStep {
  squareIndex: [1, 2, 3, 4, 5];
  moveDirection: MoveDirection;
}

export interface IRoomInfo {
  id: string;
  status: RoomStatus;
  gameState: IGameState;
}
