from django.shortcuts import render, redirect
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from negocios.pefiles.N_Perfil import N_Perfil

def PerfilView(request):
    if request.session.get('IdUsuario') is None:
        return redirect('/logout')

    NP = N_Perfil()

    datos = NP.datosPerfil(request.session.get('IdUsuario'))

    if datos['error']:
        return render(request, "Profile.html", {'error': datos['error']})

    nombre = datos['nombre']
    descripcion = datos['descripcion']
    nivel = datos['nivel']
    img = datos['img']
    progreso = datos['progreso']
    porcentaje = datos['porcentaje']
    participaciones = datos['participaciones']

    context = {
        'img': img,
        'nombre': nombre,
        'descripcion': descripcion,
        'nivel': nivel,
        'progreso': progreso,
        'porcentaje': porcentaje,
        'participaciones': participaciones.get('participaciones', [])
    }

    return render(request, "Profile.html", context)

def perfiles(request):
    if request.session.get('IdUsuario') is None:
        return redirect('/logout')

    if request.session.get('IdUsuarioBuscar') == None:
        return redirect('/buscador')
    
    NP = N_Perfil()

    datos = NP.datosPerfil(request.session.get('IdUsuarioBuscar'))

    if datos['error']:
        return render(request, "Profile.html", {'error': datos['error']})

    nombre = datos['nombre']
    descripcion = datos['descripcion']
    nivel = datos['nivel']
    img = datos['img']
    progreso = datos['progreso']
    porcentaje = datos['porcentaje']
    participaciones = datos['participaciones']

    context = {
        'img': img,
        'nombre': nombre,
        'descripcion': descripcion,
        'nivel': nivel,
        'progreso': progreso,
        'porcentaje': porcentaje,
        'participaciones': participaciones.get('participaciones', [])
    }

    return render(request, "Profile.html", context)