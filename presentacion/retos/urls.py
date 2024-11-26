from django.urls import path
from . import views

urlpatterns = [
    path('', views.retos),
    path('reto/',views.reto),
    path('selectReto/',views.selectReto),
]
