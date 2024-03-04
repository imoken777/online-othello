import { roomRepository } from '$/repository/roomRepository';
import { roomUseCase } from '$/useCase/roomUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await roomRepository.findAll() }),
  post: async ({ user }) => ({ status: 201, body: await roomUseCase.create(user.id) }),
}));
