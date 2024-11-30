from django.urls import path
from . import views

urlpatterns = [
    path('', views.PerfilView, name='perfil'),
]
