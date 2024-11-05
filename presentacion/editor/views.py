from django.shortcuts import render

# Create your views here.
# mi_aplicacion/views.py

def pentagrama(request):
    var = 'zasd'
    return render(request, 'Editor.html',{
        'var' : var
    })
