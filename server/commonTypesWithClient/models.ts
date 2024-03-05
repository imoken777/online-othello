import { z } from 'zod';
import { taskIdParser } from '../service/idParsers';
import type { RoomId, UserId } from './ids';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export type userOnRoomModel = {
  firebaseId: string;
  in: number;
  out?: number | null;
  roomId: RoomId;
};

export type RoomModel = {
  id: RoomId;
  board: number[][];
  status: 'waiting' | 'playing' | 'ended';
  createdAt: number;
  currentTurn: number;
  userOnRooms: userOnRoomModel[];
};

export const taskParser = z.object({
  id: taskIdParser,
  label: z.string(),
  done: z.boolean(),
  created: z.number(),
});

export type TaskModel = z.infer<typeof taskParser>;
