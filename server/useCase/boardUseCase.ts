import type { UserId } from '$/commonTypesWithClient/ids';
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
  clickBoard: (x: number, y: number, userId: UserId): BoardArray => {
    board[y][x] = userColorUseCase.getUserColor(userId);
    return board;
  },
};
