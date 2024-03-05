import { boardUseCase } from '$/useCase/boardUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({
    status: 200,
    body: await boardUseCase.canPlaceAllStones(query.roomId, query.turnColor),
  }),
  post: async ({ body, user }) => ({
    status: 201,
    body: await boardUseCase.clickBoard(body.x, body.y, user.id, body.roomId),
  }),
}));
