const form = document.querySelector('form');
const submitButton = document.getElementById('registrar');

form.addEventListener('submit', function (event) {
    submitButton.disabled = true;
    
});