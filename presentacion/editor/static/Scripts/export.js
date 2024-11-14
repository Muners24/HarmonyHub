
function exportMidi(titulo) {
    const midiData = editorData();

    titulo += '.mid'
    fetch('/exportMidi/', {
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

function editorData() {
    let notas = [];

    for(let i=0;i<editor.pentagramas.length;i++){
        let pentagrama = editor.pentagramas[i];
        for(let j=0;j<pentagrama.compases.length;j++){
            let compas = pentagrama.compases[j];
            for(let k=0;k<compas.notas.length;k++){
                let nota = compas.notas[k];
                notas.push({
                    keys : nota.getKeys(),
                    dur: nota.getDuration()
                });     
            }
        }
    }

    return {
        tempo: editor.getTempo(),
        numerator: editor.compases[0].getTimeNum(),
        denominator: editor.compases[0].getTimeDen(),
        notas: notas
    };
}