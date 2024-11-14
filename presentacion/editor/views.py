
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import mido
import json

from negocios.editor import export
# Create your views here.
# mi_aplicacion/views.py

def pentagrama(request):
    var = 'zasd'
    return render(request, 'Editor.html',{
        'var' : var
    })

@csrf_exempt
def exportMidi(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            export.exportMidi(data)
            print(f"Datos recibidos: {data}")
            return JsonResponse({'status': 'success', 'received_data': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    
# Función para convertir MIDI a JSON
def midi_to_json(midi_file):
    midi_json = []
    for track in midi_file.tracks:
        track_data = []
        for msg in track:
            track_data.append({
                'type': msg.type,
                'note': msg.note if hasattr(msg, 'note') else None,
                'velocity': msg.velocity if hasattr(msg, 'velocity') else None,
                'time': msg.time
            })
        midi_json.append(track_data)
    return midi_json

# Función para convertir JSON a MIDI
def json_to_midi(midi_json):
    midi_file = mido.MidiFile()
    for track_data in midi_json:
        track = mido.MidiTrack()
        for msg_data in track_data:
            msg = mido.Message(msg_data['type'], note=msg_data.get('note'), velocity=msg_data.get('velocity'), time=msg_data['time'])
            track.append(msg)
        midi_file.tracks.append(track)
    return midi_file
