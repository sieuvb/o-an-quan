import { MoveDirection, RoomStatus, SquareType, StepAction } from '../enums/common';

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
  playerGameInfo: IPlayerGameInfo;
}

export interface IPlayerGameInfo {
  smallStoneNum: number;
  bigStoneNum: number;
  historySteps: IGameStep[];
}

export interface IGameState {
  players: IPlayer[];
  currentTurn: number;
  squares: IChessSquare[];
}

export interface IGameStep {
  squareIndex: number;
  moveDirection: MoveDirection;
  steps: any[]
}

export interface IRoomInfo {
  id: string;
  status: RoomStatus;
  gameState: IGameState;
}
