from django.shortcuts import render,redirect
from django.views.decorators.csrf import csrf_exempt
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from negocios.retos.N_Participacion import N_Participacion

def resultados(request):
    
    if request.session.get('IdUsuario') == None:
        return redirect('/logout')
   
    NP = N_Participacion() 
    
    respuesta = NP.getResultado()
    
    return render(request, "Resultados.html",respuesta)

    