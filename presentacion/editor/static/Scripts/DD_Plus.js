function toggleDropdown(event) {
    // Evita el comportamiento por defecto (en caso de que se trate de un <a> sin href válido)
    event.preventDefault();

    // Obtiene el dropdown por su ID
    const dropdown = document.getElementById("dropdownMenu");

    // Alterna la visibilidad del dropdown (muestra/oculta)
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";  // Oculta el dropdown si ya está visible
    } else {
        dropdown.style.display = "block";  // Muestra el dropdown si está oculto
    }
}

// Cerrar el dropdown si se hace clic fuera de él
window.onclick = function(event) {
    if (!event.target.matches('.button-T') && !event.target.closest('.dropdown-content')) {
        const dropdown = document.getElementById("dropdownMenu");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";  // Cierra el dropdown si se hace clic fuera
        }
    }
}
