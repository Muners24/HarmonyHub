from django.shortcuts import render,redirect
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import os
import sys
from io import BytesIO
import base64

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from negocios.pefiles.Perfil import Perfil

def inicio(request):
    
    if request.session.get('IdUsuario') == None:
        return redirect('/logout')

    NP = Perfil()
    
    perfil = NP.buscarPerfilPorIdUsuario(request.session.get('IdUsuario'))
    
   
    return render(request, "Inicio.html",{'img': perfil.getImg()})

