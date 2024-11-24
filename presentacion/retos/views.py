from django.shortcuts import render
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt


def retos(request):
    
    return render(request, "Retos.html")