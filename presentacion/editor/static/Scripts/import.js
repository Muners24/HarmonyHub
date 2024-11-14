function importarMidi() {
    const input = document.getElementById('importar-midi');
    const formData = new FormData();
    input.click();
    formData.append('file', input.files[0]);

    fetch('/importar-midi/', {
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

// Función ficticia para cargar la partitura en el editor
function cargarPartitura(midiData) {
    console.log('Cargando partitura...', midiData);
    // Aquí implementa la lógica para visualizar los datos MIDI en tu editor
}