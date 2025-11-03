const gameBoard = (function () {
  const board = new Array(3);
  for (let i = 0; i < 3; i++) {
    board[i] = new Array(3).fill("");
  }

  let mark;

  const getBoard = () => console.table(board);
  const isFalsy = (n) => (!n && n !== 0) || n < 0;

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

  const markX = (y, x) => {
    if (isFalsy(y) || isFalsy(x)) {
      throw Error("Provide both x and y properly");
    }

    if (board[y][x]) {
      throw Error("Cannot mark the square since it's already marked");
    }

    mark = "X";
    board[y][x] = mark;
    getBoard();
    if (isStreak(y, x, mark)) {
      console.log("X win!");
    }
  };

  const markO = (y, x) => {
    if (isFalsy(y) || isFalsy(x)) {
      throw Error("Provide both x and y properly");
    }

    if (board[y][x]) {
      throw Error("Cannot mark the square since it's already marked");
    }

    mark = "O";
    board[y][x] = mark;
    getBoard();
    if (isStreak(y, x, mark)) {
      console.log("O win!");
    }
  };

  getBoard();

  return {
    getBoard,
    markX,
    markO,
  };
})();
