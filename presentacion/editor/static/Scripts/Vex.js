const Vex = require('vexflow');

/*
function generarSonidoError() {
    var contexto = new (window.AudioContext || window.webkitAudioContext)();
    var oscilador = contexto.createOscillator();
    var ganancia = contexto.createGain();

    oscilador.type = 'square'; // Tipo de onda cuadrada (característica de "error")
    oscilador.frequency.setValueAtTime(1000, contexto.currentTime); // Frecuencia del tono
    oscilador.connect(ganancia);
    ganancia.connect(contexto.destination);
    ganancia.gain.setValueAtTime(0.1, contexto.currentTime); // Volumen bajo

    oscilador.start();
    oscilador.stop(contexto.currentTime + 0.2); // Duración de 200ms
}*/