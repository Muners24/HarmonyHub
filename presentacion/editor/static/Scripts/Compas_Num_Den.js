document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('compas-num').addEventListener('blur', function() {
        const numInput = document.getElementById('compas-num');
        const numValue = parseInt(numInput.value, 10); // Convertir a entero
        const errorMessage = document.getElementById('errorMessage');

        // Validar si el valor está dentro del rango
        if (!isNaN(numValue) && numValue >= 1 && numValue <= 50) {
            editor.setCompasNum(numValue);  // Llamar a la función si es válido
            errorMessage.style.display = 'none';
        } else {
            errorMessage.style.display = 'block';  // Mostrar mensaje de error si no es válido
        }
    });
});
