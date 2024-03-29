import type { RoomId } from '$/commonTypesWithClient/ids';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      roomId: RoomId;
      turnColor: number;
    };
    resBody: number[][];
  };
  post: {
    reqBody: { x: number; y: number; roomId: RoomId };
    resBody: boolean;
  };
}>;
