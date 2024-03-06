import type { RoomId, UserId } from '$/commonTypesWithClient/ids';
import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomRepository } from '$/repository/roomRepository';
import {
  canFlipInDirection,
  canPlaceStone,
  flipStonesInDirection,
  isGameEnd,
  judgeWinner,
} from '$/service/othelloLogics';
import { userColorUseCase } from './userColorUseCase';

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const handleGameEnd = (board: number[][], room: RoomModel): RoomModel | null => {
  if (isGameEnd(board)) {
    const winner = judgeWinner(board);
    const newRoom: RoomModel = { ...room, status: 'ended', winner };
    return newRoom;
  }
  return null;
};
export const boardUseCase = {
  //eslint-disable-next-line complexity
  clickBoard: async (x: number, y: number, userId: UserId, roomId: RoomId): Promise<boolean> => {
    const room = await roomRepository.findById(roomId);
    if (!room || room.status !== 'playing') return false;

    //自分のターンかどうか判定
    const turnColor = userColorUseCase.getUserColor(userId, room);
    if (room.currentTurn !== turnColor) return false;

    const newBoard: number[][] = JSON.parse(JSON.stringify(room.board));

    //石を置けるかどうか判定
    const isCanPlaceStone = canPlaceStone(x, y, newBoard, turnColor);
    if (!isCanPlaceStone) return false;

    newBoard[y][x] = turnColor;

    directions.forEach(([dx, dy]) => {
      if (canFlipInDirection(x, y, dx, dy, newBoard, turnColor)) {
        flipStonesInDirection(x, y, dx, dy, newBoard, turnColor);
      }
    });

    const newRoom: RoomModel = { ...room, board: newBoard, currentTurn: 3 - turnColor };

    const gameEndResult = handleGameEnd(newBoard, newRoom);
    if (gameEndResult !== null) {
      //ゲーム終了
      await roomRepository.finalizeGame(gameEndResult);
    } else {
      //ゲーム続行
      await roomRepository.updateBoard(newRoom);
    }
    return true;
  },
  canPlaceAllStones: async (roomId: RoomId, turnColor: number): Promise<number[][]> => {
    const room = await roomRepository.findById(roomId);
    if (room === null) {
      throw new Error('no room');
    }
    const newBoard: number[][] = room.board.map((row, y) =>
      row.map((cell, x) => {
        return cell === 0 && canPlaceStone(x, y, room.board, turnColor) ? -1 : cell;
      })
    );
    return newBoard;
  },
};
