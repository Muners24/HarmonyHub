
document.addEventListener("DOMContentLoaded", function () {

    closeArchivo();
    document.getElementById('ddPlus').style.display = 'none';
    
    
    // Seleccionar los botones y dropdowns
    const archivoButton = document.getElementById("archivoButton");
    const archivoDropdown = document.getElementById("archivoDropdown");
    const importarButton = document.getElementById("importarButton");
    const importarDropdown = document.getElementById("importarDropdown");
    const exportarButton = document.getElementById("exportarButton");
    const exportarDropdown = document.getElementById("exportarDropdown");
    const plusButton = document.getElementById("plusButton");
    const plusDropdown = document.getElementById("plusDropdown");

    // Función para cerrar todos los dropdowns
    function closeAllDropdowns() {
        archivoDropdown.classList.remove("show");
        importarDropdown.classList.remove("show");
        exportarDropdown.classList.remove("show");
        plusDropdown.classList.remove("show");
    }

    // Evento de clic para abrir/cerrar los dropdowns al hacer clic en sus botones
    archivoButton.addEventListener("click", function (event) {
        event.preventDefault();
        closeAllDropdowns();
        archivoDropdown.classList.toggle("show");
    });

    importarButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que el clic se propague y cierre el dropdown principal
        event.preventDefault();
        importarDropdown.classList.toggle("show");
    });

    exportarButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que el clic se propague y cierre el dropdown principal
        event.preventDefault();
        exportarDropdown.classList.toggle("show");
    });

    plusButton.addEventListener("click", function (event) {
        event.preventDefault();
        closeAllDropdowns(); // Cierra otros dropdowns al abrir "Plus"
        plusDropdown.classList.toggle("show");
    });

    // Cerrar los dropdowns cuando se hace clic fuera de ellos
    document.addEventListener("click", function (event) {
        if (
            !archivoButton.contains(event.target) &&
            !importarButton.contains(event.target) &&
            !exportarButton.contains(event.target) &&
            !plusButton.contains(event.target) &&
            !archivoDropdown.contains(event.target) &&
            !importarDropdown.contains(event.target) &&
            !exportarDropdown.contains(event.target) &&
            !plusDropdown.contains(event.target)
        ) {
            closeAllDropdowns();
        }
    });



});


function closeArchivo(){
    document.getElementById("ddItemsArchivo").style.display = 'none';
    hideImportItems();
    hideExportItems();
}

function showImportItems(){
    document.getElementById("ddItemsImport").style.display = '';
}


//delay para llamar a las funciones de los botones el dropdown primero
function hideImportItems(){
    setTimeout(function() {
        document.getElementById('ddItemsImport').style.display = 'none';
    }, 120);
}

function showExportItems(){
    document.getElementById("ddItemsExport").style.display = '';
}

function hideExportItems(){
    setTimeout(function() {
        document.getElementById("ddItemsExport").style.display = 'none';
    }, 120);
}

function toggleDDPlus() {
    const ddPlus = document.getElementById('ddPlus');
    ddPlus.style.display = ddPlus.style.display === 'none' ? '' : 'none';
    document.getElementById('Plus.png').style.filter = 'none';
} 