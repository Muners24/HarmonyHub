from django.shortcuts import render

# Create your views here.
def pentagrama(request):
    var = 'zasd'
    return render(request, 'Editor.html',{
        'var' : var
    })