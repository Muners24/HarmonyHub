from django.urls import path
from . import views

urlpatterns = [
    path('', views.pentagrama),
    path('exportMidi/', views.exportMidi, name='exportMidi'),
    path('importMidi/', views.importMidi, name='importMidi'),
]
