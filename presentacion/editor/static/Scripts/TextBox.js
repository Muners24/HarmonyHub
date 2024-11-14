function actualizarTexto() {
    let texto = document.getElementById("myTextbox").value;
    editor.setText(texto);
}

function setTempoFromInput() {
    const tempoInput = document.getElementById('tempoInput');
    const tempoValue = parseInt(tempoInput.value, 10);

    if (!isNaN(tempoValue) && tempoValue >= 1 && tempoValue <= 500) {
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


function setCompasNumFromInput() {
    const compasNumInput = document.getElementById('compasInputNum');
    const compasValue = parseInt(compasNumInput.value, 10);

    if (!isNaN(compasValue) && compasValue >= 1 && compasValue <= 50) {
        editor.setCompasNum(compasValue);
        compasNumInput.style.borderColor = ''; 
    } else {
        compasNumInput.style.borderColor = 'red';
        alert("Valor fuera del rango permitido\n valores entre 1 y 50");
    }
}

document.getElementById('compasInputNum').addEventListener('input', function(event) {
    const numInput = event.target;

    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length > 3) {
        input.value = input.value.slice(0, 3);
    }
});

document.getElementById('compasInputNum').addEventListener('blur', setCompasNumFromInput);


function setCompasDenFromInput() {
    const compasDenInput = document.getElementById('compasInputDen');
    const compasValue = parseInt(compasDenInput.value, 10);

    const validValues = [1, 2, 4, 8, 16, 32, 64];

    if (!isNaN(compasValue) && validValues.includes(compasValue)) {
        editor.setCompasDen(compasValue);
        compasDenInput.style.borderColor = ''; 
    } else {
        compasDenInput.style.borderColor = 'red';
        alert("Valor fuera del rango permitido. Solo se permiten los siguientes valores: 1, 2, 4, 8, 16, 32, 64");
    }
}

document.getElementById('compasInputDen').addEventListener('input', function(event) {
    const denInput = event.target;

    denInput.value = denInput.value.replace(/[^0-9]/g, '');

    if (denInput.value.length > 2) {
        denInput.value = denInput.value.slice(0, 2);
    }
});

document.getElementById('compasInputDen').addEventListener('blur', setCompasDenFromInput);





let isTyping = false;
let typingTimer;
const typingDelay = 1000;

const textbox = document.getElementById('myTextbox');
const status = document.getElementById('status');

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