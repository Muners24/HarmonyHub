from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.views.decorators.csrf import csrf_exempt
import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from negocios.retos.N_Participacion import N_Participacion

def resultados(request):
    if request.session.get('IdUsuario') == None:
        return redirect('/logout')
    
    
    NP = N_Participacion() 
    
    respuesta = NP.getResultado()
    
    respuesta['categoria'] = 'Categoría'
    
    return render(request, "Resultados.html",respuesta)

def categoria(request):
    if request.session.get('IdUsuario') == None:
        return redirect('/logout')
    
    cat = request.session.get('resultadoCategoria')
        
    if cat == None or cat == 'Categoría':
        return redirect(resultados)
    
    NP = N_Participacion() 
    
    respuesta = NP.getResultadosCategoria(cat)
    
    respuesta['categoria'] = cat
    
    return render(request, "Resultados.html",respuesta)

@csrf_exempt
def selCategoria(request):
    if request.session.get("IdUsuario") == None:
        return redirect("/logout")

    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))

            categoria = data["categoria"]
            
            resCategoria = request.session.get("resultadoCategoria", None)

            if resCategoria != None:
                if resCategoria == categoria:
                    categoria = "Categoría"
            
            request.session["resultadoCategoria"] = categoria

            return JsonResponse(data)

        except Exception as e:
            return
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)
    


    