// Initialize core variables for the game state
let coins = parseInt(localStorage.getItem('coins')) || 0;
let unlockedItems = JSON.parse(localStorage.getItem('unlockedItems')) || ['X', 'O'];
let playerSymbol = 'X';
let aiSymbol = 'O';
let boardSize = 3;
let board = [];
let gameMode = 'PvP';
let currentPlayer = playerSymbol;

// Set up initial coin display and update inventory on load
document.getElementById('coins').textContent = coins;
updateLocker();

// Game mode selection
function setGameMode(mode) {
  gameMode = mode;
  document.getElementById('settings').classList.remove('hidden');
}

// Start game with chosen settings
function startGame() {
  board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
  currentPlayer = playerSymbol;
  renderBoard();
  document.getElementById('settings').classList.add('hidden');
  document.getElementById('gameBoard').classList.remove('hidden');
}

// Render Tic Tac Toe board
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

// Making a move
function makeMove(row, col) {
  if (board[row][col]) return;
  board[row][col] = currentPlayer;
  renderBoard();

  if (checkWin(row, col)) {
    alert(`${currentPlayer} wins!`);
    awardCoins();
    resetGame();
  } else if (board.flat().every(cell => cell)) {
    alert('It\'s a tie!');
    resetGame();
  } else {
    currentPlayer = currentPlayer === playerSymbol ? aiSymbol : playerSymbol;
    if (gameMode !== 'PvP' && currentPlayer === aiSymbol) aiMove();
  }
}

// Check for a win
function checkWin(row, col) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  return directions.some(([dx, dy]) => {
    let count = 1;
    count += countInDirection(row, col, dx, dy);
    count += countInDirection(row, col, -dx, -dy);
    return count >= boardSize;
  });
}

// Count symbols in a direction
function countInDirection(row, col, dx, dy) {
  let count = 0;
  let [r, c] = [row + dx, col + dy];
  while (r >= 0 && c >= 0 && r < boardSize && c < boardSize && board[r][c] === currentPlayer) {
    count++;
    r += dx;
    c += dy;
  }
  return count;
}

// Award coins
function awardCoins() {
  coins += 10;
  localStorage.setItem('coins', coins);
  document.getElementById('coins').textContent = coins;
}

// AI move logic
function aiMove() {
  // Implement AI logic here, e.g., random for Easy, smarter for Hard
}

// Update locker UI
function updateLocker() {
  const lockerDiv = document.getElementById('unlockedItems');
  lockerDiv.innerHTML = '';
  unlockedItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.textContent = item;
    itemElement.classList.add('unlocked');
    itemElement.onclick = () => selectItem(item);
    lockerDiv.appendChild(itemElement);
  });
}

// Purchase item in shop
function purchaseItem(item, cost) {
  if (coins >= cost && !unlockedItems.includes(item)) {
    unlockedItems.push(item);
    coins -= cost;
    localStorage.setItem('coins', coins);
    localStorage.setItem('unlockedItems', JSON.stringify(unlockedItems));
    updateLocker();
  }
}
