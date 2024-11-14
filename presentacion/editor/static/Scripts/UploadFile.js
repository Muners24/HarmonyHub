function selectFile() {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            document.getElementById("fileName").textContent = `Archivo seleccionado: ${file.name}`;
        }
    });
}