import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomRepository } from '$/repository/roomRepository';
import { roomIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

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
};
