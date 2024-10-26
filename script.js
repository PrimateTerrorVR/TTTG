let boardSize = 3;
let winningCondition = 3;
let board = [];
let currentPlayer = 'X';
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Start the game
function startGame() {
  boardSize = parseInt(document.getElementById('boardSize').value);
  winningCondition = parseInt(document.getElementById('winningCondition').value);
  board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
  currentPlayer = 'X';
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
    updateLeaderboard(currentPlayer);
    resetGame();
  } else if (board.flat().every(cell => cell)) {
    alert('It\'s a tie!');
    resetGame();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

// Check for a win
function checkWin(row, col) {
  const directions = [
    [[0, 1], [0, -1]], // Horizontal
    [[1, 0], [-1, 0]], // Vertical
    [[1, 1], [-1, -1]], // Diagonal
    [[1, -1], [-1, 1]]  // Anti-diagonal
  ];
  return directions.some(direction => {
    return countInDirection(row, col, direction[0]) + countInDirection(row, col, direction[1]) + 1 >= winningCondition;
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

// Update the leaderboard
function updateLeaderboard(winner) {
  leaderboard.push({ player: winner, date: new Date().toLocaleString() });
  leaderboard.sort((a, b) => b.date - a.date);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  displayLeaderboard();
}

// Display leaderboard
function displayLeaderboard() {
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = leaderboard
    .map(entry => `<p>${entry.player} - ${entry.date}</p>`)
    .join('');
}

// Reset the game
function resetGame() {
  document.getElementById('settings').classList.remove('hidden');
  document.getElementById('gameBoard').classList.add('hidden');
  board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
}

// Load leaderboard on page load
window.onload = displayLeaderboard;
