from django.urls import path
from . import views

urlpatterns = [
    path('', views.buscador,name='buscador'),
    path('buscar/',views.buscar,name='buscar'),
    path('query/',views.query,name='query'),
    path('verPerfil/',views.verPerfil,name='verPerfil'),
]
