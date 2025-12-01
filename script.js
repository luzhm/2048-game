const gridContainer = document.getElementById('grid');
let gameGrid = [];
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
document.getElementById('best').textContent = `Рекорд: ${bestScore}`;
let prevState = null;

for (let i = 0; i < 16; i++) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  gridContainer.appendChild(cell);
}

function savePrevState() {
  prevState = {
    grid: gameGrid.map(row => row.slice()),
    score
  };
}

function renderTiles() {
  const cells = gridContainer.querySelectorAll('.cell');
  cells.forEach(cell => cell.replaceChildren());

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = gameGrid[r][c];
      if (val === 0) continue;

      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.textContent = val;
      tile.setAttribute('data-value', val);

      const index = r * 4 + c;
      cells[index].appendChild(tile);
    }
  }
}

function updateScore() {
  document.getElementById('score').textContent = `Счёт: ${score}`;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
    document.getElementById('best').textContent = `Рекорд: ${bestScore}`;
  }

  saveGameState();
}

function slideAndCombineRow(row) {
  let filtered = row.filter(v => v !== 0);
  let gained = 0;

  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      gained += filtered[i];
      filtered[i + 1] = 0;
      i++;
    }
  }

  filtered = filtered.filter(v => v !== 0);
  while (filtered.length < 4) filtered.push(0);

  score += gained;
  updateScore();
  return filtered;
}

function getColumn(c) {
  return gameGrid.map(row => row[c]);
}

function setColumn(c, newCol) {
  for (let r = 0; r < 4; r++) {
    gameGrid[r][c] = newCol[r];
  }
}

function getEmptyCells() {
  const empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (gameGrid[r][c] === 0) empty.push([r, c]);
    }
  }
  return empty;
}

function addRandomTiles(count = 1) {
  const empty = getEmptyCells();
  if (empty.length === 0) return false;

  const tilesToAdd = Math.min(count, empty.length);
  for (let i = 0; i < tilesToAdd; i++) {
    const index = Math.floor(Math.random() * empty.length);
    const [r, c] = empty.splice(index, 1)[0];
    gameGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    setTimeout(() => {
      const cells = gridContainer.querySelectorAll('.cell');
      const cell = cells[r * 4 + c];
      const tile = cell.querySelector('.tile');
      if (tile) tile.classList.add('pop');
    }, 10);
  }
}



function initializeGame() {
  gameGrid = Array(4).fill(null).map(() => Array(4).fill(0));
  score = 0;
  prevState = null;

addRandomTiles(Math.floor(Math.random() * 3) + 1);


  updateScore();
  renderTiles();
  localStorage.removeItem('gameState');
}

function moveLeft() {
  savePrevState();
  for (let r = 0; r < 4; r++) {
    gameGrid[r] = slideAndCombineRow(gameGrid[r]);
  }
  addRandomTiles(Math.random() < 0.5 ? 1 : 2);
  renderTiles();
  checkGameOver();
  saveGameState(); 
}

function moveRight() {
  savePrevState();
  for (let r = 0; r < 4; r++) {
    let rev = [...gameGrid[r]].reverse();
    rev = slideAndCombineRow(rev);
    gameGrid[r] = rev.reverse();
  }
  addRandomTiles(Math.random() < 0.5 ? 1 : 2);
  renderTiles();
  checkGameOver();
  saveGameState(); 
}

function moveUp() {
  savePrevState();
  for (let c = 0; c < 4; c++) {
    let col = getColumn(c);
    col = slideAndCombineRow(col);
    setColumn(c, col);
  }
  addRandomTiles(Math.random() < 0.5 ? 1 : 2);
  renderTiles();
  checkGameOver();
  saveGameState(); 
}

function moveDown() {
  savePrevState();
  for (let c = 0; c < 4; c++) {
    let col = getColumn(c).reverse();
    col = slideAndCombineRow(col);
    col.reverse();
    setColumn(c, col);
  }
  addRandomTiles(Math.random() < 0.5 ? 1 : 2);
  renderTiles();
  checkGameOver();
  saveGameState(); 
}

function checkGameOver() {
  const empty = getEmptyCells();
  let canMove = empty.length > 0;

  if (!canMove) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (gameGrid[r][c] === gameGrid[r][c + 1]) canMove = true;
      }
    }
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (gameGrid[r][c] === gameGrid[r + 1][c]) canMove = true;
      }
    }
  }

  if (!canMove) showGameOverModal();
}

function showGameOverModal() {
  const modal = document.getElementById('gameover-modal');
  modal.classList.add('visible');
  document.getElementById('final-score').textContent = score;
}

function saveScore() {
  const name = document.getElementById('player-name').value || 'Игрок';
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');

  leaderboard.push({ name, score, date: new Date().toLocaleString() });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
  const msg = document.getElementById('save-message');
  msg.style.display = 'block';

  document.getElementById('player-name').style.display = 'none';
  document.getElementById('save-score-btn').style.display = 'none';

  setTimeout(() => {
    document.getElementById('gameover-modal').classList.remove('visible');
    msg.style.display = 'none';
    document.getElementById('player-name').style.display = 'inline-block';
    document.getElementById('save-score-btn').style.display = 'inline-block';
    document.getElementById('player-name').value = '';
    showLeaderboard();
  }, 1800);
}


function showLeaderboard() {
  const panel = document.getElementById('leaderboard-panel');
  const list = document.getElementById('leaders-list');
  list.replaceChildren();

  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} — ${entry.score} (${entry.date})`;
    list.appendChild(li);
  });

  panel.classList.add('visible');
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowLeft': moveLeft(); break;
    case 'ArrowRight': moveRight(); break;
    case 'ArrowUp': moveUp(); break;
    case 'ArrowDown': moveDown(); break;
  }
});

document.getElementById('restart-btn').addEventListener('click', initializeGame);
document.getElementById('undo-btn').addEventListener('click', () => {
  if (!prevState) return;
  gameGrid = prevState.grid.map(row => row.slice());
  score = prevState.score;
  prevState = null;
  renderTiles();
  updateScore();
});

document.getElementById('save-score-btn').addEventListener('click', saveScore);
document.getElementById('leaders-btn').addEventListener('click', showLeaderboard);
document.getElementById('close-lb-btn').addEventListener('click', () => {
  document.getElementById('leaderboard-panel').classList.remove('visible');
});

let touchStartX = 0, touchStartY = 0;

gridContainer.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

gridContainer.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    dx > 0 ? moveRight() : moveLeft();
  } else {
    dy > 0 ? moveDown() : moveUp();
  }
});

function saveGameState() {
  localStorage.setItem('gameState', JSON.stringify({ grid: gameGrid, score }));
}
function loadGameState() {
  const saved = JSON.parse(localStorage.getItem('gameState'));
  if (saved && saved.grid) {
    gameGrid = saved.grid.map(row => row.slice());
    score = saved.score || 0;
    renderTiles();
    updateScore();
  } else {
    initializeGame();
  }
}

loadGameState();

