import type { RoomModel } from '$/commonTypesWithClient/models';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    reqBody: { x: number; y: number };
    resBody: RoomModel;
  };
}>;
