import { useEffect } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { convertToBlackOrWhite, judgeColor } from 'src/utils/userColor';
import GameInfo from '../@components/GameInfo/GameInfo';
import { useRoomData } from '../@hooks/useRoomData';
import styles from './index.module.css';

const OthelloRoom = () => {
  const { room, user, router, placeableMatrix, fetchAndSetRoomData } = useRoomData();

  useEffect(() => {
    if (room?.winner === 1 || room?.winner === 2) {
      handleGameEnd();
      return;
    }
    if (room?.status === 'ended') {
      handleOpponentLeave();
      return;
    }

    const cancelId = setInterval(fetchAndSetRoomData, 1000);
    return () => clearInterval(cancelId);
  });

  if (room === undefined || !user) return <Loading visible />;

  const myColor = judgeColor(user.id, room);

  const leaveRoom = async () => {
    const res = await apiClient.rooms.$patch({ body: { roomId: room.id } }).catch(returnNull);
    if (res === null) return;
    await router.push('/');
  };

  const clickCell = async (x: number, y: number) => {
    const isFlipStone = await apiClient.rooms.board.$post({ body: { x, y, roomId: room.id } });
    if (!isFlipStone) return;
    await fetchAndSetRoomData();
  };

  const handleOpponentLeave = () => {
    alert('対戦相手が部屋を出たため、対局が終了しました');
    leaveRoom();
  };

  const handleGameEnd = () => {
    const winner = room.winner === myColor ? 'あなた' : '相手';
    alert(`${winner}の勝ちです`);
    leaveRoom();
  };

  const defineCellStyle = (color: number) => {
    if (color === -1) {
      if (room.currentTurn === myColor) {
        return `${styles.stone} ${styles.placeable}`;
      } else {
        return '';
      }
    } else {
      return styles.stone;
    }
  };

  return (
    <div className={styles.gameScreen}>
      {GameInfo({ myColor, room })}
      <div className={styles.boardContainer}>
        <div className={styles.board}>
          {placeableMatrix.map((row, y) =>
            row.map((color, x) => (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
                {color !== 0 && (
                  <div
                    className={`${defineCellStyle(color)}`}
                    style={{
                      background: convertToBlackOrWhite(color),
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <button onClick={leaveRoom} className={styles.leaveButton}>
        部屋を出る
      </button>
    </div>
  );
};

export default OthelloRoom;
