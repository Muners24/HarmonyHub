import mido
from mido import MidiFile

def obtener_datos_midi(archivo_midi):
    # Cargar el archivo MIDI
    midi = MidiFile(archivo_midi)

    for i, mensaje in enumerate(midi.play()):
        # Filtrar eventos de tipo 'note_on' y 'note_off'
        if mensaje.type == 'note_on':
            print(f"Evento {i + 1}: 'note_on'")
            print(f"  - Nota: {mensaje.note}")
            print(f"  - Velocidad: {mensaje.velocity}")
            print(f"  - Canal: {mensaje.channel}")
            print(f"  - Tiempo de aparición: {mensaje.time} ticks")
            
        elif mensaje.type == 'note_off':
            print(f"Evento {i + 1}: 'note_off'")
            print(f"  - Nota: {mensaje.note}")
            print(f"  - Velocidad: {mensaje.velocity}")
            print(f"  - Canal: {mensaje.channel}")
            print(f"  - Tiempo de aparición: {mensaje.time} ticks")

# Ruta al archivo MIDI
archivo_midi = 'C:/midi/midi.mid'

# Llamar a la función para obtener los datos del MIDI
obtener_datos_midi(archivo_midi)
