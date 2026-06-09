const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const words = {};

io.on('connection', (socket) => {
  socket.emit('update', words);

  socket.on('word', (raw) => {
    const word = String(raw).trim().toLowerCase().replace(/[^a-záéíóúüñà-ÿ0-9]/gi, '').slice(0, 30);
    if (!word) return;
    words[word] = (words[word] || 0) + 1;
    io.emit('update', words);
  });

  socket.on('reset', () => {
    Object.keys(words).forEach(k => delete words[k]);
    io.emit('update', words);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
