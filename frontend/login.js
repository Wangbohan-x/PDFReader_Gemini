async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        // document.getElementById('login').style.display = 'none';
        // document.getElementById('upload').style.display = 'block';
        // document.getElementById('history').style.display = 'block';
        // document.getElementById('chat').style.display = 'block';
        // fetchDocuments();
        // removeItems();
        window.location.href = "user.html"
    } else {
        alert('Login failed');
    }
}






