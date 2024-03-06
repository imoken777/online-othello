// 盤面上の指定位置が有効か判断する関数
const isOnBoard = (x: number, y: number, board: number[][]): boolean => {
  return x >= 0 && x < board[0].length && y >= 0 && y < board.length;
};

// 特定の方向に石をひっくり返せるかどうかを判定する関数
export const canFlipInDirection = (
  startX: number,
  startY: number,
  dx: number,
  dy: number,
  board: number[][],
  turnColor: number
): boolean => {
  let x = startX + dx;
  let y = startY + dy;
  let canFlip = false;

  while (isOnBoard(x, y, board)) {
    if (board[y][x] === 0) {
      return false;
    } else if (board[y][x] !== turnColor) {
      canFlip = true;
      x += dx;
      y += dy;
    } else {
      return canFlip;
    }
  }
  return false;
};

// 盤面上の指定位置に石を置けるかどうかを判定する関数
export const canPlaceStone = (
  x: number,
  y: number,
  board: number[][],
  turnColor: number
): boolean => {
  if (board[y][x] !== 0) {
    return false;
  }

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return directions.some(([dx, dy]) => canFlipInDirection(x, y, dx, dy, board, turnColor));
};

// 盤面上の指定位置が相手の石かどうかを判断する関数
const isOpponentStone = (x: number, y: number, board: number[][], turnColor: number): boolean => {
  return board[y][x] !== 0 && board[y][x] !== turnColor;
};

// 盤面上の特定の方向でひっくり返せる石の位置を見つける関数
const findStonesToFlip = (
  startX: number,
  startY: number,
  dx: number,
  dy: number,
  board: number[][],
  turnColor: number
): number[][] => {
  let x = startX + dx;
  let y = startY + dy;
  const path = [];

  // 盤面の範囲内であり、相手の石である間ループ
  while (isOnBoard(x, y, board) && isOpponentStone(x, y, board, turnColor)) {
    path.push([x, y]);
    x += dx;
    y += dy;
  }

  // ループの終了条件が自分の石であれば、pathを返す
  if (isOnBoard(x, y, board) && board[y][x] === turnColor) {
    return path;
  }

  return [];
};

// 盤面上の特定の方向にある石をひっくり返す関数
export const flipStonesInDirection = (
  startX: number,
  startY: number,
  dx: number,
  dy: number,
  board: number[][],
  turnColor: number
): number[][] => {
  const stonesToFlip = findStonesToFlip(startX, startY, dx, dy, board, turnColor);
  for (const [x, y] of stonesToFlip) {
    board[y][x] = turnColor;
  }
  return board;
};

//ゲームエンドを判定する関数
export const isGameEnd = (board: number[][]): boolean => {
  const isBoardFull = !board.some((row) => row.includes(0));
  const isBlackNoPlaceable = !board.some((row, y) =>
    row.some((_, x) => canPlaceStone(x, y, board, 1))
  );
  const isWhiteNoPlaceable = !board.some((row, y) =>
    row.some((_, x) => canPlaceStone(x, y, board, 2))
  );
  return isBoardFull || (isBlackNoPlaceable && isWhiteNoPlaceable);
};

//ゲームの勝者を判定する関数
export const judgeWinner = (board: number[][]): number => {
  const blackCount = board.flat().filter((stone) => stone === 1).length;
  const whiteCount = board.flat().filter((stone) => stone === 2).length;
  if (blackCount === whiteCount) {
    return 0;
  }
  return blackCount > whiteCount ? 1 : 2;
};
