import type { RoomModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { BasicHeader } from '../@components/BasicHeader/BasicHeader';
import styles from './othello.module.css';

const Room = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const { roomId } = router.query;
  const [room, setRoom] = useState<RoomModel>();

  const fetchRoom = async () => {
    const res = await apiClient.rooms.$get().catch(returnNull);
    if (!res) return;
    res.forEach((room) => {
      if (room.id === roomId) {
        setRoom(room);
      }
    });
  };

  const leaveRoom = async () => {
    const res = await apiClient.rooms.$patch({ body: { roomId } }).catch(returnNull);
    if (res === null) return;
    router.push('/');
  };

  const clickCell = async (x: number, y: number) => {
    await apiClient.rooms.board.$post({ body: { x, y } });
    await fetchRoom();
  };

  useEffect(() => {
    const cancelId = setInterval(fetchRoom, 1000);
    return () => clearInterval(cancelId);
  });

  if (!room || !user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <h1>部屋{room.id}</h1>
      <button onClick={leaveRoom}>部屋を出る</button>
      <div>
        {room.userOnRooms.map((userOnRoom) =>
          userOnRoom.out === null ? (
            <div key={userOnRoom.firebaseId}>{userOnRoom.firebaseId}</div>
          ) : null
        )}
      </div>
      <div className={styles.container}>
        <div className={styles.board}>
          {room.board.map((row, y) =>
            row.map((color, x) => (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
                {color !== 0 && (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : color === 2 ? '#fff' : '#ff0' }}
                  />
                )}
              </div>
            ))
          )}
        </div>
        {/* <div>{turnColor === 1 ? '黒のターン' : '白のターン'}</div>
      <div>
        黒{count_stone(1)} 白{count_stone(2)}
      </div> */}
      </div>
    </>
  );
};

export default Room;
