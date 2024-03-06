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
    checkActiveRoom(res);
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

  //プレイ中の部屋があるかチェックする関数
  const checkActiveRoom = useCallback(
    async (allRooms: RoomModel[]) => {
      if (!user?.id) return;

      const activeRoom = allRooms.find((room) =>
        room.userOnRooms.some(
          (userOnRoom) => userOnRoom.firebaseId === user.id && userOnRoom.out === null
        )
      );

      if (!activeRoom || activeRoom.status === 'ended') return;

      const confirmReconnect = window.confirm('プレイ中のゲームがあります。再接続しますか？');
      if (confirmReconnect) {
        router.push(`/${activeRoom.id}`);
      } else {
        //退出処理
        await apiClient.rooms.$patch({ body: { roomId: activeRoom.id } });
      }
    },
    [router, user?.id]
  );

  useEffect(() => {
    const cancelId = setInterval(fetchRooms, 1000);
    return () => clearInterval(cancelId);
  });

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
