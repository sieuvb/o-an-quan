export enum MoveDirection {
  CW = 'CW',
  CCW = 'CCW',
}

export enum SquareType {
  BIG_SQUARE = 'BIG_SQUARE',
  SMALL_SQUARE = 'SMALL_SQUARE',
}

export enum BigSquareType {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum RoomStatus {
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export enum SocketResponseStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export enum StepAction {
  PICK = 'PICK',
  MOVE = 'MOVE',
  TAKE = 'TAKE',
  REPUT = 'REPUT',
}
