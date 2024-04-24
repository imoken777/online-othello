import type { UserId } from 'commonTypesWithClient/ids';
import type { RoomModel } from 'commonTypesWithClient/models';

export const judgeColor = (userId: UserId | string, room: RoomModel): number => {
  const sortedActiveUsers = room?.userOnRooms
    .filter((userOnRoom) => userOnRoom.out === null)
    .sort((a, b) => a.in - b.in);

  const userIndex = sortedActiveUsers?.findIndex((userOnRoom) => userOnRoom.firebaseId === userId);
  const userColor = userIndex === 0 ? 1 : 2;
  return userColor;
};

export const convertToBlackOrWhite = (color: number) => {
  return color === 1 ? '#000' : color === 2 ? '#fff' : '';
};
