// Función que toma el valor del textbox y lo pasa a la función setTempo del objeto Editor
function setTempoFromInput() {
  const tempoInput = document.getElementById('tempoInput');
  const tempoValue = tempoInput.value;
  const errorMessage = document.getElementById('errorMessage');

  if (tempoValue >= 1 && tempoValue <= 500) {
    editor.setTempo(tempoValue);
    errorMessage.style.display = 'none'; 
  } else {

    errorMessage.style.display = 'block';
  }
}
