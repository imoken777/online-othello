import type { RoomId } from '$/commonTypesWithClient/ids';
import type { RoomModel } from '$/commonTypesWithClient/models';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: RoomModel[];
  };
  post: {
    resBody: RoomModel;
  };
  patch: {
    reqBody: { roomId: RoomId };
    resBody: RoomModel;
  };
}>;
