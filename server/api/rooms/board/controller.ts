import { boardUseCase } from '$/useCase/boardUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: async ({ body, user }) => ({
    status: 201,
    body: await boardUseCase.clickBoard(body.x, body.y, user.id, body.roomId),
  }),
}));
