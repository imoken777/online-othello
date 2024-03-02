import type { UserId } from '$/commonTypesWithClient/ids';
import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomRepository } from '$/repository/roomRepository';
import { roomIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';
import { userColorUseCase } from './userColorUseCase';

const initBoard = () => [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

export const roomUseCase = {
  create: async (): Promise<RoomModel> => {
    const newRoom: RoomModel = {
      id: roomIdParser.parse(randomUUID()),
      board: initBoard(),
      status: 'waiting',
      createdAt: Date.now(),
    };
    await roomRepository.save(newRoom);

    return newRoom;
  },
  clickBoard: async (x: number, y: number, userId: UserId): Promise<RoomModel> => {
    const latest = await roomRepository.findLatest();
    if (!latest) {
      throw new Error('no room');
    }
    const newBoard: number[][] = JSON.parse(JSON.stringify(latest.board));

    newBoard[y][x] = userColorUseCase.getUserColor(userId);
    const newRoom: RoomModel = { ...latest, board: newBoard };
    await roomRepository.save(newRoom);
    return newRoom;
  },
};
