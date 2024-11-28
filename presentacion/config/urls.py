from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('inicio/',include('inicio.urls')),
    path('editor/',include('editor.urls')),
    path('retos/',include('retos.urls')),
    path('',include('Sessions.urls')),
    path('buscador/',include('buscador.urls'))
]
