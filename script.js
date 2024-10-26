let boardSize = 3;
let board = [];
let currentPlayer = 'X';
let gameMode = 'Player';
let coins = parseInt(localStorage.getItem('coins')) || 0;
let unlockedSymbols = JSON.parse(localStorage.getItem('unlockedSymbols')) || ['X', 'O'];
let playerSymbol = 'X';
let aiSymbol = 'O';

// Set initial coin count
document.getElementById('coinCount').textContent = coins;

// Update locker
function updateLocker() {
  const lockerDiv = document.getElementById('unlockedSymbols');
  lockerDiv.innerHTML = '';
  unlockedSymbols.forEach(symbol => {
    const symbolDiv = document.createElement('div');
    symbolDiv.textContent = symbol;
    symbolDiv.classList.add('unlocked');
    symbolDiv.onclick = () => selectSymbol(symbol);
    lockerDiv.appendChild(symbolDiv);
  });
}

// Select game mode
function selectMode(mode) {
  gameMode = mode;
  document.getElementById('settings').classList.remove('hidden');
}

// Start the game
function startGame() {
  board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
  currentPlayer = playerSymbol;
  renderBoard();
  document.getElementById('settings').classList.add('hidden');
  document.getElementById('gameBoard').classList.remove('hidden');
}

// Render the board
function renderBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.textContent = cell || '';
      cellElement.onclick = () => makeMove(rowIndex, colIndex);
      boardElement.appendChild(cellElement);
    });
  });
}

// Make a move
function makeMove(row, col) {
  if (board[row][col]) return;
  board[row][col] = currentPlayer;
  renderBoard();

  if (checkWin(row, col)) {
    alert(`${currentPlayer} wins!`);
    awardCoins(currentPlayer === playerSymbol);
    resetGame();
  } else if (board.flat().every(cell => cell)) {
    alert('It\'s a tie!');
    resetGame();
  } else {
    currentPlayer = currentPlayer === playerSymbol ? aiSymbol : playerSymbol;
    if (gameMode === 'AI' && currentPlayer === aiSymbol) setTimeout(aiMove, 500);
  }
}

// AI Move
function aiMove() {
  let emptyCells = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) emptyCells.push([rowIndex, colIndex]);
    });
  });
  
  const [aiRow, aiCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(aiRow, aiCol);
}

// Check for a win
function checkWin(row, col) {
  const directions = [
    [[0, 1], [0, -1]],
    [[1, 0], [-1, 0]],
    [[1, 1], [-1, -1]],
    [[1, -1], [-1, 1]]
  ];

  return directions.some(direction => {
    return countInDirection(row, col, direction[0]) + countInDirection(row, col, direction[1]) + 1 >= boardSize;
  });
}

function countInDirection(row, col, direction) {
  let count = 0;
  let [dRow, dCol] = direction;
  let newRow = row + dRow;
  let newCol = col + dCol;
  while (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === currentPlayer) {
    count++;
    newRow += dRow;
    newCol += dCol;
  }
  return count;
}

// Award coins to the player and update local storage
function awardCoins(win) {
  if (win) {
    coins += 10;
    localStorage.setItem('coins', coins);
    document.getElementById('coinCount').textContent = coins;
  }
}

// Reset game
function resetGame() {
  board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
  document.getElementById('settings').classList.remove('hidden');
  document.getElementById('gameBoard').classList.add('hidden');
}

// Select symbol
function selectSymbol(symbol) {
  playerSymbol = symbol;
}

// Load locker on start
window.onload = updateLocker;
