from django.shortcuts import render, redirect
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from negocios.retos.N_Partitura import N_Partitura
from negocios.retos.N_Participacion import N_Participacion	
from negocios.N_Likes import N_Like
from entidades.E_Like import E_Like

def participacion(request):
    idUsuario = request.session.get("IdUsuario")
    if  idUsuario == None:
        return redirect("/logout")

    idParticipacion = request.session.get("IdParticipacionBuscar")
    
    if idParticipacion == None:
        return redirect('/buscador/')

    NP = N_Participacion()
    NL = N_Like()

    resultado = NP.getParticipacionPorId(idParticipacion)
    
    if resultado['votable']:
        resultado['like'] = NL.getLike(E_Like(idLike=0,idParticipacion=idParticipacion,idUsuario=idUsuario))
    
    
    return render(request, "Participacion.html",resultado)

def registrarLike(request):
    idUsuario = request.session.get("IdUsuario")
    if  idUsuario == None:
        return redirect("/logout")
    
    idParticipacion = request.session.get("IdParticipacionBuscar")
    if idParticipacion == None:
        return redirect('/buscador/')
    
    
    NL = N_Like()
    if NL.registrarLike(E_Like(idLike=0,idParticipacion=idParticipacion,idUsuario=idUsuario)):
        print('like registrado')
        
    
    return redirect(participacion)

def anularLike(request):
    
    idUsuario = request.session.get("IdUsuario")
    if  idUsuario == None:
        return redirect("/logout")
    
    idParticipacion = request.session.get("IdParticipacionBuscar")
    if idParticipacion == None:
        return redirect('/buscador/')
    
    NL = N_Like()
    NL.borrarLike(
        E_Like(idLike=0,idParticipacion=idParticipacion,idUsuario=idUsuario)
    )
    
    return redirect(participacion)