from django.shortcuts import render
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt


def inicio(request):
    
    return render(request, "Inicio.html")