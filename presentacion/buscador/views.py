from django.shortcuts import render, redirect
import json
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt


def buscador(request):
    
    request.session['query'] = None
     
    resultados = None
    error = ""
    categoria = "Categoría"
    texto = ""
    
    return render(
        request,
        "Buscador.html",
        {
            "resultados": resultados,
            "texto": texto,
            "categoria": categoria,
            "error": error,
        },
    )


def buscar(request):
    if request.session.get('query') == None:
        return redirect(buscador)
    
    query = request.session['query']
    
    print(query)
    
    resultados = None
    categoria = query['categoria']
    texto = query['texto']
    error = query['error']
    
    return render(
        request,
        "Buscador.html",
        {
            "resultados": resultados,
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
            
            
            query = request.session.get('query',None)
            
            if query != None:
                print(f'{query} {categoria}')
                if query['categoria'] == categoria:
                    categoria = ''
                
            if categoria == '':
                categoria = 'Categoría'
                

            request.session["query"] = {"texto": texto, "categoria": categoria,'error':''}

            return JsonResponse(data)

        except Exception as e:
            return
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)


def obtenerListados():
    return 0
