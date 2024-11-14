

function importMidi() {
    const input = document.getElementById('inputMidi');
    const formData = new FormData();
    formData.append('file', input.files[0]);

    fetch('/importMidi/', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            cargarPartitura(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function cargarPartitura(data) {
    editor.reinit()
    editor.config();
    editor.setTempo(data.tempo);
    editor.setCompasNum(data.numerator);
    editor.setCompasDen(data.denominator);
    
    let i = 0;
    let notas = data.notas;
    while (notas.length !== 0) {
        let cap = new Fraction(editor.getCompasNum(), editor.getCompasDen());
        editor.compases[i].empty();
        while (cap.numerator !== 0 && cap.greaterThanEquals(new Fraction(1,parseInt(notas[0].dur)))){
            cap.simplify();
            editor.compases[i].addNota(notas[0].keys,notas[0].dur);
            cap.subtract(new Fraction(1,parseInt(notas[0].dur)));
            notas.splice(0,1);
        }

        while(cap.numerator !== 0){
            cap.simplify();
            editor.compases[0].addNota(['b/4'],String(cap.denominator)+'r')
            cap.subtract(new Fraction(1,cap.denominator));
        }
    
        if(notas.length !== 0){
            editor.addCompas();
            i++;
        }
    }
    
   editor.formated = false;
   editor.Editdraw();
}