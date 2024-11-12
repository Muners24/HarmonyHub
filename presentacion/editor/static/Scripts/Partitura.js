function config(editor){
    editor.addCompas(3,4);
    let compas = editor.compases[0];
    compas.addClef('treble');
    compas.addKeySignature('G');
    compas.notas.pop();
    compas.notas.pop();
    compas.notas[0] 
        .setDuration('2')
        .setKey('b/4')
        .addDot();

    editor.addCompas();
    compas = editor.compases[1];
    compas.notas.pop();
    compas.notas[0]
        .setDuration('2')
        .setKey('g/4')
    compas.notas[1]
        .setDuration('4')
        .setKey('f/4');

    editor.addCompas();
    compas = editor.compases[2];
    compas.notas.pop();
    compas.notas.pop();
    compas.notas[0] 
        .setDuration('2')
        .setKey('e/4')
        .addDot();

    editor.addCompas();
    compas = editor.compases[3];
    compas.notas[0].setKey('e/4');
    compas.notas[1].setKey('e/4');
    compas.notas[2].setKey('f/4');


    editor.addCompas();
    compas = editor.compases[4];
    compas.notas[0].setKey('g/4');
    compas.notas[1].setKey('e/4');
    compas.notas[2].setKey('g/4');

    editor.addCompas();
    compas = editor.compases[5];
    compas.notas.pop();
    compas.notas[0]
        .setDuration('2')
        .setKey('b/4')
    compas.notas[1]
        .setDuration('4')
        .setKey('c/5');

    editor.addCompas();
    compas = editor.compases[6];
    compas.notas.pop();
    compas.notas.pop();
    compas.notas[0] 
        .setDuration('2')
        .setKey('b/4')
        .addDot();

    editor.addCompas();
    compas = editor.compases[7];
    compas.notas.pop();
    compas.notas.pop();
    compas.notas[0] 
        .setDuration('2')
        .setKey('a/4')
        .addDot();
}


/*
// Inicializa el Editor cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    let editor = new Editor('Editor');
    config(editor);
    editor.Editdraw();
});*/
