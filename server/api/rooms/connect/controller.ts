import { roomRepository } from '$/repository/roomRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ user }) => ({ status: 200, body: await roomRepository.findActiveRooms(user.id) }),
}));
