from django.shortcuts import render, redirect
import json
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def buscador(request):
    
    #if request.session.get('IdUsuario') == None:
    #    return redirect('/logout')
    
    categoria = request.session.get('Categoria',None)
    if categoria == None:
        request.session['Categoria'] = 'Categoría'
    
    resultados = 1
    #resultados = obtenerListados(categoria)
    return render(request,'Buscador.html',{'resultados': resultados,'categoria' : categoria})

@csrf_exempt
def selectCategoria(request):
    if request.session.get("IdUsuario") == None:
        return redirect("/logout")

    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))

            categoria = data["categoria"]

            request.session["Categoria"] = categoria

            return JsonResponse(data)

        except Exception as e:
            return
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)
    

def obtenerListados():
    return 0