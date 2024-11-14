function importarMidi() {
    const input = document.getElementById('importMidi');
    const formData = new FormData();
    formData.append('file', input.files[0]);

    fetch('/importMidi/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.midi_data) {
            console.log('Datos MIDI importados:', data.midi_data);
            cargarPartitura(data.midi_data); // Aquí cargamos los datos MIDI en el editor
        } else {
            console.error('Error al importar MIDI:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Estas son funciones ficticias que debes implementar según tu editor
function cargarPartitura(midiData) {
    // Aquí deberías cargar los datos MIDI en tu editor (puedes tener un formato específico para ello)
    console.log('Cargando partitura...', midiData);
}