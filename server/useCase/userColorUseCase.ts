import type { UserId } from '$/commonTypesWithClient/ids';

const userColorDict: { black?: UserId; white?: UserId } = {};

export const userColorUseCase = {
  getUserColor: (userId: UserId) => {
    if (userColorDict.black === userId) {
      return 1;
    } else if (userColorDict.white === undefined) {
      userColorDict.white = userId;
      return 2;
    } else if (userColorDict.black === undefined) {
      userColorDict.black = userId;
      return 1;
    } else {
      userColorDict.white = userId;
      return 2;
    }
  },
};
