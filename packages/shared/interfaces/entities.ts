import { MoveDirection, RoomStatus, SquareType } from '../enums/common';

export type SquareIndex = number | 'left' | 'right';
export type PlayerIndex = 1 | 2;
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
  currentTurn: PlayerIndex;
  squares: IChessSquare[];
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
