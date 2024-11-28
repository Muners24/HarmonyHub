
function exportMidi() {
    const midiData = editor.getData();

    let titulo = document.getElementById('tbTitulo').value;
    titulo += '.midi'
    fetch('/editor/exportMidi/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(midiData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al procesar la solicitud');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = titulo;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}