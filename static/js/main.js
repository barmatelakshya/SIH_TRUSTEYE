function testAPI() {
    fetch('/api/test')
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerHTML = 
                `<div class="alert alert-success">✅ ${data.message}</div>`;
        })
        .catch(error => {
            document.getElementById('result').innerHTML = 
                `<div class="alert alert-danger">❌ Error: ${error}</div>`;
        });
}
