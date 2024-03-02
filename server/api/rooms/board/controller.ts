import { roomUseCase } from '$/useCase/roomUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: async ({ body, user }) => ({
    status: 201,
    body: await roomUseCase.clickBoard(body.x, body.y, user.id),
  }),
}));
