window.onload = function ()
{
    filename = window.location.href.split("?")[1].split("=")[1];
    alert(filename);

    pdf = document.getElementById("pdf-container");
    viewer = document.getElementById("pdf-viewer");
    filename = "../backend/uploads/" + filename;
    alert(filename)
    viewer.src = filename;
}

async function sendMessageViewPDF() {
    const message = document.getElementById('chatInput').value;
    const chatBox = document.getElementById('chatBox');

    if (chatInput.value.trim() !== '') {
        const message = document.createElement('div');
        message.className = 'user-message';
        message.textContent = chatInput.value;

        chatBox.appendChild(message);
        chatBox.scrollTop = chatBox.scrollHeight; // 保证聊天框自动滚动到最底部

        chatInput.value = ''; // 发送后清空输入框
    }

    const response = await fetch('http://127.0.0.1:5000/chatPDF', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });

    const result = await response.json();

    const p = document.createElement('p');
    p.textContent = result.reply;
    p.classList.add("reply-message");
    chatBox.appendChild(p);
}