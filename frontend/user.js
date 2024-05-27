window.onload = function ()
{
    fetchDocuments();
}


async function uploadFiles() {
    const files = document.getElementById('fileUpload').files;
    const formData = new FormData();

    for (const file of files) {
        formData.append('files', file);
    }

    const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Files uploaded successfully');
        fetchDocuments();
    } else {
        alert('File upload failed');
    }
}


/*async function viewPDF(filename)
{
    const formData = new FormData();

    formData.append('files', filename);

    const response = await fetch('http://127.0.0.1:5000/initFilename', {
        method: 'POST',
        body: formData
    });
}*/


async function fetchDocuments() {
    const response = await fetch('http://127.0.0.1:5000/documents');
    const documents = await response.json();
    const documentList = document.getElementById('documentList');
    documentList.innerHTML = '';

    for (const doc of documents) {
        const li = document.createElement('li');
        const link = document.createElement('a');

        link.textContent = doc.filename;
        link.href = "viewPDF.html?name="+doc.filename;
        // link.onclick = viewPDF(doc.filename);

        li.appendChild(link);
        documentList.appendChild(li);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', function () {
            // 获取要删除的文件名或者标识符
            const fileId = doc.filename;

            // 发送删除文件的请求
            fetch('http://127.0.0.1:5000/delete_file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ file_id: fileId })
            })
            .then(response => {
                if (response.ok) {
                    // 删除成功，移除列表项
                    fetchDocuments()
                } else {
                    // 处理删除失败情况
                    console.error('删除文件失败');
                }
            })
            .catch(error => {
                console.error('删除文件出错:', error);
            });

        });
        documentList.appendChild(deleteButton);
    }
}

// async function removeItems(){
//      // 获取文档列表
//     const documentList = document.getElementById('documentList');
//
//     // 为每个列表项添加删除按钮
//      documentList.querySelectorAll('li').forEach(function (item) {
//         // 创建删除按钮元素
//         const deleteButton = document.createElement('button');
//         deleteButton.textContent = '删除';
//         deleteButton.classList.add('delete-button');
//
//         // 监听删除按钮的点击事件
//         deleteButton.addEventListener('click', function () {
//             // 获取要删除的文件名或者标识符
//             const fileId = item.getAttribute('data-file-id');
//
//             // 发送删除文件的请求
//             fetch('/delete_file', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ file_id: fileId })
//             })
//             .then(response => {
//                 if (response.ok) {
//                     // 删除成功，移除列表项
//                     item.remove();
//                 } else {
//                     // 处理删除失败情况
//                     console.error('删除文件失败');
//                 }
//             })
//             .catch(error => {
//                 console.error('删除文件出错:', error);
//             });
//         });
//
//         // 将删除按钮添加到列表项中
//         item.appendChild(deleteButton);
//     });
// }

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileUpload').addEventListener('change', handleFileSelect);
    // document.querySelector('button').addEventListener('click', sendMessage);
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const fileName = file.name;
        const reader = new FileReader();

        reader.onload = function(e) {
            // Optionally display file content
            // const fileContent = e.target.result;
            // Display file name in the chat input box
            document.getElementById('chatInput').value = fileName;
            // You can also append file content to chat box if needed
            // const chatBox = document.getElementById('chatBox');
            // const pdfContent = document.createElement('div');
            // pdfContent.classList.add('message', 'file-content');
            // pdfContent.textContent = fileContent; // or display as needed
            // chatBox.appendChild(pdfContent);
        };

        reader.readAsText(file);
    } else {
        alert('Please upload a valid PDF file.');
    }
}

async function sendMessage() {
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

    const response = await fetch('http://127.0.0.1:5000/chat', {
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
