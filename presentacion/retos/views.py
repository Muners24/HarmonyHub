from django.shortcuts import render, redirect
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from entidades.E_Reto import E_Reto
from entidades.E_Partitura import E_Partitura
from negocios.retos.Retos import Retos


def retos(request):
    
    request.session['id_reto'] = None
    
    NR = Retos()
    retos = []
    for reto in NR.getRetos():
        
        r = {
            'id' : reto.IdReto,
            "titulo" : reto.Titulo,
            "tipo" : reto.TipoReto
        }
        retos.append(r)
        
    return render(request, "Retos.html", {"retos" : retos})

def reto(request):
    NR = Retos()
    
    id = request.session.get('id_reto', None)
    
    print(id)
    if not id:
        return redirect(retos)
    
    
    partitura = NR.getPartituraPorIdReto(id)
    return render(request, "EditorReto.html",getParameters(partitura))
    
@csrf_exempt
def selectReto(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            
            id = data['id']
            
            request.session['id_reto'] = id
            
            return JsonResponse(data)
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)

def getParameters(partitura):
    buttons = [
        {'title': 'SemiFusa (7)', 'img': 'Semifusa.png', 'onclick': 'editor.setRithm(7)'},
        {'title': 'Fusa (6)', 'img': 'Fusa.png', 'onclick': 'editor.setRithm(6)'},
        {'title': 'SemiCorchea (5)', 'img': 'SemiCorchea.png', 'onclick': 'editor.setRithm(5)'},
        {'title': 'Corchea (4)', 'img': 'Corchea.png', 'onclick': 'editor.setRithm(4)'},
        {'title': 'Negra (3)', 'img': 'Negra.png', 'onclick': 'editor.setRithm(3)'},
        {'title': 'Blanca (2)', 'img': 'Blanca.png', 'onclick': 'editor.setRithm(2)'},
        {'title': 'Redonda (1)', 'img': 'Redonda.png', 'onclick': 'editor.setRithm(1)'},
        {'title': 'Puntillo (.)', 'img': 'Puntillo.png', 'onclick': 'editor.addDot()'},
        {'title': 'Silencio (r)', 'img': 'Silencio.png', 'onclick': 'editor.setRest()'},
        {'title': 'Doble Bemol (v)', 'img': 'DobleBemol.png', 'onclick': 'editor.setAccidental("bb")'},
        {'title': 'Bemol (b)', 'img': 'Bemol.png', 'onclick': 'editor.setAccidental("b")'},
        {'title': 'Natural (n)', 'img': 'Natural.png', 'onclick': 'editor.setAccidental("n")'},
        {'title': 'Sostenido (m)', 'img': 'Sostenido.png', 'onclick': 'editor.setAccidental("#")'},
        {'title': 'Doble Sostenido (,)', 'img': 'DobleSostenido.png', 'onclick': 'editor.setAccidental("##")'},
        {'title': 'Levato', 'img': 'Legato.png', 'onclick': 'editor.setLevato()'},
        {'title': 'Crecendo (8)', 'img': 'Crecendo.png', 'onclick': 'editor.setCrescendo()'},
        {'title': 'Triplet (0)', 'img': 'Triplet.png', 'onclick': 'editor.setTriplet()'},
        {'title': 'Más opciones', 'img': 'Plus.png', 'onclick': 'toggleDDPlus()'},
    ]
    
    dd_buttons = [
        {'title': 'Staccato (f)', 'img': 'Staccato.png', 'onclick': 'editor.setArticulation("a.")'},
        {'title': 'Staccatissimo (g)', 'img': 'Staccatissimo.png', 'onclick': 'editor.setArticulation("av")'},
        {'title': 'Marcato (h)', 'img': 'Marcato.png', 'onclick': 'editor.setArticulation("a^")'},
        {'title': 'Acento (j)', 'img': 'Acento.png', 'onclick': 'editor.setArticulation("a>")'},
        {'title': 'Tenuto (k)', 'img': 'Tenuto.png', 'onclick': 'editor.setArticulation("a-")'},
        {'title': 'Fermata (l)', 'img': 'Fermata.png', 'onclick': 'editor.setArticulation("a@a")'},
        {'title': 'Pianissimo (t)', 'img': 'PP.PNG', 'onclick': 'editor.setDynamic("pp")'},
        {'title': 'Piano (y)', 'img': 'P.PNG', 'onclick': 'editor.setDynamic("p")'},
        {'title': 'Mezzopiano (u)', 'img': 'MP.PNG', 'onclick': 'editor.setDynamic("mp")'},
        {'title': 'Mezzoforte (i)', 'img': 'MF.PNG', 'onclick': 'editor.setDynamic("mf")'},
        {'title': 'Forte (o)', 'img': 'F.PNG', 'onclick': 'editor.setDynamic("f")'},
        {'title': 'Fortissimo (p)', 'img': 'FF.PNG', 'onclick': 'editor.setDynamic("ff")'},
    ]
    
    datos = {
        'titulo': partitura.Titulo,
        'compositor': partitura.Compositor,
        'notacion': partitura.Notacion
    }
    
    return {'partitura': datos, 'buttons':buttons, 'dd_buttons':dd_buttons}
