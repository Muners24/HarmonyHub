from django.urls import path
from . import views

urlpatterns = [
    path('', views.resultados,name="resultados"),
    path('selCategoria/', views.selCategoria,name="selCategoria"),
    path('categoria/', views.categoria,name="categoria"),
]
