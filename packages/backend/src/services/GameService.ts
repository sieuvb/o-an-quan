import { nanoid } from 'nanoid';
import {
  IChessSquare,
  IGameState,
  INITIAL_SMALL_SQUARE_STONES,
  INITIAL_BIG_SQUARE_STONES,
  IPlayer,
  IRoomInfo,
  RoomStatus,
  SquareType,
  checkSquareIndexType,
  MoveDirection,
  IGameStep,
  StepAction,
  getPlayerIndexBySquareIndex,
} from '@o-an-quan/shared';
import { gameRepository } from '../repositories';

const INITIAL_PLAYER_GAME_INFO = {
  bigStoneNum: 0,
  smallStoneNum: 0,
  historySteps: [],
};

const initSquares = (
  numOfPlayers: number = 2,
  numOfSquaresPerPlayer: number = 5,
): IChessSquare[] => {
  let squares = [];

  for (
    var index = 0;
    index < numOfPlayers * (numOfSquaresPerPlayer + 1);
    index++
  ) {
    let type = checkSquareIndexType(index, numOfSquaresPerPlayer);
    squares.push({
      index,
      playerIndex: getPlayerIndexBySquareIndex(index),
      type,
      smallStoneNum:
        type == SquareType.BIG_SQUARE ? 0 : INITIAL_SMALL_SQUARE_STONES,
      bigStoneNum:
        type == SquareType.BIG_SQUARE ? INITIAL_BIG_SQUARE_STONES : 0,
    });
  }
  return squares;
};

export class GameService {
  initGame = (firstPlayer: IPlayer) => {
    const firstPlayerInfo: IPlayer = {
      ...firstPlayer,
      index: 0,
      playerGameInfo: INITIAL_PLAYER_GAME_INFO,
    };

    const initialGameState: IGameState = {
      players: [firstPlayerInfo],
      currentTurn: 0,
      squares: initSquares(),
    };

    return initialGameState;
  };

  createRoom = (
    playerid: string,
    playerInfo: Omit<IPlayer, 'id' | 'index'>,
  ) => {
    const firstPlayer: IPlayer = {
      id: playerid,
      index: 0,
      ...playerInfo,
    };
    const room: IRoomInfo = {
      id: playerid,
      status: RoomStatus.WAITING_FOR_PLAYERS,
      gameState: this.initGame(firstPlayer),
    };
    return gameRepository.createRoom(room);
  };

  getRoomInfo = (playerId: string) => {
    const roomId = gameRepository.getRoomIdByPlayerId(playerId);
    const roomInfo = gameRepository.getRoomInfo(roomId);
    return roomInfo;
  };

  joinRoom = (
    playerid: string,
    roomId: string,
    playerInfo: Omit<IPlayer, 'id' | 'index'>,
  ) => {
    const roomInfo = gameRepository.getRoomInfo(roomId);
    if (!roomInfo) {
      throw 'Invalid room id';
    }

    if (roomInfo.status !== RoomStatus.WAITING_FOR_PLAYERS) {
      throw 'Invalid room status';
    }

    const newPlayerInfo: IPlayer = {
      id: playerid,
      ...playerInfo,
      index: 1,
      playerGameInfo: {
        bigStoneNum: 0,
        smallStoneNum: 0,
        historySteps: [],
      },
    };
    let newRoomInfo = gameRepository.addRoomPlayers(roomId, newPlayerInfo);
    if (newRoomInfo.gameState.players.length === 2) {
      newRoomInfo = gameRepository.updateRoomStatus(roomId, RoomStatus.PLAYING);
    }
    gameRepository.mapPlayerToRoom(playerid, roomInfo.id);

    return newRoomInfo;
  };

  rematch = (playerId: string) => {
    const roomId = gameRepository.getRoomIdByPlayerId(playerId);
    const roomInfo = gameRepository.getRoomInfo(roomId);
    const newPlayersData = roomInfo.gameState.players.map(
      ({ playerGameInfo, ...rest }) => ({
        ...rest,
        playerGameInfo: INITIAL_PLAYER_GAME_INFO,
      }),
    );
    const newRoomData: IRoomInfo = {
      ...roomInfo,
      status: RoomStatus.PLAYING,
      gameState: {
        players: newPlayersData,
        currentTurn: 0,
        squares: initSquares(),
      },
    };
    const newRoomInfo = gameRepository.updateRoom(newRoomData);
    return newRoomInfo;
  };

