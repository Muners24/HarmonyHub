from django.urls import path
from . import views

urlpatterns = [
    path('', views.retos),
    path('reto/',views.reto,name='reto'),
    path('selectReto/',views.selectReto,name='selectReto'),
    path('participarReto/',views.participarReto,name='participarReto'),
]
