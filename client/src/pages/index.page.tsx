import type { RoomId } from 'commonTypesWithClient/ids';
import type { RoomModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { userAtom } from '../atoms/user';
import { BasicHeader } from './@components/BasicHeader/BasicHeader';
import styles from './index.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomModel[]>([]);

  const fetchRooms = async () => {
    const res = await apiClient.rooms.$get().catch(returnNull);
    if (!res) return;
    const waitingRooms = res.filter((room) => room.status === 'waiting');
    setRooms(waitingRooms);
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

  const checkActiveRoom = useCallback(async () => {
    console.log('checkActiveRoom');
    const res = await apiClient.rooms.connect.$get().catch(returnNull);
    if (res === null) return;
    router.push(`/${res.id}`);
  }, [router]);

  useEffect(() => {
    checkActiveRoom();

    const cancelId = setInterval(fetchRooms, 1000);
    return () => clearInterval(cancelId);
  }, [checkActiveRoom]);

  if (!user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.roomListContainer}>
        <h1 className={styles.roomListTitle}>部屋一覧</h1>
        <ul className={styles.roomList}>
          {rooms.length === 0 ? (
            <li className={styles.roomItem}>部屋がありません</li>
          ) : (
            rooms.map((room, index) => (
              <li key={room.id} className={styles.roomItem} onClick={() => enterTheRoom(room.id)}>
                {index + 1}番目の部屋
              </li>
            ))
          )}
        </ul>
        <button className={styles.createRoomButton} onClick={createRoom}>
          部屋を作る
        </button>
      </div>
    </>
  );
};

export default Home;
