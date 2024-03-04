import type { RoomId, UserId } from '$/commonTypesWithClient/ids';
import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomRepository } from '$/repository/roomRepository';
import { userColorUseCase } from './userColorUseCase';

export type BoardArray = number[][];

const board: BoardArray = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

export const boardUseCase = {
  clickBoard: async (x: number, y: number, userId: UserId, roomId: RoomId): Promise<RoomModel> => {
    const room = await roomRepository.findById(roomId);
    if (!room) {
      throw new Error('no room');
    }
    const newBoard: number[][] = JSON.parse(JSON.stringify(room.board));

    newBoard[y][x] = userColorUseCase.getUserColor(userId, room);
    const newRoom: RoomModel = { ...room, board: newBoard };
    await roomRepository.updateBoard(newRoom);
    return newRoom;
  },
};
