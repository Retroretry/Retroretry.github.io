const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

// Слушаем событие 'chat message'
socket.on('chat message', function(data) {
    // data теперь выглядит так: { user: "Хитрый.Бобер", text: "Привет всем" }
    
    const item = document.createElement('li');
    
    // Используем жирный шрифт для имени (тег <b>)
    item.innerHTML = `<b>${data.user}:</b> ${data.text}`;
    
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
