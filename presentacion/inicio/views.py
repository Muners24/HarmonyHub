from django.shortcuts import render,redirect
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import os
import sys
from io import BytesIO
import base64

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from negocios.pefiles.N_Perfil import N_Perfil
from negocios.retos.N_Participacion import N_Participacion


def inicio(request):
    
    if request.session.get('IdUsuario') == None:
        return redirect('/logout')
    

    return render(request, "Inicio.html")

    