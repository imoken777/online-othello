import type { RoomModel } from '$/commonTypesWithClient/models';
import { convertToBlackOrWhite } from 'src/utils/userColor';
import styles from './GameInfo.module.css';

type GameInfoProps = {
  myColor: number;
  room: RoomModel;
};

export const GameInfo = ({ myColor, room }: GameInfoProps) => {
  const countStone = (color: number) => {
    return room.board.flat().filter((c) => c === color).length;
  };

  const convertColorToString = (color: number) => {
    return color === myColor ? 'あなた' : '相手';
  };

  const myColorStyle = convertToBlackOrWhite(myColor);
  const opponentColorStyle = convertToBlackOrWhite(2 / myColor);
  return (
    <div className={styles.gameInfo}>
      <div className={styles.playerInfo}>
        あなた
        <div
          className={styles.stone}
          style={{
            background: myColorStyle,
            color: opponentColorStyle,
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
            background: opponentColorStyle,
            color: myColorStyle,
          }}
        >
          {countStone(2 / myColor)}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
