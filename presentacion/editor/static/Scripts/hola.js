function guardarArchivo() {
    // Crear datos ficticios (aquí podrías crear el archivo MIDI real)
    const midiData = "Este es un ejemplo de archivo MIDI en formato de texto.";  // Cambiar esto por datos reales si es un archivo MIDI

    // Crear un Blob con el contenido del archivo
    const blob = new Blob([midiData], { type: 'application/octet-stream' }); // El tipo MIME puede cambiar según el archivo
    const url = URL.createObjectURL(blob);

    // Crear un enlace para activar la descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = 'archivo.mid';  // Nombre del archivo a guardar

    // Simular clic en el enlace para iniciar la descarga
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}