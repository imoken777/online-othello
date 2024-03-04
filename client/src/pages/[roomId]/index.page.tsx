import type { RoomModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
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
    if (!room) return;
    const res = await apiClient.rooms.$patch({ body: { roomId: room.id } }).catch(returnNull);
    if (res === null) return;
    router.push('/');
  };

  const clickCell = async (x: number, y: number) => {
    if (!room) return;
    await apiClient.rooms.board.$post({ body: { x, y, roomId: room.id } });
    await fetchRoom();
  };

  useEffect(() => {
    const cancelId = setInterval(fetchRoom, 1000);
    return () => clearInterval(cancelId);
  });

  if (!room || !user) return <Loading visible />;

  return (
    <>
      <div className={styles.gameScreen}>
        <button onClick={leaveRoom} className={styles.leaveButton}>
          部屋を出る
        </button>
        <div className={styles.gameInfo}>
          <div className={`${styles.playerInfo} ${styles.playerSelf} ${styles.playerLeft}`}>
            自分: {user.id}
          </div>
          <div className={styles.boardContainer}>
            <div className={styles.board}>
              {room.board.map((row, y) =>
                row.map((color, x) => (
                  <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
                    {color !== 0 && (
                      <div
                        className={styles.stone}
                        style={{
                          background: color === 1 ? '#000' : color === 2 ? '#fff' : '#ff0',
                        }}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          {room.userOnRooms
            .filter((userOnRoom) => userOnRoom.out === null && userOnRoom.firebaseId !== user.id)
            .map((userOnRoom) => (
              <div
                key={userOnRoom.firebaseId}
                className={`${styles.playerInfo} ${styles.playerOpponent} ${styles.playerRight}`}
              >
                相手: {userOnRoom.firebaseId}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Room;
