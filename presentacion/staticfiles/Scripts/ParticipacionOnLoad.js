var editor;

document.addEventListener('DOMContentLoaded', function(){
    editor = new Editor('Editor');
    editor.config();
    editor.Editdraw();

    editor.cargarPartitura(participacion.notacion);
})