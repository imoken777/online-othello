import { roomRepository } from '$/repository/roomRepository';
import { roomUseCase } from '$/useCase/roomUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await roomRepository.getAllRooms() }),
  post: async ({ user }) => ({ status: 201, body: await roomUseCase.createRoom(user.id) }),
  patch: async ({ body, user }) => ({
    status: 201,
    body: await roomUseCase.toggleUserInRoom(body.roomId, user.id),
  }),
}));
