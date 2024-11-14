

// Función para exportar los datos MIDI
function exportMidi() {
    const midiData = obtenerDatosMidiDelEditor(); // Esta función debería extraer los datos del editor

    fetch('/exportMidi/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(midiData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.file) {
            console.log('Archivo MIDI exportado:', data.file);
            // Aquí puedes hacer algo con el archivo exportado, como ofrecer una descarga
        } else {
            console.error('Error al exportar MIDI:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



function obtenerDatosMidiDelEditor() {
    let notas = [];

    for(let i=0;i<editor.pentagramas.length;i++){
        let pentagrama = editor.pentagramas[i];
        for(let j=0;j<pentagrama.compases.length;j++){
            let compas = pentagrama.compases[j];
            for(let k=0;k<compas.notas.length;k++){
                let nota = compas.notas[k];
                notas.push({
                    keys : notas.getKeys(),
                    dur: notas.getDuration()
                });
            }
        }
    }
    let x = [125,1235,1235,1235,1235];
    
    return { 
        tempo: editor.getTempo(),
        compas: editor.getCompas(),
        notas: notas
    };
}