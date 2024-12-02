from django.urls import path
from . import views

urlpatterns = [
    path('', views.participacion,name='participacion'),
    path('anularLike/', views.anularLike,name='anularLike'),
    path('registrarLike/', views.registrarLike,name='registrarLike'),
]
