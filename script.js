const gameBoard = (function () {
  const board = new Array(3);

  const isValid = (n) => Number.isInteger(n) && isBound(n);
  const isBound = (n) => 0 <= n && n < 3;

  const isRowStreak = (y, mark) => {
    for (let i = 0; i < 3; i++) {
      if (board[y][i] !== mark) {
        return false;
      }
    }

    return true;
  };

  const isColumnStreak = (x, mark) => {
    for (let i = 0; i < 3; i++) {
      if (board[i][x] !== mark) {
        return false;
      }
    }

    return true;
  };

  const isDiagonalStreak = (mark) => {
    for (let i = 0; i < 3; i++) {
      if (board[i][i] !== mark) {
        return false;
      }
    }

    return true;
  };

  const isAntiDiagonalStreak = (mark) => {
    for (let i = 2; i >= 0; i--) {
      if (board[2 - i][i] !== mark) {
        return false;
      }
    }

    return true;
  };

  const isStreak = (y, x, mark) => {
    if (
      isRowStreak(y, mark) ||
      isColumnStreak(x, mark) ||
      isDiagonalStreak(mark) ||
      isAntiDiagonalStreak(mark)
    ) {
      return true;
    }
  };

  const getBoard = () => console.table(board);

  const setBoard = () => {
    for (let i = 0; i < 3; i++) {
      board[i] = new Array(3).fill("");
    }
    getBoard();
  };

  const markSquare = (y, x, player) => {
    if (!isValid(y) || !isValid(x)) {
      throw new Error("x and y must be an integer between 0 and 2");
    }

    if (board[y][x]) {
      throw new Error("Cannot mark the square since it's already marked");
    }

    mark = player.getMark();
    board[y][x] = mark;
    getBoard();
    if (isStreak(y, x, mark)) {
      console.log(`${player.getName()} win!`);
    }
  };

  setBoard();

  return {
    getBoard,
    setBoard,
    markSquare,
  };
})();

const createPlayer = function (name, mark) {
  const getName = () => name;
  const getMark = () => mark;

  return {
    getName,
    getMark,
  };
};
