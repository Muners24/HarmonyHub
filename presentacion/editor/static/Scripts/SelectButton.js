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


// // Función para manejar la selección de un botón de nota
// function selectButton(noteType, event) {
    
//     const buttons = document.querySelectorAll('.button-T');
//     buttons.forEach(button => {
//         button.classList.remove('selected');
//     });


//     const selectedButton = event.currentTarget;
//     selectedButton.classList.add('selected');

//     selectedNote = noteType;

//     // Mostrar mensaje de confirmación en el elemento HTML
//     const confirmationMessage = document.getElementById('confirmationMessage');
//     confirmationMessage.textContent = `Has seleccionado la nota: ${noteType}`;
// }

// Función para manejar la selección de un botón de nota
function selectButton(noteType, event) {
    const buttons = document.querySelectorAll('.button-T');
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    const selectedButton = event.currentTarget;
    selectedButton.classList.add('selected');

    selectedNote = noteType;

    function selectButton(buttonId, event) {
        switch (buttonId) {
            case 'SemiFusa':
                // Aquí podrías asignar una función relacionada o personalizada
                break;
            case 'Fusa':
                // Ejemplo de una acción específica si esta botón tuviera una función
                break;
            // Acciones mapeadas a la funcionalidad de `handleKeydown`
            case 'Negra':
                editor.setRithm('4'); // Si quieres que represente una figura negra
                break;
            case 'Corchea':
                editor.setRithm('8'); // Para representar una corchea
                break;
            case 'Blanca':
                editor.setRithm('2'); // Para representar una blanca
                break;
            case 'Redonda':
                editor.setRithm('1'); // Para representar una redonda
                break;
            case 'Puntillo':
                editor.addDot();
                break;
            case 'Bemol':
                editor.setAccidental('b');
                break;
            case 'Natural':
                editor.setAccidental('n');
                break;
            case 'Sostenido':
                editor.setAccidental('#');
                break;
            case 'DobleSostenido':
                editor.setAccidental('##');
                break;
            case 'Levato':
                editor.setArticulation('a@a');
                break;
            case 'Crecendo':
                editor.setArticulation('av');
                break;
            case 'Diminuendo':
                editor.setArticulation('a>');
                break;
            case 'Triplet':
                editor.setRithm('3'); // Ejemplo para definir un triplete
                break;
            case 'Plus':
                editor.setCompasNum(4); // Ejemplo para modificar el compás
                break;
            default:
                console.warn(`No action defined for button: ${buttonId}`);
        }
    
        // Puedes agregar el llamado a `Editdraw` para refrescar la vista después de cada acción
        editor.Editdraw();
    }
    
}