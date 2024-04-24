import { useEffect } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { judgeColor } from 'src/utils/userColor';
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
    if (room.winner === undefined) return;
    const winner = convertColorToString(room.winner);
    alert(`${winner}の勝ちです`);
    leaveRoom();
  };

  const defineCellStyle = (color: number) => {
    return color === -1
      ? room.currentTurn === myColor
        ? `${styles.stone} ${styles.placeable}`
        : ''
      : styles.stone;
  };

  const convertColorToString = (color: number) => {
    return color === myColor ? 'あなた' : '相手';
  };

  const convertToBlackOrWhite = (color: number) => {
    return color === 1 ? '#000' : color === 2 ? '#fff' : '';
  };

  const countStone = (color: number) => {
    return room.board.flat().filter((c) => c === color).length;
  };

  return (
    <>
      <div className={styles.gameScreen}>
        <div className={styles.gameInfo}>
          <div className={styles.playerInfo}>
            あなた
            <div
              className={styles.stone}
              style={{
                background: convertToBlackOrWhite(myColor),
                color: convertToBlackOrWhite(2 / myColor),
              }}
            >
              {countStone(myColor)}
            </div>
          </div>

          {room.status === 'waiting' ? (
            <p>対戦相手を待っています</p>
          ) : (
            <p>{convertColorToString(room.currentTurn)}のターン</p>
          )}
          <div className={styles.playerInfo}>
            相手
            <div
              className={styles.stone}
              style={{
                background: convertToBlackOrWhite(2 / myColor),
                color: convertToBlackOrWhite(myColor),
              }}
            >
              {countStone(2 / myColor)}
            </div>
          </div>
        </div>
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
    </>
  );
};

export default OthelloRoom;
