const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// === ФУНКЦИЯ: Добавить сообщение на экран ===
function addMessageToScreen(data) {
    const item = document.createElement('li');
    
    // Просто выводим текст как есть
    item.innerHTML = `<small style="color:grey">[${data.time}]</small> <b>${data.user}:</b> ${data.text}`;
    
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

// === ОТПРАВКА ===
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        // Отправляем обычный текст
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

// === ПОЛУЧЕНИЕ НОВОГО СООБЩЕНИЯ ===
socket.on('chat message', function(data) {
    addMessageToScreen(data);
});

// === ПОЛУЧЕНИЕ ИСТОРИИ ===
socket.on('history', function(historyArray) {
    messages.innerHTML = ''; // Очистить перед загрузкой
    
    historyArray.forEach(function(data) {
        addMessageToScreen(data);
    });

    if (historyArray.length > 0) {
        const info = document.createElement('li');
        info.style.textAlign = 'center';
        info.style.color = '#888';
        info.style.fontSize = '12px';
        info.textContent = '--- История переписки загружена ---';
        messages.appendChild(info);
    }
});
