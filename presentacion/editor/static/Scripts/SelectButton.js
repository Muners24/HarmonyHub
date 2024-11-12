// Variable para almacenar el tipo de nota seleccionada
let selectedNote = null;

// Inicializar el lienzo de VexFlow y el pentagrama una vez
const VF = Vex.Flow;
const div = document.getElementById("Editor");
const renderer = new VF.Renderer(div, VF.Renderer.Backends.CANVAS);
renderer.resize(700, 500);
const context = renderer.getContext();
const stave = new VF.Stave(10, 40, 600);
stave.addClef("treble").setContext(context).draw();


// Función para manejar la selección de un botón de nota
function selectButton(noteType, event) {
    const buttons = document.querySelectorAll('.button-T');
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    const selectedButton = event.currentTarget;
    selectedButton.classList.add('selected');

    selectedNote = noteType;

    // Mostrar mensaje de confirmación en el elemento HTML
    const confirmationMessage = document.getElementById('confirmationMessage');
    confirmationMessage.textContent = `Has seleccionado la nota: ${noteType}`;
}

// Función para manejar la selección de un botón de nota
function selectButton(noteType, event) {
    const buttons = document.querySelectorAll('.button-T');
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    const selectedButton = event.currentTarget;
    selectedButton.classList.add('selected');

    selectedNote = noteType;

    // Mostrar mensaje de confirmación en el elemento HTML
    const confirmationMessage = document.getElementById('confirmationMessage');
    confirmationMessage.textContent = `Has seleccionado la nota: ${noteType}`;
}