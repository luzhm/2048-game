console.log('2048 app — script loaded');
const h = document.createElement('h1');
h.textContent = '2048 — загружается...';
h.style.textAlign = 'center';
h.style.padding = '20px';
document.body.prepend(h);
const app = document.createElement("div");
app.id = "app";
app.style.maxWidth = "500px";
app.style.margin = "0 auto";
app.style.padding = "20px";

document.body.appendChild(app);

console.log("#app создан");
const topPanel = document.createElement("div");
topPanel.id = "top-panel";
topPanel.style.display = "flex";
topPanel.style.justifyContent = "space-between";
topPanel.style.alignItems = "center";
topPanel.style.marginBottom = "20px";

app.appendChild(topPanel);
const title = document.createElement("h2");
title.textContent = "2048";
title.style.margin = "0";
title.style.fontSize = "32px";
title.style.fontWeight = "bold";
topPanel.appendChild(title);

const scoreBox = document.createElement("div");
scoreBox.id = "score-box";
scoreBox.style.textAlign = "right";

scoreBox.innerHTML = `
  <div id="score" style="font-size: 20px; font-weight: bold;">Счёт: 0</div>
  <div id="best" style="font-size: 14px; color: #666;">Рекорд: 0</div>
`;

topPanel.appendChild(scoreBox);

console.log("Заголовок и счет добавлены");

const gridContainer = document.createElement("div");
gridContainer.id = "grid";
gridContainer.style.display = "grid";
gridContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
gridContainer.style.gap = "10px";
gridContainer.style.background = "#bbada0";
gridContainer.style.padding = "10px";
gridContainer.style.borderRadius = "8px";

app.appendChild(gridContainer);

for (let i = 0; i < 16; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.style.width = "100%";
  cell.style.paddingBottom = "100%";
  cell.style.background = "#cdc1b4";
  cell.style.borderRadius = "6px";
  cell.style.position = "relative";

  gridContainer.appendChild(cell);
}

console.log("Пустое поле 4x4 создано");

let gameGrid = [
  [2, 0, 0, 2],
  [0, 4, 0, 0],
  [0, 0, 8, 0],
  [0, 0, 0, 16]
];

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
      tile.style.position = 'absolute';
      tile.style.top = '0';
      tile.style.left = '0';
      tile.style.width = '100%';
      tile.style.height = '100%';
      tile.style.borderRadius = '6px';
      tile.style.display = 'flex';
      tile.style.alignItems = 'center';
      tile.style.justifyContent = 'center';
      tile.style.fontSize = '24px';
      tile.style.fontWeight = 'bold';
      tile.style.color = '#776e65';
      tile.style.background = '#eee4da';

      const cellIndex = r * 4 + c;
      cells[cellIndex].appendChild(tile);
    }
  }
}

function slideAndCombineRow(row) {
  let filtered = row.filter(val => val !== 0);
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      filtered[i + 1] = 0;
    }
  }
  filtered = filtered.filter(val => val !== 0);
  while (filtered.length < 4) filtered.push(0);
  return filtered;
}

function addRandomTile() {
  const emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (gameGrid[r][c] === 0) emptyCells.push([r, c]);
    }
  }
  if (emptyCells.length === 0) return false;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  gameGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
  return true;
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

document.addEventListener('keydown', (e) => {
  console.log('Нажата клавиша:', e.key);
  if (e.key === 'ArrowLeft') {
    moveLeft();
  }
  if (e.key === 'ArrowRight') {
    moveRight();
  }
});

renderTiles();