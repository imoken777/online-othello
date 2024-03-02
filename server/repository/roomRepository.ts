import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Room } from '@prisma/client';
import { z } from 'zod';

const toRoomModel = (prismaRoom: Room): RoomModel => {
  return {
    id: roomIdParser.parse(prismaRoom.roomId),
    board: z.array(z.array(z.number())).parse(prismaRoom.board),
    status: z.enum(['waiting', 'playing', 'ended']).parse(prismaRoom.status),
    createdAt: prismaRoom.createdAt.getTime(),
  };
};

export const roomRepository = {
  save: async (room: RoomModel) => {
    await prismaClient.room.upsert({
      where: { roomId: room.id },
      update: { status: room.status, board: room.board },
      create: {
        roomId: room.id,
        board: room.board,
        status: room.status,
        createdAt: new Date(room.createdAt),
      },
    });
  },
  findLatest: async (): Promise<RoomModel | null> => {
    const room = await prismaClient.room.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    return room && toRoomModel(room);
  },
};
