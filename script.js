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