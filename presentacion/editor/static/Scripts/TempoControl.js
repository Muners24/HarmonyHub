// Función que toma el valor del textbox y lo pasa a la función setTempo del objeto Editor
function setTempoFromInput() {
  const tempoInput = document.getElementById('tempoInput');
  const tempoValue = tempoInput.value;
  const errorMessage = document.getElementById('errorMessage');
  
  // Validación: solo valores entre 1 y 150
  if (tempoValue >= 1 && tempoValue <= 150) {
    // Si es válido, se llama al método setTempo del editor
    editor.setTempo(tempoValue);
    errorMessage.style.display = 'none'; // Ocultar mensaje de error si es válido
  } else {
    // Si no es válido, mostrar un mensaje de error
    errorMessage.style.display = 'block';
  }
}
