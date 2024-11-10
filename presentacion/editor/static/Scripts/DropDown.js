document.addEventListener("DOMContentLoaded", function () {
    // Función para mostrar/ocultar el dropdown
    document.getElementById("archivoButton").onclick = function(event) {
        event.preventDefault(); // Evitar la navegación
        var dropdown = document.getElementById("archivoDropdown");
        dropdown.classList.toggle("show"); // Alterna la clase 'show'
    };

    // Función para mostrar/ocultar el sub-dropdown Importar
    document.getElementById("importarButton").onclick = function(event) {
        event.preventDefault(); // Evitar la navegación
        var impDropdown = document.getElementById("importarDropdown");
        impDropdown.classList.toggle("show"); // Alterna la clase 'show'
        // Cerrar el sub-dropdown de exportar si está abierto
        document.getElementById("exportarDropdown").classList.remove("show");
    };

    // Función para mostrar/ocultar el sub-dropdown Exportar
    document.getElementById("exportarButton").onclick = function(event) {
        event.preventDefault(); // Evitar la navegación
        var expDropdown = document.getElementById("exportarDropdown");
        expDropdown.classList.toggle("show"); // Alterna la clase 'show'
        // Cerrar el sub-dropdown de importar si está abierto
        document.getElementById("importarDropdown").classList.remove("show");
    };

    // Cerrar los sub-dropdowns si se hace clic en cualquier otro botón dentro del dropdown
    var dropdownLinks = document.querySelectorAll(".dropdown-content a:not(#importarButton):not(#exportarButton)");
    dropdownLinks.forEach(function(link) {
        link.onclick = function() {
            document.getElementById("importarDropdown").classList.remove("show");
            document.getElementById("exportarDropdown").classList.remove("show");
        };
    });

    // Cerrar el dropdown y sub-dropdowns si se hace clic fuera de ellos
    window.onclick = function(event) {
        if (!event.target.matches('#archivoButton') && !event.target.matches('#importarButton') && !event.target.matches('#exportarButton') &&
            !event.target.matches('.dropdown-content') && !event.target.matches('.dropdown-content a') &&
            !event.target.matches('.dropdown-content-imp') && !event.target.matches('.dropdown-content-imp a') &&
            !event.target.matches('.dropdown-content-exp') && !event.target.matches('.dropdown-content-exp a')) {
            
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }

            var impDropdowns = document.getElementsByClassName("dropdown-content-imp");
            for (var i = 0; i < impDropdowns.length; i++) {
                var openImpDropdown = impDropdowns[i];
                if (openImpDropdown.classList.contains('show')) {
                    openImpDropdown.classList.remove('show');
                }
            }

            var expDropdowns = document.getElementsByClassName("dropdown-content-exp");
            for (var i = 0; i < expDropdowns.length; i++) {
                var openExpDropdown = expDropdowns[i];
                if (openExpDropdown.classList.contains('show')) {
                    openExpDropdown.classList.remove('show');
                }
            }
        }
    };
});