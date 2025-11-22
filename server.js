const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static('public'));

// Словари для никнеймов
const adjectives = ["Голубой", "Лысый", "Отсталый", "Чурка", "Обиженый", "Опущеный", "Синий", "Умствено отсталый"];
const nouns = ["Хуесос", "Долбоёб", "Водолаз", "Жид", "Каха", "Аутист", "Навальный", "Пидор"];

// Здесь мы будем хранить никнеймы: { socketId: 'Быстрый.Енот' }
const users = {};

// Функция для выбора случайного слова
function getRandomWord(array) {
    return array[Math.floor(Math.random() * array.length)];
}

io.on('connection', (socket) => {
    // Генерируем никнейм при подключении
    const nickname = `${getRandomWord(adjectives)}.${getRandomWord(nouns)}`;
    users[socket.id] = nickname; // Запоминаем пользователя

    console.log(`Подключился: ${nickname}`);

    // Отправляем сообщение
    socket.on('chat message', (msg) => {
        const currentUser = users[socket.id];
        const time = new Date().toLocaleTimeString();
        
        // Формируем строку для лога и консоли
        const logEntry = `[${time}] ${currentUser}: ${msg}\n`;
        
        console.log(logEntry.trim());

        // Запись в файл (как ты просил ранее)
        fs.appendFile('history.log', logEntry, (err) => {
            if (err) console.error(err);
        });

        // Важно: теперь мы отправляем ОБЪЕКТ, а не просто текст
        io.emit('chat message', { user: currentUser, text: msg });
    });

    socket.on('disconnect', () => {
        console.log(`Отключился: ${users[socket.id]}`);
        delete users[socket.id]; // Удаляем из памяти
    });
});

http.listen(3001, () => {
    console.log('Сервер запущен на http://localhost:3001');
});
