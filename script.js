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

  const getBoard = () => board;

  const setBoard = () => {
    for (let i = 0; i < 3; i++) {
      board[i] = new Array(3).fill("");
    }
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

const flowController = (function () {
  const players = new Array();

  const isDuplicate = (name, mark) => {
    return players.some(
      (player) => player.getName() === name || player.getMark === mark
    );
  };

  const startGame = () => gameBoard.getBoard();
  const resetGame = () => {
    gameBoard.setBoard();
    gameBoard.getBoard();
  };

  const createPlayer = (name, mark) => {
    if (isDuplicate(name, mark)) {
      throw new Error("Name or mark already taken");
    }

    const getName = () => name;
    const getMark = () => mark;
    const newPlayer = { getName, getMark };

    players.push(newPlayer);

    return newPlayer;
  };

  const getPlayers = () => players;

  return {
    startGame,
    resetGame,
    createPlayer,
    getPlayers,
  };
})();

const domController = (function () {

})();
