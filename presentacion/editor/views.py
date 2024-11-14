
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import mido
import json

# Create your views here.
# mi_aplicacion/views.py

def pentagrama(request):
    var = 'zasd'
    return render(request, 'Editor.html',{
        'var' : var
    })

# Vista para exportar un archivo MIDI
@csrf_exempt
def exportMidi(request):
    if request.method == 'POST':
        try:
            # Obtener los datos JSON enviados desde el frontend
            data = json.loads(request.body.decode('utf-8'))
            
            # Imprimir los datos para verificar que se recibieron correctamente
            print(f"Datos recibidos: {data['x']}")
            
            # Devolver los datos recibidos en la respuesta para confirmación
            return JsonResponse({'status': 'success', 'received_data': data})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

        
    """
    if request.method == "POST":
        # Obtener los datos MIDI del frontend (en JSON)
        midi_json = json.loads(request.body)
        
        try:
            midi_data = json_to_midi(midi_json)
            midi_file_path = "archivo_exportado.mid"
            midi_data.save(midi_file_path)
            return JsonResponse({'message': 'Archivo exportado con éxito', 'file': midi_file_path})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
    """
    
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
