

function importMidi() {
    const input = document.getElementById('inputMidi');
    const formData = new FormData();
    formData.append('file', input.files[0]);

    fetch('importMidi/', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            editor.cargarPartitura(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function loadFile(id){
    document.getElementById(id).click();
}