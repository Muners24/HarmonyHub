from django.shortcuts import render,redirect

def inicio(request):
    
    if request.session.get('IdUsuario') == None:
        return redirect('/logout')
    

    return render(request, "Inicio.html")

    