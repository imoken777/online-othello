import type { RoomId } from '$/commonTypesWithClient/ids';
import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Room, UserOnRoom } from '@prisma/client';
import { z } from 'zod';

const toRoomModel = (prismaRoom: Room & { userOnRooms: UserOnRoom[] }): RoomModel => {
  return {
    id: roomIdParser.parse(prismaRoom.roomId),
    board: z.array(z.array(z.number())).parse(prismaRoom.board),
    status: z.enum(['waiting', 'playing', 'ended']).parse(prismaRoom.status),
    createdAt: prismaRoom.createdAt.getTime(),
    currentTurn: prismaRoom.currentTurn,
    winner: prismaRoom.winner ?? undefined,
    userOnRooms: prismaRoom.userOnRooms.map((userOnRoom) => ({
      firebaseId: userOnRoom.firebaseId,
      in: userOnRoom.in.getTime(),
      out: userOnRoom.out !== null ? userOnRoom.out.getTime() : null,
      roomId: roomIdParser.parse(userOnRoom.roomId),
    })),
  };
};

const isOlderThanTwoMinutes = (createdAt: Date) => {
  const twoMinutesInMilliseconds = 2 * 60 * 1000;
  const createdAtDate = new Date(createdAt);
  const now = new Date();
  const difference = now.getTime() - createdAtDate.getTime();
  return difference > twoMinutesInMilliseconds;
};

export const roomRepository = {
  save: async (room: RoomModel) => {
    const transaction = await prismaClient.$transaction(async (prisma) => {
      const createdRoom = await prisma.room.create({
        data: {
          roomId: room.id,
          board: room.board,
          status: room.status,
          createdAt: new Date(room.createdAt),
          currentTurn: room.currentTurn,
        },
      });

      await Promise.all(
        room.userOnRooms.map((userOnRoom) =>
          prisma.userOnRoom.create({
            data: {
              firebaseId: userOnRoom.firebaseId,
              in: new Date(userOnRoom.in),
              out:
                userOnRoom.out !== null && userOnRoom.out !== undefined
                  ? new Date(userOnRoom.out)
                  : null,
              roomId: room.id,
            },
          })
        )
      );

      return createdRoom;
    });
    return transaction;
  },
  updateRoomStatusAndUserStatus: async (room: RoomModel) => {
    const transaction = await prismaClient.$transaction(async (prisma) => {
      const updatedRoom = await prisma.room.update({
        where: { roomId: room.id },
        data: {
          status: room.status,
        },
      });

      await Promise.all(
        room.userOnRooms.map((userOnRoom) =>
          prisma.userOnRoom.upsert({
            where: { firebaseId_roomId: { firebaseId: userOnRoom.firebaseId, roomId: room.id } },
            update: {
              out:
                userOnRoom.out !== null && userOnRoom.out !== undefined
                  ? new Date(userOnRoom.out)
                  : null,
            },
            create: {
              firebaseId: userOnRoom.firebaseId,
              in: new Date(userOnRoom.in),
              out: null,
              roomId: room.id,
            },
          })
        )
      );

      return updatedRoom;
    });
    return transaction;
  },
  finalizeGame: async (room: RoomModel) => {
    const newRoom = await prismaClient.room.update({
      where: { roomId: room.id },
      data: { status: room.status, winner: room.winner },
      include: { userOnRooms: true },
    });
    return toRoomModel(newRoom);
  },
  updateBoard: async (room: RoomModel): Promise<RoomModel> => {
    const newRoom = await prismaClient.room.update({
      where: { roomId: room.id },
      data: { board: room.board, currentTurn: room.currentTurn },
      include: { userOnRooms: true },
    });
    return toRoomModel(newRoom);
  },
  findAll: async (): Promise<RoomModel[]> => {
    const rooms = await prismaClient.room.findMany({
      include: { userOnRooms: true },
    });
    if (rooms.length === 0) {
      return [];
    }

    //不要な部屋を削除
    const filteredRooms = [];
    for (const room of rooms) {
      if (room.status === 'ended' && isOlderThanTwoMinutes(room.createdAt)) {
        await roomRepository.deleteRoomWithUserOnRooms(room.roomId);
      } else {
        filteredRooms.push(room);
      }
    }
    return filteredRooms.map(toRoomModel);
  },
  findById: async (roomId: RoomId): Promise<RoomModel | null> => {
    const room = await prismaClient.room.findFirst({
      where: { roomId },
      include: { userOnRooms: true },
    });
    return room && toRoomModel(room);
  },
  deleteRoomWithUserOnRooms: async (roomId: string) => {
    await prismaClient.$transaction(async (prisma) => {
      await prisma.userOnRoom.deleteMany({ where: { roomId } });
      await prisma.room.delete({ where: { roomId } });
    });
    return;
  },
};
