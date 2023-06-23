const playerFactory = (name, mark) => {
  const playTurn = (board, cell) => {
    const findIdx = board.cells.findIndex(position => position === cell);
    if (board.boardArray[findIdx] === '') {
      board.render();
      return findIdx;
    }
    return null;
  };

  return { name, mark, playTurn };
};

const boardModule = (() => {
  let boardArray = ['', '', '', '', '', '', '', '', ''];
  const gameBoard = document.querySelector('#board');
  const cells = Array.from(document.querySelectorAll('.cell'));
  let winner = null;

  const render = () => {
    boardArray.forEach((mark, findIdx) => {
      cells[findIdx].textContent = boardArray[findIdx];
    });
  };

  const reset = () => {
    boardArray = ['', '', '', '', '', '', '', '', ''];
  };

  const checkWin = () => {
    const winArrays = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    winArrays.forEach((combo) => {
      if (boardArray[combo[0]]
        && boardArray[combo[0]] === boardArray[combo[1]]
        && boardArray[combo[0]] === boardArray[combo[2]]) {
        winner = 'current';
      }
    });
    return winner || (boardArray.includes('') ? null : 'Tie');
  };

  return {
    render, gameBoard, cells, boardArray, checkWin, reset,
  };
})();

const gamePlay = (() => {
  const playerOneName = document.querySelector('#player1');
  const form = document.querySelector('.player-info');
  const resetBtn = document.querySelector('#reset');
  let currentPlayer;
  let playerOne;
  let computerPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? computerPlayer : playerOne;
  };

  const gameRound = () => {
    const board = boardModule;
    const gameStatus = document.querySelector('.game-status');
    if (currentPlayer.name !== '') {
      gameStatus.textContent = `It's ${currentPlayer.name}'s Turn`;
    } else {
      gameStatus.textContent = 'Board: ';
    }

    board.gameBoard.addEventListener('click', (event) => {
      event.preventDefault();
      if (currentPlayer === playerOne) {
        const play = currentPlayer.playTurn(board, event.target);
        if (play !== null) {
          board.boardArray[play] = `${currentPlayer.mark}`;
          board.render();
          const winStatus = board.checkWin();
          if (winStatus === 'Tie') {
            gameStatus.textContent = 'It`s a tie!';
          } else if (winStatus === null) {
            switchTurn();
            gameStatus.textContent = `It's ${currentPlayer.name}'s Turn`;
            if (currentPlayer === computerPlayer) {
              setTimeout(computerPlayTurn, 500);
            }
          } else {
            gameStatus.textContent = `The winner is ${currentPlayer.name}`;
            board.reset();
            board.render();
          }
        }
      }
    });
  };

  const computerPlayTurn = () => {
    const board = boardModule;
    const emptyCells = board.cells.filter(cell => cell.textContent === '');
    const bestMove = getBestMove(board.boardArray, computerPlayer.mark);
    const computerCell = board.cells[bestMove];
    const play = computerPlayer.playTurn(board, computerCell);
    if (play !== null) {
      board.boardArray[play] = `${computerPlayer.mark}`;
      board.render();
      const winStatus = board.checkWin();
      if (winStatus === 'Tie') {
        document.querySelector('.game-status').textContent = 'It`s a tie!';
      } else if (winStatus === null) {
        switchTurn();
        document.querySelector('.game-status').textContent = `It's ${currentPlayer.name}'s Turn`;
      } else {
        document.querySelector('.game-status').textContent = `The winner is ${currentPlayer.name}`;
        board.reset();
        board.render();
      }
    }
  };

  const getBestMove = (boardArray, mark) => {
    const availableMoves = getAvailableMoves(boardArray);
    let bestMove = null;
    for (let move of availableMoves) {
      const boardCopy = [...boardArray];
      boardCopy[move] = mark;
      if (checkWin(boardCopy, mark)) {
        bestMove = move;
        break;
      }
    }

    if (bestMove === null) {
      const opponentMark = mark === 'X' ? 'O' : 'X';
      for (let move of availableMoves) {
        const boardCopy = [...boardArray];
        boardCopy[move] = opponentMark;
        if (checkWin(boardCopy, opponentMark)) {
          bestMove = move;
          break;
        }
      }
    }

    if (bestMove === null) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      bestMove = availableMoves[randomIndex];
    }

    return bestMove;
  };

  const getAvailableMoves = (boardArray) => {
    const availableMoves = [];
    for (let i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === '') {
        availableMoves.push(i);
      }
    }
    return availableMoves;
  };

  const checkWin = (boardArray, mark) => {
    const winArrays = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winArrays) {
      if (
        boardArray[combo[0]] === mark &&
        boardArray[combo[1]] === mark &&
        boardArray[combo[2]] === mark
      ) {
        return true;
      }
    }

    return false;
  };

  const gameInit = () => {
    if (playerOneName.value !== '') {
      playerOne = playerFactory(playerOneName.value, 'X');
      computerPlayer = playerFactory('Computer', 'O');
      currentPlayer = playerOne;
      gameRound();
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (playerOneName.value !== '') {
      gameInit();
      form.classList.add('hidden');
      document.querySelector('.place').classList.remove('hidden');
      if (currentPlayer === computerPlayer) {
        setTimeout(computerPlayTurn, 500);
      }
    } else {
      alert('Enter your name!');
    }
  });

  resetBtn.addEventListener('click', () => {
    document.querySelector('.game-status').textContent = 'Board: ';
    playerOneName.value = '';
    window.location.reload();
  });

  return {
    gameInit,
  };
})();

gamePlay.gameInit();