  inputStep = (
    roomId: string,
    squareIndex: number,
    moveDirection: MoveDirection,
  ) => {
    const gameStep: IGameStep = {
      squareIndex,
      moveDirection,
      steps: [],
    };

    let game = gameRepository.getRoomInfo(roomId);

    if (this.squareIsBlank(game.gameState?.squares[squareIndex])) {
      throw new Error('Selected square must contains stone(s)');
    }

    const resultGameStep = this.calculateGameStep(
      roomId,
      game.gameState.squares,
      gameStep,
    );

    game = gameRepository.switchTurn(roomId);

    // Check if both Big square is blank.
    if (
      this.squareIsBlank(game.gameState?.squares[5]) &&
      this.squareIsBlank(game.gameState?.squares[11])
    ) {
      game = gameRepository.updateRoomStatus(roomId, RoomStatus.FINISHED);
      return game;
    }

    // Check other player turn if empty
    const currentTurn = game.gameState.currentTurn;
    const nextPlayerSquares = game.gameState.squares.filter(
      ({ playerIndex }) => playerIndex === currentTurn,
    );
    if (nextPlayerSquares.every(({ smallStoneNum }) => smallStoneNum === 0)) {
      gameRepository.takeSmallStoneFromPlayer(roomId, 5);
      nextPlayerSquares.forEach((_, index) => {
        game.gameState.squares[index].smallStoneNum = 1;
        gameStep.steps.push({
          action: StepAction.REPUT,
          squareIndex: index,
          smallStoneNum: 1,
          bigStoneNum: 0,
        });
      });
    }

    game = gameRepository.inputPlayerStep(roomId, resultGameStep);

    return game;
  };

  // returned list of squares, number of big stones and small stone the user got.
  private calculateGameStep = (
    roomId: string,
    currentSquares: IChessSquare[],
    gameStep: IGameStep,
  ): IGameStep => {
    let end_loop = false;
    let calculatedSquares = currentSquares;

    let selectedSquareIndex = gameStep.squareIndex;
    let directionIndex = gameStep.moveDirection === MoveDirection.CW ? -1 : 1;

    while (!end_loop) {
      // Get the number of stones in the selected square
      let numOfStonesSelected =
        calculatedSquares[selectedSquareIndex].smallStoneNum;
      gameStep.steps.push({
        action: StepAction.PICK,
        squareIndex: selectedSquareIndex,
        smallStoneNum: 0,
        bigStoneNum: 0,
        numOfStonesSelected,
      });
      // Pick up all the stones in the selected square
      calculatedSquares[selectedSquareIndex].smallStoneNum = 0;

      let currentIndex = selectedSquareIndex;

      while (numOfStonesSelected > 0) {
        const nextIndex = this.getNextIndex(
          currentIndex,
          directionIndex,
          currentSquares.length,
        );

        calculatedSquares[nextIndex].smallStoneNum++;

        gameStep.steps.push({
          action: StepAction.MOVE,
          squareIndex: nextIndex,
          smallStoneNum: calculatedSquares[nextIndex].smallStoneNum,
          bigStoneNum: calculatedSquares[nextIndex].bigStoneNum,
          numOfStonesSelected,
        });

        currentIndex = nextIndex;
        numOfStonesSelected--;
      }

      let nextSquare =
        calculatedSquares[
          this.getNextIndex(currentIndex, directionIndex, currentSquares.length)
        ];
      // Break if Big Square
      if (nextSquare.type === SquareType.BIG_SQUARE) {
        console.log('Stopped due to BIG SQUARE');
        break;
      }
      // Break if 2-squares-blank
      if (nextSquare.smallStoneNum === 0 && nextSquare.bigStoneNum === 0) {
        let next2Index = this.getNextIndex(
          this.getNextIndex(
            currentIndex,
            directionIndex,
            currentSquares.length,
          ),
          directionIndex,
          currentSquares.length,
        );

        let next2Square = calculatedSquares[next2Index];
        let nextIndex;
        if (next2Square.smallStoneNum === 0 && next2Square.bigStoneNum === 0) {
          console.log('Stopped due to 2 blank squares');
          break;
        } else {
          // Calculate taking the valid squares.
          let end_taking_loop = false;
          while (!end_taking_loop) {
            if (
              this.squareIsBlank(nextSquare) &&
              !this.squareIsBlank(next2Square)
            ) {
              gameRepository.putStoneOnPlayer(
                roomId,
                next2Square.bigStoneNum,
                next2Square.smallStoneNum,
              );
              next2Square.smallStoneNum = 0;
              next2Square.bigStoneNum = 0;

              gameStep.steps.push({
                action: StepAction.TAKE,
                squareIndex: next2Index,
                smallStoneNum: next2Square.smallStoneNum,
                bigStoneNum: next2Square.bigStoneNum,
                numOfStonesSelected,
              });
            } else {
              end_taking_loop = true;
            }

            nextIndex = this.getNextIndex(
              next2Index,
              directionIndex,
              currentSquares.length,
            );
            next2Index = this.getNextIndex(
              nextIndex,
              directionIndex,
              currentSquares.length,
            );

            nextSquare = currentSquares[nextIndex];
            next2Square = currentSquares[next2Index];
          }
          break;
        }
      }
      // Keep moving with the next square:
      selectedSquareIndex = this.getNextIndex(
        currentIndex,
        directionIndex,
        currentSquares.length,
      );
    }

    return gameStep;
  };

  private getNextIndex = (
    currentIndex: number,
    directionIndex: number,
    squaresLenght: number,
  ): number => {
    if (directionIndex == -1 && currentIndex == 0) {
      return squaresLenght - 1;
    } else if (directionIndex == 1 && currentIndex == squaresLenght - 1) {
      return 0;
    } else {
      return currentIndex + directionIndex;
    }
  };

  private squareIsBlank = (square: IChessSquare): Boolean => {
    return square.bigStoneNum == 0 && square.smallStoneNum == 0;
  };
}

export const gameService = new GameService();
