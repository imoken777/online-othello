import type { RoomId } from 'commonTypesWithClient/ids';
import type { RoomModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';

export const useRoomData = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const { roomId } = router.query;
  const [room, setRoom] = useState<RoomModel>();
  const [placeableMatrix, setPlaceableMatrix] = useState<number[][]>([[]]);

  const fetchRooms = async () => {
    const res = await apiClient.rooms.$get().catch(returnNull);
    if (!res) return null;
    return res;
  };

  const fetchPlaceableMatrix = async (roomId: RoomId, turnColor: number) => {
    const res = await apiClient.rooms.board
      .$get({ query: { roomId, turnColor } })
      .catch(returnNull);
    if (!res) return null;
    return res;
  };

  const fetchAndSetRoomData = async () => {
    const rooms = await fetchRooms();
    if (!rooms) return;

    const room = rooms.find((room) => room.id === roomId);
    if (!room) return;

    const placeableMatrix = await fetchPlaceableMatrix(room.id, room.currentTurn);
    if (!placeableMatrix) return;

    setPlaceableMatrix(placeableMatrix);
    setRoom(room);
  };

  return { room, user, router, placeableMatrix, fetchAndSetRoomData };
};
