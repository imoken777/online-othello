import type { RoomId, UserId } from '$/commonTypesWithClient/ids';
import type { RoomModel, userOnRoomModel } from '$/commonTypesWithClient/models';
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
  create: async (userId: UserId): Promise<RoomModel> => {
    const roomId = roomIdParser.parse(randomUUID());

    const userOnRoom: userOnRoomModel = {
      firebaseId: userId,
      in: Date.now(),
      out: null,
      roomId,
    };

    const newRoom: RoomModel = {
      id: roomId,
      board: initBoard(),
      status: 'waiting',
      createdAt: Date.now(),
      userOnRooms: [userOnRoom],
    };
    await roomRepository.save(newRoom);

    return newRoom;
  },
  updateUserInRoom: async (roomId: RoomId, userId: UserId): Promise<RoomModel> => {
    const room = await roomRepository.findById(roomId);
    if (!room) {
      throw new Error('no room');
    }

    //ユーザーがすでに入っているかどうか
    const existingUserIndex = room.userOnRooms.findIndex(
      (userOnRoom) => userOnRoom.firebaseId === userId && userOnRoom.out === null
    );
    let newRoom: RoomModel;

    if (existingUserIndex === -1) {
      //ユーザーが入っていない場合は入室させる
      const userOnRoom: userOnRoomModel = {
        firebaseId: userId,
        in: Date.now(),
        out: null,
        roomId,
      };
      newRoom = { ...room, status: 'playing', userOnRooms: [...room.userOnRooms, userOnRoom] };
    } else {
      //ユーザー入っている場合は退出させる
      //退出処理はoutに現在時刻を入れる
      const newUsers = room.userOnRooms.map((userOnRoom, index) =>
        index === existingUserIndex ? { ...userOnRoom, out: Date.now() } : userOnRoom
      );
      newRoom = { ...room, status: 'ended', userOnRooms: newUsers };
    }

    await roomRepository.update(newRoom);

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