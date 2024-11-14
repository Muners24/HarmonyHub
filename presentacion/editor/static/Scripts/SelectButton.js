function selectButton(noteType, event) {
    // Obtener todos los botones
    const buttons = document.querySelectorAll('.button-T');

    // Comprobar si el botón clickeado ya está activo
    if (event.currentTarget.classList.contains('selected')) {
        // Si está seleccionado, lo deseleccionamos
        event.currentTarget.classList.remove('selected');
        selectedNote = null;  // Desmarcar la nota seleccionada
    } else {
        // Si no está seleccionado, activar el botón
        buttons.forEach(button => {
            button.classList.remove('selected');  // Desactivar otros botones
        });

        event.currentTarget.classList.add('selected');  // Activar el botón actual
        selectedNote = noteType;  // Establecer la nota seleccionada
    }
}
