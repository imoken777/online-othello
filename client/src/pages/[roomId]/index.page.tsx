import type { UserId } from 'commonTypesWithClient/ids';
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
  const [placeableMatrix, setPlaceableMatrix] = useState<number[][]>([[]]);

  const fetchRoomData = async () => {
    const resRooms = await apiClient.rooms.$get().catch(returnNull);
    if (!resRooms) return;

    const room = resRooms.find((room) => room.id === roomId);
    if (room) {
      const resMatrix = await apiClient.rooms.board
        .$get({
          query: { roomId: room.id, turnColor: room.currentTurn },
        })
        .catch(returnNull);
      console.table(resMatrix);
      if (resMatrix !== null) {
        setPlaceableMatrix(resMatrix);
        setRoom(room);
      }
    }
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
    await fetchRoomData();
  };

  const judgeColor = (userId: UserId | string): number => {
    const sortedActiveUsers = room?.userOnRooms
      .filter((userOnRoom) => userOnRoom.out === null)
      .sort((a, b) => a.in - b.in);

    const userIndex = sortedActiveUsers?.findIndex(
      (userOnRoom) => userOnRoom.firebaseId === userId
    );
    const userColor = userIndex === 0 ? 1 : 2;
    return userColor;
  };

  useEffect(() => {
    const cancelId = setInterval(fetchRoomData, 1000);
    return () => clearInterval(cancelId);
  });

  if (!room || !user) return <Loading visible />;

  return (
    <>
      <div className={styles.gameScreen}>
        <button onClick={leaveRoom} className={styles.leaveButton}>
          部屋を出る
        </button>
        <p>現在は{room.currentTurn === 1 ? '黒' : '白'}のターン</p>
        <div className={styles.gameInfo}>
          <div className={`${styles.playerInfo} ${styles.playerSelf} ${styles.playerLeft}`}>
            あなたは{judgeColor(user.id) === 1 ? '黒' : '白'}です
          </div>
          <div className={styles.boardContainer}>
            <div className={styles.board}>
              {placeableMatrix.map((row, y) =>
                row.map((color, x) => (
                  <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
                    {color !== 0 && (
                      <div
                        className={`${styles.stone} ${color === -1 ? styles.placeable : ''}`}
                        style={{
                          background: color === 1 ? '#000' : color === 2 ? '#fff' : '',
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
                相手は{judgeColor(userOnRoom.firebaseId) === 1 ? '黒' : '白'}です
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Room;