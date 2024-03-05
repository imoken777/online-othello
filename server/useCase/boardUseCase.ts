import type { RoomId, UserId } from '$/commonTypesWithClient/ids';
import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomRepository } from '$/repository/roomRepository';
import { canFlipInDirection, canPlaceStone, flipStonesInDirection } from '$/service/othelloLogics';
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
export const boardUseCase = {
  clickBoard: async (x: number, y: number, userId: UserId, roomId: RoomId): Promise<RoomModel> => {
    const room = await roomRepository.findById(roomId);
    if (!room) {
      throw new Error('no room');
    }
    const turnColor = userColorUseCase.getUserColor(userId, room);
    if (room.currentTurn !== turnColor) return room;

    const newBoard: number[][] = JSON.parse(JSON.stringify(room.board));

    const isCanPlaceStone = canPlaceStone(x, y, newBoard, turnColor);
    if (!isCanPlaceStone) return room;

    newBoard[y][x] = turnColor;

    room.currentTurn = 3 - turnColor; // ターンを交代

    directions.forEach(([dx, dy]) => {
      if (canFlipInDirection(x, y, dx, dy, newBoard, turnColor)) {
        flipStonesInDirection(x, y, dx, dy, newBoard, turnColor);
      }
    });

    const newRoom: RoomModel = { ...room, board: newBoard, currentTurn: room.currentTurn };
    await roomRepository.updateBoard(newRoom);
    return newRoom;
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
