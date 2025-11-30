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