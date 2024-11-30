from django.shortcuts import render, redirect
import json
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from negocios.pefiles.N_Perfil import N_Perfil
from negocios.retos.N_Participacion import N_Participacion

def buscador(request):
    if request.session.get('IdUsuario') == None:
        return redirect('/logout')
    
    request.session["query"] = None

    texto = ""
    categoria = "Categoría"
    error = ""

    return render(
        request,
        "Buscador.html",
        {
            "perfiles": [],
            "retos": [],
            "texto": texto,
            "categoria": categoria,
            "error": error,
        },
    )


def buscar(request):
    if request.session.get('IdUsuario') == None:
        return redirect('/logout')
    
    if request.session.get("query") == None:
        return redirect(buscador)

    query = request.session["query"]

    categoria = query["categoria"]
    texto = query["texto"]
    error = ''

    resultadosPerfil = []
    resultadosParticipacion = []

    if texto == '':
        return render(
            request,
            "Buscador.html",
            {
                "perfiles": resultadosPerfil,
                "retos": resultadosParticipacion,
                "texto": texto,
                "categoria": categoria,
                "error": error,
            },
        )
        
    N_PERF = N_Perfil()
    N_PART = N_Participacion()
    
    if categoria == "Perfiles de Usuario":
        
        resultado = N_PERF.buscarPerfiles(texto)

        print(resultado)
        
        if resultado.get("error") == None:
            resultadosPerfil = resultado["perfiles"]
        else:
            error = resultado['error']
            
        
    

    if categoria == "Retos":
        resultado = N_PART.getParticipacionesPorTexto(texto)

        print(resultado)
        
        if resultado.get("error") == None:
            resultadosParticipacion = resultado["participaciones"]
        else:
            error = resultado['error']
    
    
    if categoria == 'Categoría':
        
        resultado = N_PERF.buscarPerfiles(texto)
        print(resultado)
        
        count_error = 0
        
        if resultado.get("error") == None:
            resultadosPerfil = resultado["perfiles"]
        else:
            count_error += 1
        
        resultado = N_PART.getParticipacionesPorTexto(texto)

        print(resultado)
        
        if resultado.get("error") == None:
            resultadosParticipacion = resultado["participaciones"]
        else:
            count_error += 1
            
        if count_error > 1:
            error = 'No se encontraron coincidencias'

    
    
    return render(
        request,
        "Buscador.html",
        {
            "perfiles": resultadosPerfil,
            "retos": resultadosParticipacion,
            "texto": texto,
            "categoria": categoria,
            "error": error,
        },
    )


@csrf_exempt
def query(request):
    if request.session.get("IdUsuario") == None:
        return redirect("/logout")

    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))

            texto = data["texto"]
            categoria = data["categoria"]

            query = request.session.get("query", None)

            if query != None:
                if query["categoria"] == categoria:
                    categoria = ""

            if categoria == "":
                categoria = "Categoría"

            request.session["query"] = {"texto": texto, "categoria": categoria}

            return JsonResponse(data)

        except Exception as e:
            return
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)


def obtenerListados():
    return 0
