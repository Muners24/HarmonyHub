function actualizarTexto() {
    let texto = document.getElementById("myTextbox").value;
    editor.setText(texto);
}

function setTempoFromInput() {
    const tempoInput = document.getElementById('tempoInput');
    const tempoValue = parseInt(tempoInput.value, 10);
    const errorMessage = document.getElementById('errorMessage');
  
    // Validación: solo valores entre 1 y 150
    if (!isNaN(tempoValue) && tempoValue >= 1 && tempoValue <= 150) {
        editor.setTempo(tempoValue);
        tempoInput.style.borderColor = ''; 
    } else {
        tempoInput.style.borderColor = 'red';
        alert("Valor fuera del rango permitido\n valores entre 1 y 150");
    }
}

document.getElementById('tempoInput').addEventListener('input', function(event) {
    const input = event.target;
    
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length > 3) {
        input.value = input.value.slice(0, 3);  
    }
});

document.getElementById('tempoInput').addEventListener('blur', setTempoFromInput);



let isTypingTempo = false;

let isTyping = false;
let typingTimer;
const typingDelay = 1000;

const textbox = document.getElementById('myTextbox');
const status = document.getElementById('status');
const tempoInput = document.getElementById('tempoInput'); // Selección del input de tempo

const maxChars = 15;

textbox.addEventListener('keydown', function(event) {
    event.stopPropagation();

    if (textbox.value.length >= maxChars && event.key !== "Backspace" && event.key !== "Delete" && event.key.length === 1) {
        event.preventDefault();
        return;
    }

    if (!isTyping) {
        isTyping = true;
        status.textContent = "Está escribiendo...";
    }
    clearTimeout(typingTimer);
});

textbox.addEventListener('keyup', function(event) {
    event.stopPropagation();
    console.log('Tecla liberada:', event.key);
    clearTimeout(typingTimer);

    if (event.key === "Enter") {
        actualizarTexto();
    }

    typingTimer = setTimeout(function() {
        if (textbox.value === "") {
            isTyping = false;
            status.textContent = "No se está escribiendo.";
        } else {
            isTyping = false;
            status.textContent = "Escritura finalizada.";
        }
    }, typingDelay);
});

tempoInput.addEventListener('change', setTempoFromInput);