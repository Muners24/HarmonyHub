from django.shortcuts import render, redirect
import json
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from negocios.pefiles.N_Perfil import N_Perfil


def buscador(request):
    if request.session.get('IdUsuario') == None:
        return redirect('/logout')
    
    request.session["query"] = None

    resultados = None
    error = ""
    categoria = "Categoría"
    texto = ""

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

    print(f'{query['categoria']} {query['texto']}')
    categoria = query["categoria"]
    texto = query["texto"]
    error = ''

    print()
    
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
        
    NP = N_Perfil()
    if categoria == "Perfiles de Usuario":
        print('buscando perfiles')
        
        resultado = NP.buscarPerfiles(texto)

        print(resultado)
        
        if resultado.get("error") == None:
            resultadosPerfil = resultado["perfiles"]
        else:
            error = resultado['error']
            
        
    

    if categoria == "Retos":
        print('buscando retos')
        
    
    if categoria == 'Categoría':
        print('buscando retos y perfiles')
        
        resultado = NP.buscarPerfiles(texto)
        count_error = 0
        
        if resultado.get("error") == None:
            resultadosPerfil = resultado["perfiles"]
        else:
            count_error += 1
            
        if count_error > 0:
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
