console.log('2048 app — script loaded');
const h = document.createElement('h1');
h.textContent = '2048 — загружается...';
document.body.prepend(h);
const app = document.createElement("div");
app.id = "app";

document.body.appendChild(app);

console.log("#app создан");
const topPanel = document.createElement("div");
topPanel.id = "top-panel";

app.appendChild(topPanel);
const title = document.createElement("h2");
title.textContent = "2048";
topPanel.appendChild(title);

const scoreBox = document.createElement("div");
scoreBox.id = "score-box";

scoreBox.innerHTML = `
  <div id="score" style="font-size: 20px; font-weight: bold;">Счёт: 0</div>
  <div id="best" style="font-size: 14px; color: #666;">Рекорд: 0</div>
`;

topPanel.appendChild(scoreBox);

console.log("Заголовок и счет добавлены");

const gridContainer = document.createElement("div");
gridContainer.id = "grid";

app.appendChild(gridContainer);

for (let i = 0; i < 16; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";

  gridContainer.appendChild(cell);
}

console.log("Пустое поле 4x4 создано");

let gameGrid = [];
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;

document.getElementById('best').textContent = `Рекорд: ${bestScore}`;

function renderTiles() {
  const cells = gridContainer.querySelectorAll('.cell');
  cells.forEach(cell => cell.innerHTML = '');

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = gameGrid[r][c];
      if (value === 0) continue;

      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.textContent = value;
      tile.setAttribute('data-value', value);

      const cellIndex = r * 4 + c;
      cells[cellIndex].appendChild(tile);
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
}

function slideAndCombineRow(row) {
  let filtered = row.filter(val => val !== 0);
  let gainedScore = 0;

  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      gainedScore += filtered[i];  // добавляем очки за слияние
      filtered[i + 1] = 0;
      i++; // пропускаем следующую плитку, т.к. она уже объединена
    }
  }
  filtered = filtered.filter(val => val !== 0);
  while (filtered.length < 4) filtered.push(0);

  score += gainedScore;
  updateScore();

  return filtered;
}

function getEmptyCells() {
  const emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (gameGrid[r][c] === 0) emptyCells.push([r, c]);
    }
  }
  return emptyCells;
}

function addRandomTile() {
  const emptyCells = getEmptyCells();
  if (emptyCells.length === 0) return false;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  gameGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function initializeGame() {
  gameGrid = Array(4).fill(null).map(() => Array(4).fill(0));
  score = 0;
  updateScore();

  addRandomTile();
  addRandomTile();

  renderTiles();
}

function moveLeft() {
  console.log("Двигаемся влево");
  for (let r = 0; r < 4; r++) {
    console.log("Старый ряд:", gameGrid[r]);
    gameGrid[r] = slideAndCombineRow(gameGrid[r]);
    console.log("Новый ряд:", gameGrid[r]);
  }
  addRandomTile();
  renderTiles();
  console.log(gameGrid);
}

function moveRight() {
  console.log("Двигаемся вправо");
  for (let r = 0; r < 4; r++) {
    let reversedRow = [...gameGrid[r]].reverse();
    reversedRow = slideAndCombineRow(reversedRow);
    gameGrid[r] = reversedRow.reverse();
  }
  addRandomTile();
  renderTiles();
  console.log(gameGrid);
}

function getColumn(colIndex) {
  return gameGrid.map(row => row[colIndex]);
}

function setColumn(colIndex, newCol) {
  for (let r = 0; r < 4; r++) {
    gameGrid[r][colIndex] = newCol[r];
  }
}

function moveUp() {
  console.log("Двигаемся вверх");
  for (let c = 0; c < 4; c++) {
    let col = getColumn(c);
    col = slideAndCombineRow(col);
    setColumn(c, col);
  }
  addRandomTile();
  renderTiles();
  console.log(gameGrid);
}

function moveDown() {
  console.log("Двигаемся вниз");
  for (let c = 0; c < 4; c++) {
    let col = getColumn(c).reverse();
    col = slideAndCombineRow(col);
    col.reverse();
    setColumn(c, col);
  }
  addRandomTile();
  renderTiles();
  console.log(gameGrid);
}

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const minSwipeDistance = 30;

gridContainer.addEventListener('touchstart', (e) => {
  const touch = e.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

gridContainer.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  touchEndX = touch.clientX;
  touchEndY = touch.clientY;

  handleSwipeGesture();
});

function handleSwipeGesture() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      console.log("Свайп вправо");
      moveRight();
    } else {
      console.log("Свайп влево");
      moveLeft();
    }
  } else {
    if (deltaY > 0) {
      console.log("Свайп вниз");
      moveDown();
    } else {
      console.log("Свайп вверх");
      moveUp();
    }
  }
}

document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowLeft': moveLeft(); break;
    case 'ArrowRight': moveRight(); break;
    case 'ArrowUp': moveUp(); break;
    case 'ArrowDown': moveDown(); break;
  }
});
initializeGame();

const restartBtn = document.createElement('button');
restartBtn.id = 'restart-btn';
restartBtn.textContent = 'Начать заново';

topPanel.appendChild(restartBtn);

function resetGame() {
  score = 0;
  updateScore();

  gameGrid = [];
  for (let i = 0; i < 4; i++) {
    gameGrid.push([0, 0, 0, 0]);
  }

  addRandomTile();
  addRandomTile();

  renderTiles();
}


restartBtn.addEventListener('click', () => {
  resetGame();
});
