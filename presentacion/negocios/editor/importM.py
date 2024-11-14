import mido
from mido import MidiFile
import time

def now_fn():
    return time.time()

def importMidi(path):

    midi = MidiFile(path)
    compas = None 
    tempo = None
    bpm = None

    i = 0
    for track in midi.tracks:
        for mensaje in track:
            if mensaje.type == 'time_signature':
                compas = f"{mensaje.numerator}/{mensaje.denominator}"
                print(f"Compás detectado: {compas}")
                print(mensaje)
            elif mensaje.type == 'set_tempo':
                tempo = mensaje.tempo
                bpm = 60000000 / tempo  # Convertir el tempo a BPM
                print(f"Tempo detectado: {tempo} microsegundos por quarter note ({bpm:.2f} BPM)")
            elif mensaje.type == 'quarter_frame':
                print(f"Mensaje quarter_frame detectado: {mensaje}")
            elif mensaje.type == 'note_on' and mensaje.velocity > 0:
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
            
            if mensaje.time > 0:
                print(f"Silencio de duración {mensaje.time} ticks antes del evento {i + 1}")
            i += 1

    if compas is None:
        compas = '4/4'
    
    if tempo is None:
        tempo = 120
    
    