from django.contrib import admin
from django.urls import path, include
from editor import views

urlpatterns = [
    path('editor/',include('editor.urls')),
    path('',include('inicio.urls')),
    path('retos/',include('retos.urls'))
]
