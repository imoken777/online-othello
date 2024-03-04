import type { UserId } from '$/commonTypesWithClient/ids';
import type { RoomModel } from '$/commonTypesWithClient/models';

export const userColorUseCase = {
  getUserColor: (userId: UserId, room: RoomModel) => {
    const sortedActiveUsers = room.userOnRooms
      .filter((user) => user.out === null)
      .sort((a, b) => a.in - b.in);

    const userIndex = sortedActiveUsers.findIndex((user) => user.firebaseId === userId);
    const userColor = userIndex === 0 ? 1 : 2;
    return userColor;
  },
};
