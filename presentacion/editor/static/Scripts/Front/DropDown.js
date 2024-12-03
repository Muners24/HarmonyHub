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