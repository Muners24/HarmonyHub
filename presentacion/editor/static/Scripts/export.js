

function exportMidi(path) {
    const midiData = editorData(path);

    fetch('/exportMidi/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(midiData),
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
    });
}



function editorData(path) {
    alert(path);
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
        path: path,
        tempo: editor.getTempo(),
        numerator: editor.compases[0].getTimeNum(),
        denominator: editor.compases[0].getTimeDen(),
        notas: notas
    };
}