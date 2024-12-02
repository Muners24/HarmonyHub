from django.shortcuts import render, redirect
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from negocios.pefiles.N_Perfil import N_Perfil

def PerfilView(request):
    if request.session.get('IdUsuario') is None:
        return redirect('/logout')

    NP = N_Perfil()

    respuesta = NP.datosPerfil(request.session.get('IdUsuario'))

    if respuesta['error']:
        return render(request, "Profile.html", {'error': respuesta['error']})

    return render(request, "Profile.html", respuesta)

def perfiles(request):
    if request.session.get('IdUsuario') is None:
        return redirect('/logout')

    if request.session.get('IdUsuarioBuscar') == None:
        return redirect('/buscador')
    
    NP = N_Perfil()
    
    respuesta = NP.datosPerfil(request.session.get('IdUsuarioBuscar'))

    if respuesta['error']:
        return render(request, "Profile.html", {'error': respuesta['error']})

    return render(request, "Profile.html", respuesta)