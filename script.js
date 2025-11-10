const gameBoard = (function () {
  const board = new Array(3);

  const isValid = (n) => Number.isInteger(n) && isBound(n);
  const isBound = (n) => 0 <= n && n < 3;
  const isBoardFull = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          return false;
        }
      }
    }

    return true;
  };

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
    if (isStreak(y, x, mark)) {
      return flowController.endGame();
    }
  };

  setBoard();

  return {
    getBoard,
    setBoard,
    markSquare,
    isBoardFull,
  };
})();

const flowController = (function () {
  const players = new Array();
  let isGameEnd = false;

  const startGame = () => gameBoard.setBoard();
  const resetGame = () => {
    gameBoard.setBoard();
    gameBoard.getBoard();
  };
  const endGame = () => {
    isGameEnd = true;
    return isGameEnd;
  };

  const createPlayer = (name, mark, turn) => {
    if (isDuplicate(name, mark)) {
      throw new Error("Name or mark already taken");
    }
    let _turn = Boolean(turn);

    const getName = () => name;
    const getMark = () => mark;
    const isTurn = () => _turn;
    const setTurn = (newTurn) => (_turn = Boolean(newTurn));

    const player = { getName, getMark, isTurn, setTurn };

    players.push(player);

    return player;
  };

  const getPlayerByName = (name) =>
    players.find((player) => player.getName() === name);

  const getPlayerByMark = (mark) =>
    players.find((player) => player.getMark() === mark);

  const getPlayerByTurn = (turn) =>
    players.find((player) => player.isTurn() === Boolean(turn));

  const getPlayers = () => players;

  const getPlayerInfo = () => {
    const player = getPlayerByTurn(true);
    return `${player.getName()}'s turn: ${player.getMark()}`;
  };

  const getGameResult = () => {
    const player = getPlayerByTurn(true);
    return `${player.getName()} Win!`;
  };

  const createTurn = () => {
    let currentPlayer = null;
    let nextPlayer = null;

    const setCurrentPlayer = () => (currentPlayer = getPlayerByTurn(true));
    const getCurrentPlayer = () => currentPlayer;
    const setNextPlayer = () => (nextPlayer = getPlayerByTurn(false));
    const getNextPlayer = () => nextPlayer;

    const toggle = () => {
      currentPlayer.setTurn(false);
      nextPlayer.setTurn(true);

      setCurrentPlayer();
      setNextPlayer();
    };

    return {
      setCurrentPlayer,
      getCurrentPlayer,
      setNextPlayer,
      getNextPlayer,
      toggle,
    };
  };

  const isDuplicate = (name, mark) => {
    return players.some(
      (player) => player.getName() === name || player.getMark() === mark
    );
  };

  return {
    startGame,
    resetGame,
    endGame,
    createPlayer,
    getPlayerByName,
    getPlayerByMark,
    getPlayerByTurn,
    getPlayers,
    getPlayerInfo,
    getGameResult,
    createTurn,
  };
})();

const domController = (function () {
  const formContainer = document.querySelector(".form-container");
  const startButton = document.querySelector(".button.start");
  const boardContainer = document.querySelector(".board-container");
  const playerInfo = document.querySelector(".player-info");
  const board = document.querySelector(".board");
  const boardData = gameBoard.getBoard();
  let turn = flowController.createTurn();
  

  startButton.addEventListener("click", (e) => {
    e.preventDefault();

    const playerXName = document.querySelector("#player-x").value || "Player X";
    const playerOName = document.querySelector("#player-o").value || "Player O";

    flowController.createPlayer(playerXName, "X", true);
    flowController.createPlayer(playerOName, "O", false);

    turn.setCurrentPlayer();
    turn.setNextPlayer();

    playerInfo.textContent = flowController.getPlayerInfo();

    formContainer.style.display = "none";
    boardContainer.style.display = "grid";
  });

  board.childNodes.forEach((square) => {
    square.addEventListener("click", function handleMarkingSquare() {
      const classNames = square.getAttribute("class").split(" ");
      const row = Number(classNames[1].at(-1));
      const col = Number(classNames[2].at(-1));
      const currentPlayer = turn.getCurrentPlayer();
      const result = gameBoard.markSquare(row, col, currentPlayer);

      square.textContent = boardData[row][col];

      if (result === true && gameBoard.isBoardFull()) {
        playerInfo.textContent = "Draw!";
        square.removeEventListener("click", handleMarkingSquare);
      } else if (result === true) {
        playerInfo.textContent = flowController.getGameResult();
        square.removeEventListener("click", handleMarkingSquare);
      } else {
        turn.toggle();
        playerInfo.textContent = flowController.getPlayerInfo();
      }
    });
  });
})();
