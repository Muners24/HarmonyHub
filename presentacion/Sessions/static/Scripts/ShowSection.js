function validatePasswords() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const errorDiv = document.getElementById('password-error');

    if (password !== confirmPassword) {
        // Mostrar mensaje de error si las contraseñas no coinciden
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Las contraseñas no coinciden.';
    } else {
        // Ocultar mensaje de error y mostrar la siguiente sección
        errorDiv.style.display = 'none';
        showSection2();
    }
}

function showSection2() {
    document.getElementById('section1').style.display = 'none';
    document.getElementById('section2').style.display = 'block';
}
