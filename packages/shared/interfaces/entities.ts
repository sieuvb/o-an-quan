import {
  MoveDirection,
  RoomStatus,
  SquareType,
  StepAction,
} from '../enums/common';

export type PlayerIndex = 0 | 1;
export interface IChessSquare {
  //TODO
  id?: string;
  playerIndex?: PlayerIndex;
  index: number;
  type: SquareType;
  smallStoneNum: number;
  bigStoneNum: number;
}

export interface IPlayer {
  id: string;
  index: PlayerIndex;
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
  currentTurn: 0 | 1;
  squares: IChessSquare[];
}

export interface IMoveStep {
  action: StepAction;
  squareIndex: number;
  smallStoneNum: number;
  bigStoneNum: number;
  numOfStonesSelected?: number;
}

export interface IGameStep {
  squareIndex: number;
  moveDirection: MoveDirection;
  steps: IMoveStep[];
}

export interface IRoomInfo {
  id: string;
  status: RoomStatus;
  gameState: IGameState;
}
