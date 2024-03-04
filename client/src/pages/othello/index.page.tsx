import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { BasicHeader } from '../@components/BasicHeader/BasicHeader';
import styles from './othello.module.css';

const Othello = () => {
  const [user] = useAtom(userAtom);
  const [board, setBoard] = useState<number[][]>();

  const fetchBoard = async () => {
    const res = await apiClient.rooms.$get().catch(returnNull);
    if (res === null) {
      const newRoom = await apiClient.rooms.$post();
      setBoard(newRoom.board);
    } else {
      setBoard(res.board);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const clickCell = async (x: number, y: number) => {
    await apiClient.rooms.board.$post({ body: { x, y } });
    await fetchBoard();
  };

  useEffect(() => {
    const canselId = setInterval(fetchBoard, 1000);
    return () => clearInterval(canselId);
  }, []);

  if (!board || !user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.container}>
        <div className={styles.board}>
          {board.map((row, y) =>
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

export default Othello;
