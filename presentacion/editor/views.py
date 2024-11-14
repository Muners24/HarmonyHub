from django.shortcuts import render
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import mido
import json
import io 
import os

from negocios.editor import importM
from negocios.editor import export

# Create your views here.
# mi_aplicacion/views.py


def pentagrama(request):
    var = "zasd"
    return render(request, "Editor.html", {"var": var})


@csrf_exempt
def exportMidi(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            path = export.exportMidi(data)
            file = open(path, 'rb')
            return FileResponse(file,filename='midi.mid')

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def importMidi(request):
    if request.method == "POST":
        try:
            file = request.FILES['file']
            datos = importM.importMidi(file)
            print(datos)
            return JsonResponse(datos)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)
