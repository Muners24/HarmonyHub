var editor;

document.addEventListener('DOMContentLoaded', function(){
    const tbTitulo = this.getElementById('tbTitulo');
    const tbCompositor = this.getElementById('tbCompositor');

    tbTitulo.value = partitura.titulo;
    tbCompositor.value = partitura.compositor;

    editor = new Editor('Editor');
    editor.config();
    editor.Editdraw();
    editor.initInput();
    editor.cargarPartitura(partitura.notacion);

})