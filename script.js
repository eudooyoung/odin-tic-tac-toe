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
  let turn = null;
  let playerInfo = "";

  const startGame = () => gameBoard.setBoard();
  const resetGame = () => {
    gameBoard.setBoard();
    gameBoard.getBoard();
  };

  const setPlayer = (name, mark) => {
    if (isDuplicate(name, mark)) {
      throw new Error("Name or mark already taken");
    }

    const getName = () => name;
    const getMark = () => mark;
    const newPlayer = { getName, getMark };

    players.push(newPlayer);
  };
  const getPlayerByName = (name) =>
    players.find((player) => player.name === name);
  const getPlayerByMark = (mark) =>
    players.find((player) => player.mark === mark);
  const getPlayers = () => players;

  const setPlayerInfo = (player) => {
    playerInfo = `${player.getName()}'s turn (${player.getMark()})`;
  };
  const getPlayerInfo = () => playerInfo;

  const setTurn = (player) => {
    turn = player;
    setPlayerInfo(player);
  };
  const getTurn = () => turn;

  const isDuplicate = (name, mark) => {
    return players.some(
      (player) => player.getName() === name || player.getMark === mark
    );
  };

  return {
    startGame,
    resetGame,
    setPlayer,
    getPlayerByName,
    getPlayerByMark,
    getPlayers,
    setTurn,
    getTurn,
    setPlayerInfo,
    getPlayerInfo,
  };
})();

const domController = (function () {
  const formContainer = document.querySelector(".form-container");
  const startButton = document.querySelector(".button.start");
  const boardContainer = document.querySelector(".board-container");
  const playerInfo = document.querySelector(".player-info");
  const board = document.querySelector(".board");
  const boardData = gameBoard.getBoard();
  const players = gameBoard.getPlayers();

  startButton.addEventListener("click", (e) => {
    e.preventDefault();

    const playerXName = document.querySelector("#player-x").value || "Player X";
    const playerOName = document.querySelector("#player-o").value || "Player O";

    flowController.setPlayer(playerXName, "X");
    flowController.setPlayer(playerOName, "O");

    const playerX = flowController.getPlayerByMark("X");

    flowController.setTurn(playerX);
    playerInfo.textContent = flowController.getPlayerInfo();

    formContainer.style.display = "none";
    boardContainer.style.display = "grid";
  });

  board.childNodes.forEach((square) => {
    square.addEventListener("click", () => {
      const classNames = square.getAttribute("class").split(" ");
      const row = Number(classNames[1].at(-1));
      const col = Number(classNames[2].at(-1));
      const player = flowController.getTurn();

      gameBoard.markSquare(row, col, player);
      square.textContent = boardData[row][col];

      flowController.setTurn();
    });
  });
})();
