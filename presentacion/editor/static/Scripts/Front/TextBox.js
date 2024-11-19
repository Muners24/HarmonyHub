//validaciones tipo de caracter y cantidad
document.getElementById('tempoInput').addEventListener('input', function(event) {
    const input = event.target;
    
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length > 3) {
        input.value = input.value.slice(0, 3);  
    }
});

document.getElementById('compasInputNum').addEventListener('input', function(event) {
    const input = event.target;
    
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length > 2) {
        input.value = input.value.slice(0, 2);  
    }
});

document.getElementById('compasInputDen').addEventListener('input', function(event) {
    const input = event.target;
    
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length > 2) {
        input.value = input.value.slice(0, 2);  
    }
});

document.getElementById('tbAnotacion').addEventListener('input', function(event) {
    const input = event.target;
    
    if (input.value.length > 25) {
        input.value = input.value.slice(0, 25);  
    }
});

//validaciones de rango
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

function setTempoFromInput() {
    const tempoInput = document.getElementById('tempoInput');
    const tempoValue = parseInt(tempoInput.value, 10);
    if (!isNaN(tempoValue) && tempoValue >= 1 && tempoValue <= 500) {
        editor.setTempo(tempoValue);
        tempoInput.style.borderColor = ''; 
    } else {
        tempoInput.style.borderColor = 'red';
        alert("Valor fuera del rango permitido\n valores entre 1 y 500");
    }
}

//enter
document.getElementById('tempoInput').addEventListener('keydown', function(event) {
    event.stopPropagation();
    if(event.key === 'Enter')
        setTempoFromInput();
    
});

document.getElementById('compasInputNum').addEventListener('keydown', function(event) {
    event.stopPropagation();

    if(event.key === 'Enter')
        setCompasNumFromInput();
});

document.getElementById('compasInputDen').addEventListener('keydown', function(event) {
    event.stopPropagation();

    if(event.key === 'Enter')
        setCompasDenFromInput();
});

document.getElementById('tbAnotacion').addEventListener('keydown', function(event) {
    event.stopPropagation();
    const input = event.target;

    if(event.key === 'Enter'){
        editor.setText(input.value);
        input.value = "" 
    }
});




