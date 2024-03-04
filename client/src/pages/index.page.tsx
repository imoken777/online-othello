import type { RoomId } from 'commonTypesWithClient/ids';
import type { RoomModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { userAtom } from '../atoms/user';
import { BasicHeader } from './@components/BasicHeader/BasicHeader';

const Home = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomModel[]>([]);

  const fetchRooms = async () => {
    const res = await apiClient.rooms.$get().catch(returnNull);
    if (!res) return;
    setRooms(res);
  };

  const createRoom = async () => {
    const res = await apiClient.rooms.$post().catch(returnNull);
    if (!res) return;
    setRooms([...rooms, res]);

    router.push(`/${res.id}`);
  };

  const enterTheRoom = async (roomId: RoomId) => {
    const res = await apiClient.rooms.$patch({ body: { roomId } }).catch(returnNull);
    if (res === null) return;
    setRooms([...rooms, res]);

    router.push(`/${res.id}`);
  };

  useEffect(() => {
    const canselId = setInterval(fetchRooms, 1000);
    return () => clearInterval(canselId);
  }, []);

  if (!user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <h1>部屋一覧</h1>
      <ul>
        {rooms.map((room, index) => (
          <li key={room.id} onClick={() => enterTheRoom(room.id)}>
            {index + 1}番号室{room.status} {room.id}
          </li>
        ))}
      </ul>
      <button onClick={createRoom}>部屋を作る</button>
    </>
  );
};

export default Home;
