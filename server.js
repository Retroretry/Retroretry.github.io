const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static('public'));

// Словари для никнеймо
const adjectives = ["Голубой", "Лысый", "Отсталый", "Чурка", "Обиженый", "Опущеный", "Синий", "Умствено отсталый"];
const nouns = ["Хуесос", "Долбоёб", "Водолаз", "Жид", "Каха", "Аутист", "Навальный", "Пидор"];

// История сообщений (храним в памяти)
const history = [];
const MAX_HISTORY = 50;

function getRandomWord(array) {
    return array[Math.floor(Math.random() * array.length)];
}

io.on('connection', (socket) => {
    // Генерация никнейма
    const nickname = `${getRandomWord(adjectives)}.${getRandomWord(nouns)}`;
    users[socket.id] = nickname;

    console.log(`Подключился: ${nickname}`);

    // 1. При входе отправляем пользователю историю (чистый текст)
    socket.emit('history', history);

    socket.on('chat message', (msg) => {
        const currentUser = users[socket.id];
        const time = new Date().toLocaleTimeString();
        
        // Лог для консоли и файла
        const logEntry = `[${time}] ${currentUser}: ${msg}\n`;
        console.log(logEntry.trim());

        fs.appendFile('history.log', logEntry, (err) => {
            if (err) console.error(err);
        });

        // Формируем объект сообщения
        const messageData = { user: currentUser, text: msg, time: time };

        // 2. Сохраняем в историю
        history.push(messageData);
        if (history.length > MAX_HISTORY) history.shift();

        // 3. Отправляем всем
        io.emit('chat message', messageData);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
    });
});

http.listen(10000, () => {
    console.log('Сервер запущен на http://localhost:3001');
});
