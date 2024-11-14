from django.urls import path
from . import views

urlpatterns = [
    path('', views.pentagrama),
    path('exportMidi/', views.exportMidi, name='exportMidi'),
]

"""
urlpatterns = [
    path('', views.pentagrama, name='pentagrama'),
    path('importar-midi/', views.importar_midi, name='importar_midi'),
    
]
"""