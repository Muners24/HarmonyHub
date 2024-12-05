var editor;
var escribiendo;
// Inicializa el Editor cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {

  editor = new Editor('Editor');
  editor.config();
  editor.Editdraw();
  editor.initInput();
  
});




